# KIIP Grammar &amp; Vocabulary

A self-study reference set for the **Korea Immigration &amp; Integration Program (KIIP / 사회통합프로그램)** Korean curriculum.

🔗 **Live site:** https://yakhyo.github.io/korean-grammar/

## Contents

| Level | Book | Focus |
|-------|------|-------|
| [Level 1](levels/level-1.html) | 한국어와 한국문화 초급 1 | Beginner — Hangul, core particles, basic verb endings |
| [Level 2](levels/level-2.html) | 한국어와 한국문화 초급 2 | High Beginner — connectors, conditions, relative clauses |
| [Level 3](levels/level-3.html) | 한국어와 한국문화 중급 1 | Intermediate — reported speech, supposition, conjugation appendix |
| [Level 4](levels/level-4.html) | 한국어와 한국문화 중급 2 | Upper Intermediate — society topics, abstract grammar |
| [Level 5](levels/level-5.html) | 한국사회 이해 (기본·심화) | Understanding Korean Society — civics study guide |

## Features

- 🧭 **Level switcher** — a dropdown menu on every page to jump straight to any level (or home) without going back.
- 🌗 **Dark / light mode** — a toggle on every page, remembered across visits and following your system preference by default.
- ⭐ **Star button** — quick link to star the project on GitHub.
- 🖨️ **Print-ready** — printing (or saving to PDF) always uses the light theme for clean output, even in dark mode.
- 📦 **No build, no dependencies** — plain HTML/CSS, works offline.

## About

- Each page is **fully self-contained** — fonts and styles are inline, so they work offline and print cleanly to PDF (`Ctrl`/`Cmd` + `P`).
- Levels 1–4 follow the current KIIP textbook editions; vocabulary lists are expanded thematic references rather than verbatim lesson word lists.
- Level 5 covers the *Understanding Korean Society* course.

## Project structure

```
.
├── index.html        # Landing page linking to each level
├── levels/           # One self-contained page per level
│   ├── level-1.html
│   ├── level-2.html
│   ├── level-3.html
│   ├── level-4.html
│   └── level-5.html
└── .nojekyll         # Serve files as-is on GitHub Pages
```

## Run locally

No build step — just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## License

For learners of the Social Integration Program. Free to use for personal study.
