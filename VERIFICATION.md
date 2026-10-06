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
