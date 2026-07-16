#!/usr/bin/env python3
"""
Fidelity check: every piece of visible text in the source HTML must survive
into the converted JSON. Reports any dropped text, per section.

This is the safety net for the conversion — the content is drug dosing, so a
silently dropped row is the failure mode that matters.

The one intended exception is the duplicate headings the converter removes (see
dedupe_headings there). Those are credited back before comparing, so they can't
mask a real loss: the check stays strict about everything else.
"""
import json
import pathlib
import re
import sys
from html.parser import HTMLParser

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from convert_uhw_guidelines import build_sections  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parents[1]
SRC = ROOT / "Anaesthesia-Companion/templates/uhw_guidelines.html"
JSON = ROOT / "src/data/uhwGuidelines.json"


def source_sections():
    """Split the source template into (section_id, html) pairs."""
    raw = SRC.read_text()
    raw = re.sub(r"\{%.*?%\}", "", raw, flags=re.S)
    raw = re.sub(r"\{\{.*?\}\}", "", raw, flags=re.S)
    marks = [
        (m.start(), m.group(1))
        for m in re.finditer(r'<div id="section-item-(uhw-[a-z0-9\-]+)"', raw)
    ]
    bounds = [m[0] for m in marks] + [len(raw)]
    return [(sid, raw[bounds[i]: bounds[i + 1]]) for i, (_, sid) in enumerate(marks)]

# chrome present in the source that is deliberately not ported.
# Matched as whole phrases only — a bare "Clear" would eat "Clearance".
IGNORE_SUBSTR = [
    "Search antimicrobials", "Search guidelines", "Clear search",
    "No matches found", "guideline found", "guidelines found",
]

SKIP = {"script", "style", "button"}
VOID = {"input", "img", "br", "hr", "meta", "link", "col", "source"}


class Text(HTMLParser):
    """Visible text of an HTML fragment, skipping non-content chrome."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.buf = []
        self.skip = 0

    def handle_starttag(self, tag, attrs):
        if tag in VOID:          # void: no end tag, must not gate the counter
            return
        if tag in SKIP:
            self.skip += 1

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if tag in SKIP:
            self.skip = max(0, self.skip - 1)

    def handle_data(self, d):
        if not self.skip:
            self.buf.append(d)

    def text(self):
        return " ".join(self.buf)


def norm(s):
    s = s.replace("\xa0", " ")
    s = re.sub(r"[‐-―]", "-", s)      # unify dashes
    s = re.sub(r"[‘’]", "'", s)
    s = re.sub(r"[“”]", '"', s)
    s = re.sub(r"\s+", " ", s)
    return s.strip()


def words(s):
    """Content tokens, lowercased. Keeps digits/units so doses are compared."""
    return re.findall(r"[a-z0-9][a-z0-9./%-]*", norm(s).lower())


def json_text(blocks, acc):
    for b in blocks:
        t = b.get("t")
        if "runs" in b:
            acc.append("".join(r["s"] for r in b["runs"]))
        if b.get("badge"):
            acc.append(b["badge"])
        if b.get("alt"):
            acc.append(b["alt"])
        for sub in b.get("blocks", []) or []:
            json_text([sub], acc)
        for item in b.get("items", []) or []:
            json_text(item, acc)
        if t == "table":
            for h in b.get("header", []) or []:
                acc.append("".join(r["s"] for r in h))
            for row in b.get("rows", []):
                if "section" in row:
                    json_text(row["section"], acc)
                for cell in row.get("cells", []) or []:
                    json_text(cell, acc)
    return acc


def main():
    data = {s["id"]: s for s in json.loads(JSON.read_text())}
    # Ask the converter which duplicate headings it removed, so they can be
    # credited back rather than reported as loss.
    _, dropped_by_id = build_sections()
    total_missing = 0
    total_dupes = 0
    ok = True

    for sid, raw in source_sections():
        if sid not in data:
            print(f"!! {sid}: MISSING FROM OUTPUT")
            ok = False
            continue

        p = Text()
        p.feed(raw)
        src_txt = p.text()
        for ig in IGNORE_SUBSTR:
            src_txt = src_txt.replace(ig, " ")

        dupes = dropped_by_id.get(sid, [])
        total_dupes += len(dupes)

        src = words(src_txt)
        out = words(" ".join(json_text(data[sid]["blocks"], [])) + " " + " ".join(dupes))

        # multiset difference: what the source has that the output does not
        from collections import Counter
        miss = Counter(src) - Counter(out)
        extra = Counter(out) - Counter(src)
        n = sum(miss.values())
        total_missing += n
        flag = "OK " if n == 0 else "MISS"
        if n:
            ok = False
        print(f"{flag} {sid:36s} src={len(src):>5}  out={len(out):>5}  missing={n:>4}"
              + (f"  extra={sum(extra.values())}" if extra else ""))
        if n:
            print(f"      dropped tokens: {dict(list(miss.items())[:15])}")

    print("\nTOTAL MISSING TOKENS:", total_missing)
    print("duplicate headings removed (credited back above):", total_dupes)
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
