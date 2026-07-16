#!/usr/bin/env python3
"""
Convert Anaesthesia-Companion/templates/uhw_guidelines.html (Flask/Bootstrap accordion)
into a structured JSON block tree consumable by the React Native renderer.

Fidelity over cleverness: every <td>, <li> and <p> in the source must survive into
the output. Medical dose text is never reflowed or abbreviated.
"""
import json
import pathlib
import re
import sys
from html.parser import HTMLParser
from html import unescape

ROOT = pathlib.Path(__file__).resolve().parents[1]
SRC = ROOT / "Anaesthesia-Companion/templates/uhw_guidelines.html"
OUT = ROOT / "src/data/uhwGuidelines.json"

SKIP_TAGS = {"script", "style", "button", "svg"}
BOLD_TAGS = {"strong", "b", "mark"}
ITAL_TAGS = {"em", "i"}
# Void elements never emit an end tag; they must never touch the open-element
# stack or a skip counter, or they swallow the rest of the document.
VOID_TAGS = {
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr",
}
# Interactive chrome (search bars etc.) that carries no guideline content.
DROP_TAGS = {"input"}


def clean_ws(s):
    return re.sub(r"[ \t\r\f\v]+", " ", s.replace("\xa0", " "))


class BlockParser(HTMLParser):
    """Parse a fragment of guideline HTML into a list of block dicts."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = [{"t": "root", "children": []}]
        self.open = []          # every open element: (tag, pushed_a_node?)
        self.runs = []          # inline runs accumulating for current text block
        self.bold = 0
        self.ital = 0
        self.skip = 0
        self.in_icon = 0

    # ---- helpers -------------------------------------------------------
    @property
    def cur(self):
        return self.stack[-1]

    def push(self, node):
        self.cur["children"].append(node)
        self.stack.append(node)

    def open_el(self, tag, node=None):
        """Record an open element, optionally pushing a block node for it."""
        if node is not None:
            self.push(node)
        self.open.append((tag, node is not None))

    def close_el(self, tag):
        """Close the nearest matching open element, popping any nodes it owns.

        Unmatched/implicitly-closed tags are tolerated: we walk back to the
        nearest same-tag element and unwind everything opened inside it.
        """
        for i in range(len(self.open) - 1, -1, -1):
            if self.open[i][0] == tag:
                for _, pushed in reversed(self.open[i:]):
                    if pushed and len(self.stack) > 1:
                        self.stack.pop()
                del self.open[i:]
                return True
        return False

    def flush(self, as_t="p"):
        """Emit accumulated inline runs as a text block."""
        runs = norm_runs(self.runs)
        self.runs = []
        if runs:
            self.cur["children"].append({"t": as_t, "runs": runs})

    # ---- handlers ------------------------------------------------------
    def handle_startendtag(self, tag, attrs):
        # <br/>, <img .../> — self-closing form never reaches handle_endtag
        self.handle_starttag(tag, attrs)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        cls = a.get("class", "")

        # --- void elements: emit inline, never touch the element stack
        if tag in VOID_TAGS:
            if self.skip or tag in DROP_TAGS:
                return
            if tag == "br":
                self.runs.append({"s": "\n"})
            elif tag == "img":
                self.flush()
                src = a.get("src", "")
                self.cur["children"].append(
                    {"t": "img", "src": src.rsplit("/", 1)[-1], "alt": a.get("alt", "")}
                )
            elif tag == "hr":
                self.flush()
                self.cur["children"].append({"t": "hr"})
            return

        if tag in SKIP_TAGS:
            self.skip += 1
            self.open.append((tag, False))
            return
        if self.skip:
            self.open.append((tag, False))
            return

        # FontAwesome decorative icons: <i class="fas fa-..."></i> carry no text
        if tag == "i" and re.search(r"\bfa[bsrl]?\b|\bfa-", cls):
            self.in_icon += 1
            self.open.append((tag, False))
            return

        if tag in BOLD_TAGS:
            self.bold += 1
            self.open.append((tag, False))
            return
        if tag in ITAL_TAGS:
            self.ital += 1
            self.open.append((tag, False))
            return

        if tag in ("h1", "h2", "h3", "h4", "h5"):
            self.flush()
            self.open_el(tag, {"t": "h", "level": int(tag[1]), "children": []})
            return

        if tag == "p":
            self.flush()
            self.open_el(tag)
            return

        if tag == "div":
            # Bootstrap alert boxes become first-class callout blocks
            m = re.search(r"alert-(danger|warning|info|success|primary|secondary)", cls)
            if m:
                self.flush()
                self.open_el(tag, {"t": "alert", "variant": m.group(1), "children": []})
            else:
                self.open_el(tag)
            return

        if tag == "span":
            if "badge" in cls:
                self.flush()
                self.open_el(tag, {"t": "badge", "children": []})
            else:
                self.open_el(tag)
            return

        if tag in ("ul", "ol"):
            self.flush()
            self.open_el(tag, {"t": "list", "ordered": tag == "ol", "children": []})
            return

        if tag == "li":
            # <li> without </li> is legal HTML; close any still-open sibling
            if self.open and self.open[-1][0] == "li":
                self.flush()
                self.close_el("li")
            self.flush()
            self.open_el(tag, {"t": "li", "children": []})
            return

        if tag == "table":
            self.flush()
            self.open_el(tag, {"t": "table", "children": []})
            return

        if tag == "tr":
            self.flush()
            self.open_el(tag, {"t": "tr", "children": []})
            return

        if tag in ("td", "th"):
            self.flush()
            node = {"t": "td", "children": []}
            if a.get("colspan"):
                try:
                    node["colspan"] = int(a["colspan"])
                except ValueError:
                    pass
            self.open_el(tag, node)
            return

        self.open_el(tag)

    def handle_endtag(self, tag):
        if tag in VOID_TAGS:
            return

        if tag in SKIP_TAGS:
            self.skip = max(0, self.skip - 1)
            self.close_el(tag)
            return
        if self.skip:
            self.close_el(tag)
            return

        if tag == "i" and self.in_icon:
            self.in_icon -= 1
            self.close_el(tag)
            return

        if tag in BOLD_TAGS:
            self.bold = max(0, self.bold - 1)
            self.close_el(tag)
            return
        if tag in ITAL_TAGS:
            self.ital = max(0, self.ital - 1)
            self.close_el(tag)
            return

        self.flush()
        self.close_el(tag)

    def handle_data(self, data):
        if self.skip or self.in_icon:
            return
        if not data.strip():
            # keep a single separating space, never a hard break
            if self.runs and not self.runs[-1]["s"].endswith((" ", "\n")):
                self.runs.append({"s": " "})
            return
        run = {"s": clean_ws(data)}
        if self.bold:
            run["b"] = 1
        if self.ital:
            run["i"] = 1
        self.runs.append(run)


def norm_runs(runs):
    """Merge adjacent runs with identical styling; trim outer whitespace."""
    out = []
    for r in runs:
        if not r["s"]:
            continue
        if out and out[-1].get("b") == r.get("b") and out[-1].get("i") == r.get("i"):
            out[-1]["s"] += r["s"]
        else:
            out.append(dict(r))
    # collapse doubled spaces created by the merge, then trim the edges
    for r in out:
        r["s"] = re.sub(r" {2,}", " ", r["s"])
    while out and not out[0]["s"].strip():
        out.pop(0)
    while out and not out[-1]["s"].strip():
        out.pop()
    if out:
        out[0]["s"] = out[0]["s"].lstrip()
        out[-1]["s"] = out[-1]["s"].rstrip()
    return [r for r in out if r["s"]]


# ---- tree -> flat block list ------------------------------------------

def runs_of(node):
    """Collect all runs beneath a node into one inline sequence."""
    acc = []
    for c in node.get("children", []):
        if c["t"] in ("p", "h"):
            if acc and acc[-1]["s"].strip():
                acc.append({"s": " "})
            acc.extend(c.get("runs", []))
        elif "runs" in c:
            acc.extend(c["runs"])
        else:
            acc.extend(runs_of(c))
    return norm_runs(acc)


def plain(runs):
    return "".join(r["s"] for r in runs).strip()


def all_bold(runs):
    return bool(runs) and all(r.get("b") for r in runs if r["s"].strip())


def finalize(node):
    """Convert the parse tree into the flat, renderable block list."""
    out = []
    for c in node.get("children", []):
        t = c["t"]

        if t == "p":
            if plain(c["runs"]):
                out.append({"t": "p", "runs": c["runs"]})

        elif t == "h":
            runs = runs_of(c) or c.get("runs", [])
            if plain(runs):
                out.append({"t": "h", "level": c.get("level", 2), "runs": runs})

        elif t == "hr":
            out.append({"t": "hr"})

        elif t == "img":
            out.append(c)

        elif t == "alert":
            kids = finalize(c)
            badge = next((k for k in kids if k["t"] == "badge"), None)
            kids = [k for k in kids if k["t"] != "badge"]
            blk = {"t": "alert", "variant": c.get("variant", "info"), "blocks": kids}
            if badge:
                blk["badge"] = plain(badge["runs"])
            if kids:
                out.append(blk)

        elif t == "badge":
            out.append({"t": "badge", "runs": runs_of(c)})

        elif t == "list":
            items = [finalize(li) for li in c["children"] if li["t"] == "li"]
            items = [i for i in items if i]
            if items:
                out.append({"t": "list", "ordered": c.get("ordered", False), "items": items})

        elif t == "table":
            out.extend(finalize_table(c))

        else:
            out.extend(finalize(c))
    return out


def finalize_table(node):
    """
    Two distinct shapes hide behind <table> in this source:
      * genuine multi-column dose tables  -> {t:'table'}
      * Word-exported single-column layout tables -> flattened to blocks
    """
    trs = [r for r in node["children"] if r["t"] == "tr"]
    if not trs:
        return []

    grid = []
    for tr in trs:
        grid.append([td for td in tr["children"] if td["t"] == "td"])

    widths = {len(r) for r in grid if r}
    max_w = max(widths) if widths else 0

    # --- layout table: every row a single full-width cell -> unwrap to blocks
    if max_w <= 1:
        out = []
        for row in grid:
            for td in row:
                kids = finalize(td)
                # a lone all-bold paragraph is really a subheading
                if len(kids) == 1 and kids[0]["t"] == "p" and all_bold(kids[0]["runs"]):
                    out.append({"t": "h", "level": 3, "runs": kids[0]["runs"]})
                else:
                    out.extend(kids)
        return out

    # --- genuine table
    header = None
    body = grid
    first = grid[0]
    if len(first) == max_w and all(all_bold(runs_of(td)) for td in first if plain(runs_of(td))):
        header = [runs_of(td) for td in first]
        body = grid[1:]

    rows = []
    for row in body:
        if not row:
            continue
        # A lone cell in a wide table is a spanning group/section header.
        if len(row) == 1:
            rows.append({"section": finalize(row[0])})
            continue
        # Short rows are Word-export artefacts (the source has no colspan at
        # all). Keep every cell and let the last absorb the leftover width —
        # dropping the overflow would silently lose dose data.
        cells = [finalize(td) for td in row]
        spans = [td.get("colspan", 1) for td in row]
        deficit = max_w - sum(spans)
        if deficit > 0:
            spans[-1] += deficit
        r = {"cells": cells}
        if any(s > 1 for s in spans):
            r["spans"] = spans
        rows.append(r)

    if not rows:
        return []
    tbl = {"t": "table", "cols": max_w, "rows": rows}
    if header:
        tbl["header"] = header
    return [tbl]


# ---- duplicate heading removal ----------------------------------------
#
# The MEG export states each title twice: once as the page's structural
# heading, then again as the first thing inside the imported content — either
# as another heading or as a lone bold paragraph. e.g.
#
#   <h2>Meningitis</h2><table>…<td><h1><b>Meningitis</b></h1></td>
#   <h3>General Principles</h3><p><strong>General Principles</strong></p>
#
# The web page renders both. We keep the first (its level reflects the page's
# own outline) and drop the immediate repeat. Only an exact text match that is
# adjacent — ignoring <hr> separators — is ever removed.

def is_heading_like(b):
    if b["t"] == "h":
        return True
    if b["t"] == "p":
        runs = b.get("runs") or []
        return bool(runs) and all(r.get("b") for r in runs if r["s"].strip())
    return False


def head_key(b):
    return re.sub(r"[^a-z0-9]", "", plain(b.get("runs") or []).lower())


def dedupe_headings(blocks, dropped):
    """Drop a heading/bold-title that immediately repeats the one before it."""
    out = []
    for b in blocks:
        # recurse into every nested block list first
        if b["t"] == "alert":
            b["blocks"] = dedupe_headings(b.get("blocks") or [], dropped)
        elif b["t"] == "list":
            b["items"] = [dedupe_headings(it, dropped) for it in b.get("items") or []]
        elif b["t"] == "table":
            for row in b["rows"]:
                if "section" in row:
                    row["section"] = dedupe_headings(row["section"], dropped)
                if "cells" in row:
                    row["cells"] = [dedupe_headings(c, dropped) for c in row["cells"]]

        key = head_key(b) if is_heading_like(b) else ""
        if key:
            prev = len(out) - 1
            while prev >= 0 and out[prev]["t"] == "hr":
                prev -= 1
            if prev >= 0 and is_heading_like(out[prev]) and head_key(out[prev]) == key:
                dropped.append(plain(b.get("runs") or []))
                continue
        out.append(b)
    return out


# ---- section extraction ------------------------------------------------

def build_sections():
    """Parse the template into sections. Returns (sections, dropped_by_id)."""
    raw = SRC.read_text()

    # Strip Jinja control syntax; keep the literal text it guards.
    raw = re.sub(r"\{%.*?%\}", "", raw, flags=re.S)
    raw = re.sub(r"\{\{.*?\}\}", "", raw, flags=re.S)

    starts = [
        (m.start(), m.group(1))
        for m in re.finditer(r'<div id="section-item-(uhw-[a-z0-9\-]+)"', raw)
    ]
    if not starts:
        sys.exit("no sections found")
    bounds = [s[0] for s in starts] + [len(raw)]

    sections = []
    dropped_by_id = {}
    for i, (_, sid) in enumerate(starts):
        block = raw[bounds[i]: bounds[i + 1]]

        # title + icon live in the accordion button
        btn = re.search(
            r'<button[^>]*accordion-button.*?>(.*?)</button>', block, re.S
        )
        title, icon = sid, "circle"
        if btn:
            inner = btn.group(1)
            mi = re.search(r'class="fas fa-([a-z0-9\-]+)"', inner)
            if mi:
                icon = mi.group(1)
            title = clean_ws(unescape(re.sub(r"<[^>]+>", " ", inner))).strip()

        # body = the accordion-body div's contents
        mb = re.search(r'<div class="accordion-body[^"]*"[^>]*>(.*)', block, re.S)
        body = mb.group(1) if mb else block
        # drop the trailing wrapper divs of the accordion item
        body = re.sub(r"(?:\s*</div>){1,3}\s*(?:<!--.*?-->\s*)?$", "", body, flags=re.S)

        p = BlockParser()
        p.feed(body)
        p.flush()
        blocks = finalize(p.stack[0])

        dropped = []
        blocks = dedupe_headings(blocks, dropped)
        dropped_by_id[sid] = dropped

        sections.append({"id": sid, "title": title, "icon": icon, "blocks": blocks})

    return sections, dropped_by_id


def main():
    sections, dropped_by_id = build_sections()

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(sections, ensure_ascii=False, indent=1))

    # ---- report
    def count(bs, t):
        n = 0
        for b in bs:
            if b["t"] == t:
                n += 1
            for key in ("blocks", "items"):
                for sub in (b.get(key) or []):
                    n += count(sub if isinstance(sub, list) else [sub], t)
            if b["t"] == "table":
                for r in b["rows"]:
                    for cell in (r.get("cells") or [r.get("section") or []]):
                        n += count(cell if isinstance(cell, list) else [cell], t)
        return n

    print(f"wrote {OUT.relative_to(ROOT)}  ({OUT.stat().st_size/1024:.0f} KB)\n")
    print(f"{'section':38s} {'blk':>4} {'tbl':>4} {'lst':>4} {'img':>4} {'dup-':>5}")
    for s in sections:
        b = s["blocks"]
        print(f"{s['id']:38s} {len(b):>4} {count(b,'table'):>4} {count(b,'list'):>4} "
              f"{count(b,'img'):>4} {len(dropped_by_id[s['id']]):>5}")
    total_dropped = sum(len(v) for v in dropped_by_id.values())
    print(f"\ntotal sections: {len(sections)}")
    print(f"duplicate headings removed: {total_dropped}")


if __name__ == "__main__":
    main()
