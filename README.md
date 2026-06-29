# KIIP Grammar &amp; Vocabulary

**English** · [Oʻzbekcha](README.uz.md) · [Русский](README.ru.md) · [Bahasa Indonesia](README.id.md)

A self-study reference set for the **Korea Immigration &amp; Integration Program (KIIP / 사회통합프로그램)** Korean curriculum.

🔗 **Live site:** https://yakhyo.github.io/korean-grammar/

## Contents

| Level | Book | Focus |
|-------|------|-------|
| Level 1 | 한국어와 한국문화 초급 1 | Beginner — Hangul, core particles, basic verb endings |
| Level 2 | 한국어와 한국문화 초급 2 | High Beginner — connectors, conditions, relative clauses |
| Level 3 | 한국어와 한국문화 중급 1 | Intermediate — reported speech, supposition, conjugation appendix |
| Level 4 | 한국어와 한국문화 중급 2 | Upper Intermediate — society topics, abstract grammar |
| Level 5 | 한국사회 이해 (기본·심화) | Understanding Korean Society — civics study guide |

## Features

- 🌐 **Language switcher** — a dropdown on every page to switch between English, Uzbek, Russian, and Indonesian; the Korean stays, only the explanations and translations change.
- 🧭 **Level switcher** — a dropdown menu on every page to jump straight to any level (or home) without going back.
- 🌗 **Dark / light mode** — a toggle on every page, remembered across visits and following your system preference by default.
- ⭐ **Star button** — quick link to star the project on GitHub.
- 🖨️ **Print-ready** — printing (or saving to PDF) always uses the light theme for clean output, even in dark mode.
- 📦 **No build, no dependencies** — plain HTML + one shared CSS file, works offline.

## About

- Styling lives in two shared stylesheets (`assets/home.css` for the landing pages, `assets/levels.css` for every level page); each level page picks its accent colour via an `html.lv1…lv5` class. Pages still work offline and print cleanly to PDF (`Ctrl`/`Cmd` + `P`).
- Levels 1–4 follow the current KIIP textbook editions; vocabulary lists are expanded thematic references rather than verbatim lesson word lists.
- Each grammar point carries **four worked example sentences** to show the pattern across different contexts.
- Level 5 covers the *Understanding Korean Society* course.
- The Uzbek, Russian, and Indonesian editions are full translations of the explanations, examples, and vocabulary; the Korean text itself is identical across all four languages.

## Project structure

```
.
├── index.html         # Landing page (English — default)
├── index-uz.html      # Landing page (Uzbek)
├── index-ru.html      # Landing page (Russian)
├── index-id.html      # Landing page (Indonesian)
├── levels/            # One page per level, per language
│   ├── level-1.html … level-5.html      # English (default)
│   ├── uz/level-1.html … level-5.html   # Uzbek
│   ├── ru/level-1.html … level-5.html   # Russian
│   └── id/level-1.html … level-5.html   # Indonesian
├── assets/            # Shared stylesheets + social preview images
│   ├── home.css       # Landing pages
│   ├── levels.css     # Level pages (accent via html.lvN class)
│   └── og-image*.png  # Per-language social preview images
├── tools/             # Maintenance scripts (no dependencies)
│   └── check-korean-sync.mjs   # Verify Korean matches across EN/UZ/RU/ID
└── .nojekyll          # Serve files as-is on GitHub Pages
```

## Run locally

No build step — just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Keeping the translations in sync

The Korean must be byte-identical across the English, Uzbek, Russian, and Indonesian copy of
every level — same example sentences (including the `<span class="hl">` highlight
markup), same vocabulary head-words, same unit topics. After editing any level,
check that the four copies still agree:

```bash
node tools/check-korean-sync.mjs        # all levels
node tools/check-korean-sync.mjs 1 3    # only levels 1 and 3
```

It is read-only and lists every place the Korean has drifted, with the file and
line in each language. The same check runs in CI before a deploy, so a mismatch
can't reach the live site. (It only compares the *Korean* between languages — it
does not judge whether a highlight marks the right morpheme within a single copy.)

## License

For learners of the Social Integration Program. Free to use for personal study.
