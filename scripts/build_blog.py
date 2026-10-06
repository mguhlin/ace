"""Build the article page from blog.md using the small Markdown subset it needs."""
from pathlib import Path
import html, re, json
import xml.etree.ElementTree as ET
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
    image = re.fullmatch(r'!\[([^\]]+)\]\(((?:https://mguhlin\.github\.io/ace/)?assets/infographics/[a-z-]+\.(?:svg|webp))\)', line)
    if image:
        alt, src = image.groups()
        src = src.removeprefix('https://mguhlin.github.io/ace/')
        if src.endswith('.webp'):
            manifest = json.loads((root/'assets/infographics/illustrations.json').read_text())
            asset = manifest[Path(src).name]
            if not (root/src).is_file():
                raise FileNotFoundError(f'Missing illustration: {src}')
            title = html.escape(asset["title"], quote=True)
            iw, ih = asset["width"], asset["height"]
            parts.append(f'<figure class="section-banner illustrated-banner"><a href="{src}" target="_blank" rel="noopener" aria-label="Open full-size infographic: {title} (new tab)"><img src="{src}" width="{iw}" height="{ih}" alt="{html.escape(alt, quote=True)}" decoding="async"></a><figcaption>Select the banner to open it full size.'+ (' Visual inspiration: <a href="https://mguhlin.org/resources/infographics/#ace">Miguel’s ACE infographic collection</a>.' if src.endswith('/checkpoints-illustrated.webp') else '') + '</figcaption></figure>')
        else:
            mobile = src.removesuffix('.svg') + '-mobile.svg'
            if not (root/src).is_file() or not (root/mobile).is_file():
                raise FileNotFoundError(f'Missing infographic: {src} or {mobile}')
            desktop_size = ET.parse(root/src).getroot().attrib
            mobile_size = ET.parse(root/mobile).getroot().attrib
            dw, dh = desktop_size['width'], desktop_size['height']
            mw, mh = mobile_size['width'], mobile_size['height']
            parts.append(f'<figure class="section-banner"><picture><source media="(max-width: 600px)" srcset="{mobile}" width="{mw}" height="{mh}"><img src="{src}" width="{dw}" height="{dh}" alt="{html.escape(alt, quote=True)}" decoding="async"></picture></figure>')
        i += 1
    elif line.startswith('#'):
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
header='''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>ACE It: Three Checkpoints for Better Assignments | Miguel Guhlin</title><meta name="description" content="Design and review assignments with ACE and SOLO, lesson-plan scoring, presentation charts, color PDF reports, and screen-time planning."><link rel="canonical" href="https://mguhlin.github.io/ace/blog.html"><link rel="icon" type="image/svg+xml" href="favicon.svg"><link rel="stylesheet" href="style.css"><link rel="stylesheet" href="blog.css"></head><body><a class="skip" href="#article">Skip to article</a><header class="top"><a class="brand" href="./">ACE<span>It</span><span class="brand-dot">.</span></a><nav aria-label="Main"><a href="./">Assignment builder</a><a href="score.html">Score a plan</a><a href="blog.md" download>Download article</a></nav></header><main class="article" id="article"><p class="eyebrow">MIGUEL GUHLIN · TEACHING WITH GEN AI</p>'''
footer='''<div class="article-actions"><a href="./">Try the ACE It builder</a><a href="blog.md" download>Download Markdown</a></div></main><footer><span>ACE It · Miguel Guhlin</span><a href="https://mguhlin.github.io/">More creations</a></footer></body></html>'''
(root/'blog.html').write_text(header+'\n'.join(parts)+footer)
