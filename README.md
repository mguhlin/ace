# ACE It

A browser-only assignment builder, lesson-plan and syllabus scoring tool, and blog entry by Miguel Guhlin. Published at
https://mguhlin.github.io/ace/ using GitHub Pages from `main` at the repository root.

Use Articulate, Connect, Extend to design learning checkpoints aligned with SOLO.
The assignment builder uses deterministic templates, not a Gen AI API.
ACE Check (`score.html`) suggests preliminary rubric ratings using transparent phrase
matching, then requires user confirmation with exact document evidence. It does not
establish misconduct. Scores assess documented design, not teaching performance. User inputs remain in memory, are never sent
to a service, and clear on reload. Copy, download, and print include edited prompts.

## Edit and preview

- Edit `blog.md`, then run `python3 scripts/build_blog.py` to regenerate `blog.html`.
- Edit `index.html`, `style.css`, and `app.js` for the builder.
- Run `python3 -m http.server 4188 --bind 127.0.0.1` from this directory.
- Run `node --check app.js` for a JavaScript syntax check.

No build dependencies, third-party scripts, analytics, fonts, or runtime service.
GitHub Pages provides hosting. External source links navigate to other sites.

## Research scope

ACE It is a proposed synthesis of ACE, SOLO, feedback, metacognitive instruction,
and transfer strategies. Effect sizes in the article describe research averages
for the component practices, not results measured for this tool. Review templates
for subject accuracy, student needs, and institutional policy before use.

## Scoring and bonus skill

- `rubric.js` owns version 1.0 of the six-criterion rubric and rating anchors.
- `score.js` adjusts the denominator to Articulate, Connect, or Extend.
- Positive reviewed ratings require an exact supporting passage in the source.
- Score bands are planning labels, not validated grade cutoffs.
- Text and Markdown files load locally; PDF and Word content can be pasted.
- `skills/ace-review/SKILL.md` is the standalone downloadable assistant skill.
- Run `node scripts/build_skill.cjs` after changing the rubric to synchronize it.
- Validate syntax with `node --check score.js` and `node --check rubric.js`.

Browser regression checks are in `tests/review.cjs`. With Playwright installed,
run `node tests/review.cjs` against the local server. Set `ACE_BASE_URL` to test a
deployment, `ACE_PLAYWRIGHT_MODULE` to use an existing Playwright installation,
and `ACE_BROWSER_PATH` to use a system Chromium executable.
