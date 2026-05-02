import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import ScreenWrapper from '../components/ScreenWrapper';
import { COLORS, BORDER_RADIUS, SHADOW, SPACING } from '../utils/theme';
import { aiService } from '../services/aiService';

const TABS = { education: 'education', search: 'search' };

export default function AIEducationScreen() {
  const [tab, setTab] = useState(TABS.education);
  const [results, setResults] = useState({});
  const [loadingKey, setLoadingKey] = useState('');
  const [quizState, setQuizState] = useState({ questions: [], answered: [], score: 0 });

  const [caseTopic, setCaseTopic] = useState('');
  const [caseLevel, setCaseLevel] = useState('MCAI');
  const [quizTopic, setQuizTopic] = useState('');
  const [quizLevel, setQuizLevel] = useState('MCAI');
  const [protocolQuestion, setProtocolQuestion] = useState('');
  const quizHint = useMemo(() => ({
    MCAI: 'Entry-level Irish anesthesia exam covering core clinical knowledge, basic sciences and safe clinical practice.',
    'Primary FRCA': 'Basic sciences focus: physiology, pharmacology, physics & measurement, anatomy.',
    FCAI: 'Advanced clinical anesthesia, subspecialties, critical care, pain, and complex management.',
    'Final FRCA': 'Advanced clinical examination with SOE-style questioning, written paper, statistics and evidence-based practice.',
  })[quizLevel] || '', [quizLevel]);

  const run = async (fn) => {
    try {
      const data = await fn();
      return data?.result ?? '';
    } catch (e) {
      Alert.alert('Error', e.message || 'Request failed');
      return e.message || 'Request failed';
    }
  };

  const runSection = async (key, fn) => {
    setLoadingKey(key);
    const output = await run(fn);
    if (key === 'quiz') {
      try {
        const cleaned = String(output || '').replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
        const start = cleaned.indexOf('[');
        const end = cleaned.lastIndexOf(']');
        const jsonCandidate = start !== -1 && end !== -1 && end > start ? cleaned.slice(start, end + 1) : cleaned;
        const parsed = JSON.parse(jsonCandidate);
        if (Array.isArray(parsed) && parsed.length) {
          setQuizState({ questions: parsed.map(normalizeQuestion), answered: new Array(parsed.length).fill(false), score: 0 });
          setResults((prev) => ({ ...prev, [key]: '' }));
        } else {
          setQuizState({ questions: [], answered: [], score: 0 });
          setResults((prev) => ({ ...prev, [key]: output }));
        }
      } catch {
        setQuizState({ questions: [], answered: [], score: 0 });
        setResults((prev) => ({ ...prev, [key]: output }));
      }
      setLoadingKey('');
      return;
    }
    setResults((prev) => ({ ...prev, [key]: output }));
    setLoadingKey('');
  };

  return (
    <ScreenWrapper title="AI Clinical Assistant" subtitle="For qualified medical professionals only" icon="robot">
      <View style={styles.banner}>
        <View style={styles.bannerRow}>
          <FontAwesome5 name="exclamation-triangle" size={14} color="#8a6d1d" />
          <Text style={styles.bannerTitle}>Clinical Disclaimer</Text>
        </View>
        <Text style={styles.bannerText}>AI responses are decision-support aids only. Always apply clinical judgement and verify against current WGH protocols and guidelines.</Text>
      </View>

      <View style={styles.tabs}>
        <TabBtn active={tab === TABS.education} label="Education" onPress={() => setTab(TABS.education)} />
        <TabBtn active={tab === TABS.search} label="Clinical Protocol Search" onPress={() => setTab(TABS.search)} />
      </View>

      {tab === TABS.education ? (
        <>
          <Card title="Case-Based Learning Generator" subtitle="Exam-calibrated clinical scenarios — MCAI · Primary FRCA · FCAI · Final FRCA" accent="pink">
            <ExamLevelRow level={caseLevel} onChange={setCaseLevel} />
            <Field label="Topic *" value={caseTopic} onChangeText={setCaseTopic} placeholder="e.g. Difficult airway, Malignant hyperthermia, Obstetric haemorrhage, Paediatric..." />
            <Field label="Exam Level *" value={caseLevel} onChangeText={setCaseLevel} />
            <Text style={styles.hint}>{quizHint}</Text>
            <Action onPress={() => runSection('case', () => aiService.caseLearning(caseTopic, caseLevel))} label="Generate Case" variant="pink" loading={loadingKey === 'case'} />
            <ResultBox value={results.case} />
          </Card>

          <Card title="Exam MCQ Practice" subtitle="Exam-style MCQs — MCAI · Primary FRCA · FCAI · Final FRCA" accent="orange">
            <ExamLevelRow level={quizLevel} onChange={setQuizLevel} />
            <Field label="Topic *" value={quizTopic} onChangeText={setQuizTopic} placeholder="e.g. Neuromuscular blockers, Opioid pharmacology, Anatomy of..." />
            <Field label="Exam Level *" value={quizLevel} onChangeText={setQuizLevel} />
            <Text style={styles.hint}>{quizHint}</Text>
            <Action onPress={() => runSection('quiz', () => aiService.quiz(quizTopic, quizLevel, 5))} label="Start Quiz (5 Questions)" variant="orange" loading={loadingKey === 'quiz'} />
            <QuizBox quizState={quizState} setQuizState={setQuizState} />
            {results.quiz ? <Text style={styles.quizErrorText}>{results.quiz}</Text> : null}
          </Card>
        </>
      ) : (
        <Card title="Clinical Protocol Search" subtitle="Natural language search across anesthesia guidelines" accent="blue">
          <Field label="Ask a Clinical Question *" value={protocolQuestion} onChangeText={setProtocolQuestion} multiline placeholder="e.g. Can I use spinal anesthesia in a patient who had their last dose of apixaban 18 hours ago? / What is the recommended RSI sequence for a full stomach patient with known difficult airway?" />
          <Action onPress={() => runSection('protocol', () => aiService.protocol(protocolQuestion))} label="Search" variant="blue" loading={loadingKey === 'protocol'} />
          <ResultBox value={results.protocol} />
        </Card>
      )}
    </ScreenWrapper>
  );
}

