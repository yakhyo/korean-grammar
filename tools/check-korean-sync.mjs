#!/usr/bin/env node
/* Korean sync checker for the multilingual KIIP level pages.
 *
 * Each level exists four times — EN (level-N/index.html), UZ (uz/level-N/…),
 * RU (ru/level-N/…) and ID (id/level-N/…). The *Korean* in those files must be identical:
 * the example sentences (with their <span class="hl"> highlight markup), the
 * vocabulary head-words, the unit topic titles and the grammar-pattern forms
 * are the same Korean in every language — only the surrounding translation
 * differs. When the Korean drifts between copies (a highlight span moved, a
 * word edited in one file but not the others) the pages silently disagree.
 *
 * This script extracts those Korean-only fields from all four copies of every
 * level and reports any place they no longer match. It is READ-ONLY — it never
 * touches the site files. Exit code 0 = in sync, 1 = drift found, so it can run
 * in CI or a pre-commit hook.
 *
 *   node tools/check-korean-sync.mjs            # check all levels
 *   node tools/check-korean-sync.mjs 1 3        # check only levels 1 and 3
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'docs');
const LEVELS = [1, 2, 3, 4, 5];
const LANGS = [
  { key: 'EN', file: (n) => `en/level-${n}/index.html` },
  { key: 'UZ', file: (n) => `uz/level-${n}/index.html` },
  { key: 'RU', file: (n) => `ru/level-${n}/index.html` },
  { key: 'ID', file: (n) => `id/level-${n}/index.html` },
];

// Each "field" is a Korean-only fragment that must match across languages.
// Patterns run over the whole file (the `s` flag lets a tag wrap across lines —
// a topic title or grammar form often does, and the wrap point differs by
// language). The first capture group is the Korean payload that is compared.
const FIELDS = [
  { name: 'example', re: /<p class="k">(.*?)<\/p>/gs },
  { name: 'vocab', re: /<td class="w">(.*?)<\/td>/gs },
  { name: 'topic', re: /<span class="topic-kr">(.*?)<\/span>/gs },
  // grammar pattern form — the Korean before the translated <span class="gloss">
  { name: 'gram-form', re: /<h3 class="gram-form">(.*?)(?:<span class="gloss">|<\/h3>)/gs },
];

// Offsets of every unit boundary, so each match can be attributed to its unit.
function sectionIndex(text) {
  const marks = [];
  const re = /<section class="lesson" id="([^"]+)"/g;
  let m;
  while ((m = re.exec(text))) marks.push({ offset: m.index, id: m[1] });
  return marks;
}
const lineAt = (text, offset) => (text.slice(0, offset).match(/\n/g) || []).length + 1;
const unitAt = (marks, offset) => {
  let id = '—';
  for (const mk of marks) {
    if (mk.offset <= offset) id = mk.id;
    else break;
  }
  return id;
};
// Collapse runs of whitespace (incl. the line breaks from wrapped tags) to a
// single space so two copies that wrap differently still compare equal.
const norm = (s) => s.replace(/\s+/g, ' ').trim();

/** Pull the ordered list of {unit, line, value} for one field out of a file. */
function extract(text, field) {
  const out = [];
  const marks = sectionIndex(text);
  const re = new RegExp(field.re.source, field.re.flags);
  let m;
  while ((m = re.exec(text))) {
    out.push({ unit: unitAt(marks, m.index), line: lineAt(text, m.index), value: norm(m[1]) });
  }
  return out;
}

const GREEN = (s) => `\x1b[32m${s}\x1b[0m`;
const RED = (s) => `\x1b[31m${s}\x1b[0m`;
const DIM = (s) => `\x1b[2m${s}\x1b[0m`;
const BOLD = (s) => `\x1b[1m${s}\x1b[0m`;

const want = process.argv.slice(2).map(Number).filter((n) => LEVELS.includes(n));
const levels = want.length ? want : LEVELS;

let problems = 0;
let checkedFields = 0;

for (const n of levels) {
  // Load every language copy that exists for this level.
  const copies = LANGS.map((l) => {
    const rel = l.file(n);
    const abs = resolve(ROOT, rel);
    return { ...l, rel, text: existsSync(abs) ? readFileSync(abs, 'utf8') : null };
  });
  const present = copies.filter((c) => c.text !== null);
  if (present.length < 2) {
    console.log(DIM(`Level ${n}: fewer than two language copies found — skipped`));
    continue;
  }

  const base = present[0]; // EN is the reference when present
  let levelProblems = 0;

  for (const field of FIELDS) {
    const series = present.map((c) => ({ key: c.key, rel: c.rel, items: extract(c.text, field) }));
    const baseSeries = series[0];
    if (baseSeries.items.length === 0) continue; // field absent in this level (e.g. no gram-form in L5)
    checkedFields++;

    for (const other of series.slice(1)) {
      // 1) count mismatch — different number of Korean items, structures diverged
      if (other.items.length !== baseSeries.items.length) {
        levelProblems++;
        problems++;
        console.log(
          RED(`✗ Level ${n} · ${field.name}: count differs`) +
            ` — ${base.key}=${baseSeries.items.length}, ${other.key}=${other.items.length}`
        );
        continue; // index-by-index compare is meaningless once counts differ
      }
      // 2) content mismatch at the same position — Korean drifted
      for (let i = 0; i < baseSeries.items.length; i++) {
        const a = baseSeries.items[i];
        const b = other.items[i];
        if (a.value !== b.value) {
          levelProblems++;
          problems++;
          console.log(RED(`✗ Level ${n} · unit ${a.unit} · ${field.name} #${i + 1}: Korean differs`));
          console.log(`    ${base.key} ${DIM(`(${base.rel}:${a.line})`)}  ${a.value}`);
          console.log(`    ${other.key} ${DIM(`(${other.rel}:${b.line})`)}  ${b.value}`);
        }
      }
    }
  }

  if (levelProblems === 0) {
    const counts = FIELDS.map((f) => {
      const c = extract(base.text, f).length;
      return c ? `${c} ${f.name}` : null;
    }).filter(Boolean).join(', ');
    console.log(GREEN(`✓ Level ${n}: Korean in sync across ${present.map((c) => c.key).join('/')}`) + DIM(`  (${counts})`));
  }
}

console.log('');
if (problems === 0) {
  console.log(BOLD(GREEN(`All Korean in sync — ${checkedFields} field-series checked, no drift.`)));
  process.exit(0);
} else {
  console.log(BOLD(RED(`${problems} drift${problems === 1 ? '' : 's'} found.`)) + ' Fix the Korean so all language copies match.');
  process.exit(1);
}
