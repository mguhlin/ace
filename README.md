# ACE It

A browser-only assignment builder, lesson-plan and syllabus scoring tool, and blog entry by Miguel Guhlin. Published at
https://mguhlin.github.io/ace/ using GitHub Pages from `main` at the repository root.

Use Articulate, Connect, Extend to design learning checkpoints aligned with SOLO.
The assignment builder uses deterministic templates, not a Gen AI API.
ACE Check (`score.html`) uses criterion-specific local rules to collect evidence
across sections, suggests zero-to-three ratings, and requires user confirmation
with exact document passages. It does not
establish misconduct. Scores assess documented design, not teaching performance. User inputs remain in memory, are never sent
to a service, and clear on reload. Copy, download, and print include edited prompts.

## Edit and preview

- Edit `blog.md`, then run `python3 scripts/build_blog.py` to regenerate `blog.html`.
- Edit `index.html`, `style.css`, and `app.js` for the builder.
- Run `python3 -m http.server 4188 --bind 127.0.0.1` from this directory.
- Run `node --check app.js` for a JavaScript syntax check.

No build dependencies, externally hosted scripts, analytics, or runtime service.
PDF.js and Mammoth are vendored locally and loaded only for PDF or DOCX imports.
GitHub Pages provides hosting. External source links navigate to other sites.

## Research scope

ACE It is a proposed synthesis of ACE, SOLO, feedback, metacognitive instruction,
and transfer strategies. Effect sizes in the article describe research averages
for the component practices, not results measured for this tool. Review templates
for subject accuracy, student needs, and institutional policy before use.

## Scoring and bonus skill

- `rubric.js` owns version 1.0 of the six-criterion rubric and rating anchors.
- `assessment.js` owns automatic engine 2.0: cross-section evidence, rationales, and integrated-anchor rules.
- `score.js` adjusts the denominator to Articulate, Connect, or Extend.
- Positive reviewed ratings require exact supporting passages in the source.
- Separate multiple excerpts with a blank line, `---`, and another blank line.
- Combined scope reviews course procedures and lesson examples together, with their limits disclosed.
- Score bands are planning labels, not validated grade cutoffs.
- PDF, DOCX, text, and Markdown files load locally into the editable source field.
- PDF and DOCX limits: 10 MB; PDF page limit: 200; extracted text limit: 100,000 characters.
- Text/Markdown limit: 500 KB. Image-only PDFs need OCR; older DOC files must be saved as DOCX.
- `skills/ace-review/SKILL.md` is the standalone downloadable assistant skill.
- Run `node scripts/build_skill.cjs` after changing the rubric to synchronize it.
- Validate syntax with `node --check score.js` and `node --check rubric.js`.

Browser regression checks are in `tests/review.cjs`. With Playwright installed,
run `node tests/review.cjs` against the local server. Set `ACE_BASE_URL` to test a
deployment, `ACE_PLAYWRIGHT_MODULE` to use an existing Playwright installation,
and `ACE_BROWSER_PATH` to use a system Chromium executable.

## Document import checks

`tests/documents.cjs` covers multi-page PDF extraction, scanned and locked PDFs,
corrupt files, DOCX table text, switching files, preservation of existing text,
local-only network requests, and mobile layout. Run it with the same Playwright
environment variables as `tests/review.cjs`. Synthetic fixtures in `tests/fixtures`
contain no personal data. The locked PDF's test password is `test-password`.

`vendor/pdfjs` includes PDF.js 6.4.299 and its worker, character maps, font data,
and licenses. `vendor/mammoth` includes Mammoth 1.13.0 and its license. DOCX raw-text
extraction runs in `docx-worker.js`; no converted document HTML is rendered.

## Automatic scoring engine

Run `node tests/assessment.cjs` for criterion-level checks. The engine can suggest
three points when integrated evidence is present. Required relationship revision
is distinct from encouragement to revise; an actual teaching response is distinct
from a reflective question. Optional extension alone cannot earn three points for
bounded generalization. The underlying rubric remains version 1.0.

Set `ACE_REVIEW_DOCUMENT` to a local combined document when running the engine or
browser tests to verify the documented 78 Extend / 80 Connect regression case.
Its text is read locally and is not checked into the repository or published.
Suggestions are still heuristics, not a semantic Gen AI review. Naming a framework
or padding a document with keywords does not establish integrated learning design.

Rating explanations and SOLO depth help are stored alongside the rubric in
`rubric.js`. Selected ratings display this guidance, and the same wording is
included in review exports and the generated bonus skill. These explanations
do not change the rating anchors or scoring rules.

## Presentation, color reports, and screen-time planning

`report-view.js` renders accessible local SVG bar/pie charts, a keyboard-controlled
presentation dialog (arrow keys, Home/End, Escape), and a formatted print report.
`pdf-export.js` creates a selectable-text color PDF with shaded headings and page
numbers. It loads local PDF-lib 1.17.1, @pdf-lib/fontkit 1.1.1, and DejaVu Sans fonts
only when exporting. Licenses/provenance are included in the vendor directories.
No URL or date is appended to reports; direct PDF generation disables automatic
creation/modification timestamps. Browser printing requires turning off Headers
and footers and enabling Background graphics in the user's print dialog.

Screen-time planning uses a manually entered sequential activity ledger. It
separates student-device use, projection-only viewing, offline time, and unclassified
time, checks the total against lesson duration, and estimates logged exposure.
The four self-rated planning criteria assess documented timing, learning purpose,
offline opportunities, and access/alternatives. Their score is separate from ACE.
Missing timing means exposure is not determined. This estimates planned activity,
not observed usage or medically recommended limits. Parallel activities need a
separate ledger per learner path; simultaneous device/projection exposure is counted once.

Run `node tests/presentation.cjs` with the Playwright environment variables above
for chart, projection, timing arithmetic, PDF download, and print regressions.

## Article infographic banners

The article has a responsive SVG infographic immediately above its title and
every major section heading. Each of the 12 diagrams has a desktop and mobile
layout, descriptive alternative text, and printable vector graphics.

Run `python3 scripts/build_infographics.py`, then `python3 scripts/build_blog.py`
after editing diagram content or layout. The Markdown article links to hosted
SVGs so its downloaded copy can display the banners. The HTML uses local
responsive assets and links the checkpoint banner to Miguel's ACE collection.

The ACE panels draw visual inspiration from the local copy of
https://mguhlin.org/resources/infographics/#ace: blue/teal/gold panels,
speech/link/rocket symbols, sentence stems, and a short takeaway strip.
New chart and screen-time examples are labeled illustrative and do not show
student results or imply a measured health threshold.
