"""Build the article page from blog.md using the small Markdown subset it needs."""
from pathlib import Path
import html, re
root=Path(__file__).resolve().parent.parent

def inline(s):
    s=html.escape(s)
    s=re.sub(r'\[([^\]]+)\]\((https://[^\s)]+)\)',r'<a href="\2">\1</a>',s)
    s=re.sub(r'\*\*(.+?)\*\*',r'<strong>\1</strong>',s)
    s=re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)',r'<em>\1</em>',s)
    return s
lines=(root/'blog.md').read_text().splitlines(); parts=[]; i=0
while i<len(lines):
    line=lines[i]
    if not line.strip(): i+=1; continue
    if line.startswith('#'):
        level=len(line)-len(line.lstrip('#')); text=line[level:].strip(); slug=re.sub(r'[^a-z0-9]+','-',text.lower()).strip('-')
        parts.append(f'<h{level} id="{slug}">{inline(text)}</h{level}>'); i+=1
    elif line.startswith('|'):
        rows=[]
        while i<len(lines) and lines[i].startswith('|'): rows.append(lines[i]); i+=1
        cells=lambda row: [inline(c.strip()) for c in row.strip('|').split('|')]
        parts.append('<div class="table-wrap"><table><thead><tr>'+''.join('<th scope="col">'+c+'</th>' for c in cells(rows[0]))+'</tr></thead><tbody>')
        for row in rows[2:]: parts.append('<tr>'+''.join('<td>'+c+'</td>' for c in cells(row))+'</tr>')
        parts.append('</tbody></table></div>')
    elif line.startswith('> '): parts.append('<blockquote><p>'+inline(line[2:])+'</p></blockquote>'); i+=1
    else:
        block=[]
        while i<len(lines) and lines[i].strip(): block.append(lines[i]); i+=1
        parts.append('<p>'+inline(' '.join(block))+'</p>')
header='''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>ACE It: Three Checkpoints for Better Assignments | Miguel Guhlin</title><meta name="description" content="A practical guide to assignment design with ACE, SOLO Taxonomy, feedback, metacognition, and transfer."><link rel="canonical" href="https://mguhlin.github.io/ace/blog.html"><link rel="icon" type="image/svg+xml" href="favicon.svg"><link rel="stylesheet" href="style.css"></head><body><a class="skip" href="#article">Skip to article</a><header class="top"><a class="brand" href="./">ACE<span>It</span><span class="brand-dot">.</span></a><nav aria-label="Main"><a href="./">Assignment builder</a><a href="score.html">Score a plan</a><a href="blog.md" download>Download article</a></nav></header><main class="article" id="article"><p class="eyebrow">MIGUEL GUHLIN · TEACHING WITH GEN AI</p>'''
footer='''<div class="article-actions"><a href="./">Try the ACE It builder</a><a href="blog.md" download>Download Markdown</a></div></main><footer><span>ACE It · Miguel Guhlin</span><a href="https://mguhlin.github.io/">More creations</a></footer></body></html>'''
(root/'blog.html').write_text(header+'\n'.join(parts)+footer)
