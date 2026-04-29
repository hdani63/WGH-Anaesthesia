import { request } from './apiClient';

export const aiService = {
  medicationReview(medications, surgeryType, patientInfo = '') {
    return request('/ai/med-review', {
      method: 'POST',
      body: JSON.stringify({ medications, surgery_type: surgeryType, patient_info: patientInfo }),
    });
  },
  interaction(drugs, context = '') {
    return request('/ai/interaction', {
      method: 'POST',
      body: JSON.stringify({ drugs, context }),
    });
  },
  allergy(allergen, drugs) {
    return request('/ai/allergy', {
      method: 'POST',
      body: JSON.stringify({ allergen, drugs }),
    });
  },
  airway(data) {
    return request('/ai/airway', { method: 'POST', body: JSON.stringify(data) });
  },
  regional(data) {
    return request('/ai/regional', { method: 'POST', body: JSON.stringify(data) });
  },
  fasting(data) {
    return request('/ai/fasting', { method: 'POST', body: JSON.stringify(data) });
  },
  planning(data) {
    return request('/ai/planning', { method: 'POST', body: JSON.stringify(data) });
  },
  dose(data) {
    return request('/ai/dose', { method: 'POST', body: JSON.stringify(data) });
  },
  herbal(name) {
    return request('/ai/herbal', { method: 'POST', body: JSON.stringify({ name }) });
  },
  handover(data) {
    return request('/ai/handover', { method: 'POST', body: JSON.stringify(data) });
  },
  consent(data) {
    return request('/ai/consent', { method: 'POST', body: JSON.stringify(data) });
  },
  caseLearning(topic, level) {
    return request('/ai/case-learning', {
      method: 'POST',
      body: JSON.stringify({ topic, level }),
    });
  },
  quiz(topic, level, num = 5) {
    return request('/ai/quiz', {
      method: 'POST',
      body: JSON.stringify({ topic, level, num }),
    });
  },
  protocol(question) {
    return request('/ai/protocol', {
      method: 'POST',
      body: JSON.stringify({ question }),
    });
  },
  crossref(situation) {
    return request('/ai/crossref', {
      method: 'POST',
      body: JSON.stringify({ situation }),
    });
  },
};
