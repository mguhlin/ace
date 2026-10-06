# Verification

Validated on October 6, 2026 with Playwright and system Chromium:

- Three checkpoints generated from the history example.
- Concept, relationship, and generalization targets produce one, two, and three checkpoints.
- Edited student prompts appear in clipboard and downloaded plans.
- HTML entered as assignment text stays text, without execution.
- Builder and article have no horizontal overflow at 375px.
- Desktop layout visually reviewed at 1440px.
- Article has one main heading, two instructional tables, and a working research-section anchor.
- No browser JavaScript errors in the tested flows.
- `node --check app.js` passes.

The site requires no build step. Regenerate the article with
`python3 scripts/build_blog.py` after editing `blog.md`.

## ACE Check additions

- Four, five, and six criteria produce the correct scope-adjusted denominator.
- Engine 2.0 sample draft scores 94/100; full reviewed ratings score 100/100.
- Missing documented practices score zero without inventing evidence.
- Positive ratings with fabricated evidence cannot become reviewed ratings.
- Rating/evidence edits clear confirmation; document/scope edits clear the review.
- Syllabus mode, local text-file loading, clipboard, download, and print pass.
- User document markup remains text without script execution.
- Scorer has no mobile horizontal overflow; desktop layout visually reviewed.
- Home page links reach the scorer and downloadable bonus skill.
- Existing assignment builder still generates all three checkpoints.
- Skill frontmatter and structure pass the skill-creator validator.
- Rubric anchors in the skill are generated from the same data as the browser tool.

## PDF and DOCX imports

- Multi-page PDF text loads into the editable source and can be scored.
- Scanned, password-protected, and invalid PDFs show specific recovery guidance.
- DOCX paragraphs and table-cell text are preserved; document markup stays text.
- Invalid DOCX and unsupported DOC formats preserve the existing source text.
- Rapid PDF-to-DOCX switching uses the latest selection and restores form controls.
- Import requests stay on the site's origin; document data is not uploaded.
- File controls have no horizontal overflow at 375px.
- Existing scoring regression suite passes after document-import changes.

## Automatic scoring engine 2.0

- Supplied combined syllabus/lesson document produces 3, 2, 2, 2, 3, 2 ratings.
- Same scope scores 78/100 at Extend and 80/100 at Connect, matching the contextual review.
- Supplied document content remains outside the repository and published assets.
- Synthetic integrated design reaches the full zero-to-three range, including 100/100.
- Removing non-examples, required revision, or a conditional teaching response reduces the corresponding rating.
- Optional extension, negative statements, and framework headings do not establish integrated practices.
- Exact evidence from multiple sections validates; adding an invented excerpt fails confirmation.
- Browser results display rationales and section locations; exports include engine version and rationale.
- Bonus skill preserves rubric anchors and includes matching cross-section and three-point guidance.

## Rating explanations

- All six criteria display a plain-language purpose and selected-rating explanation.
- Changing a rating updates its explanation and keeps it linked with aria-describedby.
- Expandable rating lists include explanations for all four ratings.
- SOLO depth help changes with Articulate, Connect, and Extend.
- Downloaded reviews include the depth definition and selected-rating meanings.
- Bonus skill is generated with the same explanations as the browser UI.
- The supplied combined document still scores 78 Extend and 80 Connect.
