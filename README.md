# ACE It

A browser-only assignment builder and blog entry by Miguel Guhlin. Published at
https://mguhlin.github.io/ace/ using GitHub Pages from `main` at the repository root.

Use Articulate, Connect, Extend to design learning checkpoints aligned with SOLO.
The builder uses deterministic templates, not a Gen AI API. It does not score
assignments or establish misconduct. User inputs remain in memory, are never sent
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