function ExamLevelRow({ level, onChange }) {
  const levels = ['MCAI', 'Primary FRCA', 'FCAI', 'Final FRCA'];
  return (
    <View style={styles.levelRow}>
      {levels.map((name) => (
        <TouchableOpacity key={name} onPress={() => onChange(name)} style={[styles.levelChip, level === name && styles.levelChipActive]} activeOpacity={0.85}>
          <Text style={[styles.levelChipText, level === name && styles.levelChipTextActive]}>{name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function TabBtn({ active, label, onPress }) {
  return <TouchableOpacity onPress={onPress} style={[styles.tabBtn, active && styles.tabBtnActive]} activeOpacity={0.85}><Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text></TouchableOpacity>;
}

function Card({ title, subtitle, children, accent = 'blue' }) {
  return (
    <View style={[styles.card, styles[`card_${accent}`]]}>
      <View style={[styles.cardHeader, styles[`cardHeader_${accent}`]]}>
        <FontAwesome5 name={accent === 'orange' ? 'question-circle' : accent === 'pink' ? 'chalkboard-teacher' : 'graduation-cap'} size={14} color={COLORS.white} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      {subtitle ? <Text style={styles.cardSubtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

function Field({ label, multiline, placeholder, ...props }) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        placeholder={placeholder}
        placeholderTextColor="#6c757d"
        multiline={multiline}
        style={[styles.input, multiline && styles.multiline]}
      />
    </>
  );
}

function Action({ label, onPress, variant = 'blue', loading = false }) {
  return (
    <TouchableOpacity style={[styles.action, styles[`action_${variant}`], loading && styles.actionLoading]} onPress={onPress} disabled={loading}>
      {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.actionText}>{label}</Text>}
    </TouchableOpacity>
  );
}

function ResultBox({ value }) {
  if (!value) return null;
  return (
    <View style={styles.resultBox}>
      <View style={styles.resultHeader}>
        <Text style={styles.resultHeaderText}>Result</Text>
      </View>
      <ScrollView style={styles.resultScroll} nestedScrollEnabled>
        <View style={styles.resultContent}>
          <MarkdownText text={value} />
        </View>
      </ScrollView>
    </View>
  );
}

function QuizBox({ quizState, setQuizState }) {
  if (!quizState.questions.length) return null;

  const handleAnswer = (qi, selected) => {
    if (quizState.answered[qi]) return;
    const q = quizState.questions[qi];
    const correct = q.correct;
    const isCorrect = selected === correct;
    const answered = [...quizState.answered];
    answered[qi] = true;
    const score = quizState.score + (isCorrect ? 1 : 0);
    const questions = [...quizState.questions];
    questions[qi] = { ...questions[qi], selected };
    setQuizState((prev) => ({ ...prev, answered, score, questions }));
  };

  return (
    <View style={styles.quizWrap}>
      <View style={styles.quizScoreBar}>
        <Text style={styles.quizScoreText}>Score: {quizState.score} / {quizState.questions.length}</Text>
        <Text style={styles.quizScoreText}>{quizState.answered.filter(Boolean).length} answered</Text>
      </View>
      {quizState.questions.map((q, qi) => {
        const answered = quizState.answered[qi];
        return (
          <View key={qi} style={styles.quizCard}>
            <Text style={styles.quizQuestion}><Text style={styles.quizBadge}>Q{qi + 1}</Text> {q.q}</Text>
            {['A', 'B', 'C', 'D', 'E'].map((letter) => {
              const text = q.options?.[letter];
              if (!text) return null;
              const isCorrect = letter === q.correct;
              const isSelected = answered && q.selected === letter;
              return (
                <TouchableOpacity
                  key={letter}
                  style={[
                    styles.quizOption,
                    answered && isCorrect && styles.quizOptionCorrect,
                    answered && isSelected && !isCorrect && styles.quizOptionWrong,
                  ]}
                  disabled={answered}
                  onPress={() => handleAnswer(qi, letter)}
                >
                  <Text style={styles.quizOptionText}><Text style={styles.quizLetter}>{letter}.</Text> {text}</Text>
                </TouchableOpacity>
              );
            })}
            {answered ? (
              <View style={styles.quizExplanation}>
                <Text style={styles.quizExplanationText}>
                  {q.explanation || 'No explanation available.'}
                </Text>
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

function normalizeQuestion(q) {
  const optionSource = q.options || q.Options || q.choices || {};
  const normalizedOptions = normalizeOptions(optionSource);
  return {
    q: q.q || q.question || q.stem || '',
    options: normalizedOptions,
    correct: String(q.correct || q.answer || '').trim().toUpperCase(),
    explanation: q.explanation || q.rationale || '',
    selected: null,
  };
}

function normalizeOptions(source) {
  const letters = ['A', 'B', 'C', 'D', 'E'];
  const out = { A: '', B: '', C: '', D: '', E: '' };

  if (Array.isArray(source)) {
    letters.forEach((l, i) => { out[l] = String(source[i] ?? ''); });
    return out;
  }

  if (source && typeof source === 'object') {
    letters.forEach((l, i) => {
      out[l] =
        String(
          source[l] ??
          source[l.toLowerCase()] ??
          source[`option_${l.toLowerCase()}`] ??
          source[String(i)] ??
          source[String(i + 1)] ??
          ''
        );
    });
  }

  return out;
}

function MarkdownText({ text }) {
  const lines = String(text || '').split('\n');
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return <Text key={idx} style={styles.resultParagraph}>{' '}</Text>;
    if (trimmed.startsWith('# ')) {
      return <Text key={idx} style={styles.mdHeading}>{trimmed.slice(2)}</Text>;
    }
    if (/^(PART\s+\d+|Q\d+)\b/i.test(trimmed)) {
      return <Text key={idx} style={styles.mdSection}>{renderInlineMarkdown(trimmed)}</Text>;
    }
    if (/^\d+\.\s+/.test(trimmed)) {
      return <Text key={idx} style={styles.mdListItem}>{renderInlineMarkdown(trimmed)}</Text>;
    }
    if (/^[-*]\s+/.test(trimmed)) {
      const item = trimmed.replace(/^[-*]\s+/, '• ');
      return <Text key={idx} style={styles.mdListItem}>{renderInlineMarkdown(item)}</Text>;
    }
    return <Text key={idx} style={styles.resultParagraph}>{renderInlineMarkdown(trimmed)}</Text>;
  });
}

function renderInlineMarkdown(input) {
  const chunks = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let last = 0;
  let match;
  while ((match = regex.exec(input)) !== null) {
    if (match.index > last) chunks.push(input.slice(last, match.index));
    const token = match[0];
    if (token.startsWith('**')) chunks.push(<Text key={`${match.index}-b`} style={styles.mdBold}>{token.slice(2, -2)}</Text>);
    else if (token.startsWith('*')) chunks.push(<Text key={`${match.index}-i`} style={styles.mdItalic}>{token.slice(1, -1)}</Text>);
    else chunks.push(<Text key={`${match.index}-c`} style={styles.mdCode}>{token.slice(1, -1)}</Text>);
    last = match.index + token.length;
  }
  if (last < input.length) chunks.push(input.slice(last));
  return chunks;
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', marginBottom: SPACING.md, gap: 8 },
  tabBtn: { flex: 1, padding: 12, borderRadius: 999, backgroundColor: '#f0f4f8', borderWidth: 1, borderColor: '#d8e6f7', alignItems: 'center' },
  tabBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary, shadowColor: '#0d6efd', shadowOpacity: 0.25, shadowRadius: 8, elevation: 2 },
  tabText: { fontWeight: '700', color: '#1a3a5c', fontSize: 12 },
  tabTextActive: { color: COLORS.white },
  banner: { backgroundColor: '#fff4d6', borderWidth: 1, borderColor: '#f0d98b', borderRadius: BORDER_RADIUS, padding: SPACING.md, marginBottom: SPACING.md },
  bannerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 6 },
  bannerTitle: { fontWeight: '800', color: '#8a6d1d', marginBottom: 4 },
  bannerText: { color: '#6f5a1b', lineHeight: 18, fontSize: 12 },
  card: { backgroundColor: COLORS.cardBg, borderRadius: BORDER_RADIUS, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOW, overflow: 'hidden' },
  card_blue: { borderWidth: 1, borderColor: '#cfe3ff' },
  card_pink: { borderWidth: 1, borderColor: '#f8c8de' },
  card_orange: { borderWidth: 1, borderColor: '#ffd7a8' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, margin: -SPACING.md, marginBottom: 10, paddingHorizontal: SPACING.md, paddingVertical: 10 },
  cardHeader_blue: { backgroundColor: COLORS.medicalBlue },
  cardHeader_pink: { backgroundColor: '#c2185b' },
  cardHeader_orange: { backgroundColor: '#c75e00' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.white },
  cardSubtitle: { fontSize: 12, color: COLORS.textMuted, marginBottom: 10, lineHeight: 17 },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 10, marginBottom: 12, backgroundColor: COLORS.white, color: COLORS.text },
  multiline: { minHeight: 74, textAlignVertical: 'top' },
  action: { backgroundColor: COLORS.primary, padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 2 },
  action_blue: { backgroundColor: COLORS.primary },
  action_pink: { backgroundColor: COLORS.medicalRed },
  action_orange: { backgroundColor: '#fd7e14' },
  actionLoading: { opacity: 0.85 },
  actionText: { color: COLORS.white, fontWeight: '700' },
  hint: { fontSize: 12, color: COLORS.textMuted, marginBottom: 10, lineHeight: 18 },
  levelRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 10 },
  levelChip: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: '#d8e6f7', backgroundColor: '#f0f4f8' },
  levelChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  levelChipText: { fontSize: 11, fontWeight: '700', color: '#1a3a5c' },
  levelChipTextActive: { color: COLORS.white },
  resultScroll: { maxHeight: 250 },
  resultBox: { marginTop: SPACING.md, borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS, overflow: 'hidden', backgroundColor: COLORS.white },
  resultHeader: { backgroundColor: COLORS.medicalBlue, paddingHorizontal: SPACING.md, paddingVertical: 10 },
  resultHeaderText: { color: COLORS.white, fontWeight: '700' },
  resultContent: { padding: SPACING.md },
  resultParagraph: { lineHeight: 21, color: COLORS.text, marginBottom: 10 },
  mdHeading: { fontSize: 16, fontWeight: '800', color: COLORS.medicalBlue, marginBottom: 10 },
  mdSection: { fontSize: 14, fontWeight: '800', color: '#1a3a5c', marginTop: 4, marginBottom: 8, lineHeight: 21 },
  mdListItem: { lineHeight: 21, color: COLORS.text, marginBottom: 6 },
  mdBold: { fontWeight: '800', color: COLORS.text },
  mdItalic: { fontStyle: 'italic', color: COLORS.text },
  mdCode: { fontFamily: 'monospace', backgroundColor: '#f1f3f5', color: COLORS.text, paddingHorizontal: 4 },
  quizWrap: { marginTop: SPACING.md },
  quizScoreBar: { backgroundColor: '#1a3a5c', padding: SPACING.md, borderRadius: BORDER_RADIUS, flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md },
  quizScoreText: { color: COLORS.white, fontWeight: '700', fontSize: 12 },
  quizCard: { borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS, marginBottom: SPACING.md, overflow: 'hidden', backgroundColor: COLORS.white },
  quizQuestion: { padding: SPACING.md, backgroundColor: '#f8f9fa', color: COLORS.text, fontWeight: '700', lineHeight: 20 },
  quizBadge: { backgroundColor: '#6c757d', color: COLORS.white, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  quizOption: { padding: SPACING.md, borderTopWidth: 1, borderTopColor: '#edf0f3' },
  quizOptionCorrect: { backgroundColor: '#e8f5e9' },
  quizOptionWrong: { backgroundColor: '#fce4ec' },
  quizOptionText: { color: COLORS.text, lineHeight: 20 },
  quizLetter: { fontWeight: '800' },
  quizExplanation: { padding: SPACING.md, backgroundColor: '#f8f9fa', borderTopWidth: 1, borderTopColor: '#edf0f3' },
  quizExplanationText: { color: COLORS.text, lineHeight: 20 },
  quizErrorText: { marginTop: SPACING.sm, color: '#b02a37', fontSize: 12, lineHeight: 18 },
});
