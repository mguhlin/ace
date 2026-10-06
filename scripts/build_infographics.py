"""Generate responsive, accessible SVG diagrams for the ACE article."""
from pathlib import Path
from html import escape
import textwrap
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'assets' / 'infographics'
NAVY, BLUE, TEAL, GOLD = '#142d4e', '#215bc7', '#087f72', '#ffbe35'
COLORS = [BLUE, TEAL, '#96590b', '#6950a3', '#52647c', TEAL]
STEMS = ['In my own words, the idea is…', 'The ideas connect because…', 'If the case changes, then… The limit is…']
DIAGRAMS = {
 'intro': ('A clearer picture of learning', 'Three pauses inside an assignment you already teach.', 'ace', [('A', 'Articulate', 'Explain the idea.'), ('C', 'Connect', 'Support the relationship.'), ('E', 'Extend', 'Test a broader claim.')], 'A learning record makes thinking visible as the work develops.'),
 'explain': ('Listen for the thinking', 'Use student explanations to decide what to teach next.', 'flow', [('01', 'Explain an idea', 'Ask for an example in the student’s own words.'), ('02', 'Show a connection', 'Ask how or why two ideas work together.'), ('03', 'Test the reasoning', 'Change a condition and ask what still holds.')], 'A polished product is one piece of evidence. Add short learning checkpoints.'),
 'goal': ('Align three parts of the plan', 'Start with the understanding you want students to show.', 'flow', [('01', 'Learning goal', 'Explain how sample selection affects conclusions.'), ('02', 'Demonstration task', 'Evaluate a different survey using that relationship.'), ('03', 'Success criteria', 'Support the conclusion and explain a limit.')], 'Goal → task → success criteria: ask for the same kind of thinking.'),
 'checkpoints': ('Three checkpoints. Three thinking moves.', 'Choose the checkpoints that belong in your learning goal.', 'ace', [('A', 'Articulate', 'What does this idea mean? Give an example.'), ('C', 'Connect', 'How do these ideas relate? Support the link.'), ('E', 'Extend', 'What carries to a new case? Where does it fail?')], 'Pause for explanation, give useful feedback, and let students revise.'),
 'solo': ('Read the structure of the response', 'SOLO describes the understanding a student demonstrates.', 'solo', [('1', 'Prestructural', 'Misses the task'), ('2', 'Unistructural', 'One relevant aspect'), ('3', 'Multistructural', 'Several separate aspects'), ('4', 'Relational', 'A coherent explanation'), ('5', 'Extended abstract', 'A broader claim with limits')], 'More facts alone do not establish deeper understanding. Look at the links.'),
 'record': ('One small learning record', 'Collect a few useful responses as the assignment develops.', 'record', [('01', 'Initial explanation', 'What do I understand so far?'), ('02', 'Connection + revision', 'What changed after feedback, and why?'), ('03', 'Application + limit', 'What works in a changed case, and when?')], 'Add a tool-use note: what help did you check, change, or reject?'),
 'review': ('Review the evidence, then the rating', 'Six criteria apply at Extend; four at Articulate and five at Connect.', 'rubric', [('01', 'Goal-to-task fit', 'Does the task reveal the goal?'), ('02', 'Concept explanation', 'Can students explain the idea?'), ('03', 'Reasoned relationships', 'Do students support the links?'), ('04', 'Bounded generalization', 'Can students justify a limit?'), ('05', 'Instruction + revision', 'Can feedback change thinking?'), ('06', 'Individual check', 'What will you teach next?')], 'Read exact passages → adjust 0–3 ratings → confirm → choose an improvement.'),
 'present': ('Make the review a shared conversation', 'Show the criteria, discuss the evidence, and choose a change.', 'dashboard', [], 'Present review for the team. Save PDF for color charts and supporting passages.'),
 'time': ('Account for all 45 minutes', 'An illustrative lesson: projection + devices + offline work.', 'time', [('10', 'Projection only', '10 minutes viewing a teacher display'), ('15', 'Student devices', '15 minutes using a device'), ('20', 'Offline work', '20 minutes discussing and writing')], 'Planned screen exposure: 25 minutes. Count simultaneous device/projection use once.'),
 'skill': ('Take the review instructions with you', 'The downloadable SKILL.md carries the rubric and review procedure.', 'record', [('01', 'Bring the document', 'Use the lesson plan, syllabus, or combined scope.'), ('02', 'Ask for evidence', 'Use exact passages and explain uncertain ratings.'), ('03', 'Check the review', 'Verify the reasoning before choosing a revision.')], 'Includes rating explanations, score calculations, and screen-time review guidance.'),
 'strategies': ('Turn instructional strategies into actions', 'Give students a chance to use the support you provide.', 'flow', [('01', 'Model thinking', 'Show how you check your reasoning.'), ('02', 'Give feedback', 'Name a specific move the student can make.'), ('03', 'Let students revise', 'Ask what improved and why.'), ('04', 'Compare cases', 'Ask when a principle applies and when it fails.')], 'The opportunity to act on feedback belongs inside the assignment.'),
 'example': ('Try the routine in history', 'Use the causes of the French Revolution to make reasoning visible.', 'ace', [('A', 'Explain two causes', 'Describe economic pressure and political legitimacy.'), ('C', 'Support the interaction', 'Use course sources, then revise a weak link.'), ('E', 'Test a broader claim', 'Compare another case and explain where the claim fails.')], 'Finish with a brief individual explanation to decide what students need next.'),
}

def text(x, y, content, size=22, fill=NAVY, weight=400, width=40, line=28):
    lines = textwrap.wrap(content, width=width, break_long_words=False) or ['']
    return ''.join(f'<text x="{x}" y="{y+i*line}" font-size="{size}" fill="{fill}" font-weight="{weight}">{escape(value)}</text>' for i, value in enumerate(lines))

def rect(x, y, w, h, fill, radius=12, stroke=None):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{radius}" fill="{fill}"'+(f' stroke="{stroke}"' if stroke else '')+'/>'

def icon(x, y, kind, color, scale=1):
    shapes = {
        'speech': '<path d="M8 8 H53 Q61 8 61 17 V38 Q61 47 52 47 H29 L13 59 V47 H8 Q1 47 1 38 V17 Q1 8 8 8 Z"/><circle cx="17" cy="28" r="2"/><circle cx="31" cy="28" r="2"/><circle cx="45" cy="28" r="2"/>',
        'link': '<rect x="1" y="25" width="40" height="21" rx="10" transform="rotate(-35 21 35)"/><rect x="25" y="9" width="40" height="21" rx="10" transform="rotate(-35 45 19)"/><path d="M25 34 L43 22"/>',
        'rocket': '<path d="M20 42 Q18 15 52 2 Q63 34 35 49 Z"/><circle cx="43" cy="20" r="7"/><path d="M20 27 L7 32 L2 49 L20 42 M44 41 L45 57 L28 61 L35 49 M18 48 L8 60 M23 53 L16 65"/>',
    }
    return f'<g transform="translate({x} {y}) scale({scale})" fill="none" stroke="{color}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">'+shapes[kind]+'</g>'

def render(key, mobile=False):
    title, sub, kind, cards, note = DIAGRAMS[key]
    w = 400 if mobile else 960
    parts = []
    title_lines = textwrap.wrap(title, width=27 if mobile else 55)
    title_y = 63
    parts.append(text(24 if mobile else 32, 27, 'ACE IT / FIELD GUIDE', 12, BLUE, 700))
    parts.append(text(24 if mobile else 32, title_y, title, 26 if mobile else 32, NAVY, 750, 27 if mobile else 55, 32 if mobile else 39))
    sub_y = title_y + len(title_lines)*(32 if mobile else 39)
    parts.append(text(24 if mobile else 32, sub_y, sub, 18 if mobile else 20, '#4b6078', 400, 34 if mobile else 80, 25))
    start = sub_y + len(textwrap.wrap(sub, width=34 if mobile else 80))*25 + 18
    if kind == 'dashboard':
        chart_w = 352 if mobile else 560
        chart_h = 208
        parts.append(rect(24 if mobile else 32, start, chart_w, chart_h, '#ffffff', stroke='#cbd8e8'))
        x = 40 if mobile else 50
        parts.append(text(x, start+29, 'Illustrative rubric ratings', 18, NAVY, 700))
        for i,(name,value) in enumerate([('Goal-to-task fit',3),('Concept explanation',2),('Reasoned relationships',1)]):
            y = start+55+i*47
            parts.append(text(x, y, name, 16, NAVY))
            bar_w = 246 if mobile else 450
            parts.append(rect(x, y+8, bar_w, 12, '#e3eaf4', 6))
            parts.append(rect(x, y+8, bar_w*value/3, 12, COLORS[i], 6))
            parts.append(text(x+bar_w+10, y+19, f'{value}/3', 15))
        px,py = (108,start+230) if mobile else (664,start+12)
        parts.append(f'<circle cx="{px+84}" cy="{py+84}" r="64" fill="none" stroke="#e3eaf4" stroke-width="28"/><circle cx="{px+84}" cy="{py+84}" r="64" fill="none" stroke="{TEAL}" stroke-width="28" stroke-dasharray="201 402" transform="rotate(-90 {px+84} {py+84})"/>')
        parts.append(text(px+40,py+83,'Rubric',20,NAVY,700))
        parts.append(text(px+43,py+108,'points',20,NAVY,700))
        end = start+412 if mobile else start+chart_h+18
        parts.append(text(24 if mobile else 32,end,'Chart percentages describe documented design, not student achievement.',17,'#4b6078',400,34 if mobile else 95,24))
        end += (3 if mobile else 1)*24+12
    else:
        cols = 1 if mobile else (3 if kind=='rubric' else len(cards))
        gap = 12 if mobile else 18
        margin = 24 if mobile else 32
        cw = (w-2*margin-gap*(cols-1))/cols
        rows = (len(cards)+cols-1)//cols
        ch = (266 if mobile else 306) if kind=='ace' else 127 if mobile else 215 if kind=='solo' else 185 if kind=='rubric' else 200
        if kind == 'time':
            barw=w-2*margin
            x=margin
            for minutes,color in zip([10,15,20],COLORS):
                seg=barw*minutes/45
                parts.append(rect(x,start,seg,30,color,0))
                parts.append(text(x+8,start+21,f'{minutes} min',14,'white',700))
                x+=seg
            start+=48
        for i,(badge,name,detail) in enumerate(cards):
            col,row=i%cols,i//cols
            x,y=margin+col*(cw+gap),start+row*(ch+gap)
            if kind=='solo' and not mobile: y+= (4-i)*10
            color=([ '#52647c', BLUE, BLUE, TEAL, '#96590b'][i] if kind=='solo' else COLORS[i%len(COLORS)])
            parts.append(rect(x,y,cw,ch,'white',12,'#cbd8e8'))
            parts.append(rect(x,y,cw,5,color,2))
            if kind=='ace':
                color = GOLD if i==2 else color
                accent = '#96590b' if i==2 else color
                parts.append(rect(x,y,cw,52,color,12))
                parts.append(f'<circle cx="{x+30}" cy="{y+26}" r="19" fill="white"/>')
                parts.append(text(x+22,y+33,badge,23,accent,750))
                parts.append(text(x+60,y+33,name,20,NAVY if color==GOLD else 'white',750,23,24))
                parts.append(icon(x+cw-75,y+65,['speech','link','rocket'][i],accent,.72 if mobile else .85))
                parts.append(text(x+18,y+85,'SAY IT' if i==0 else 'LINK IT' if i==1 else 'TEST IT',13,accent,750))
                parts.append(text(x+18,y+(130 if mobile else 146),detail,18 if mobile else 20,'#4b6078',400,25 if mobile else 24,25))
                stem_y=y+ch-67
                parts.append(rect(x+12,stem_y,cw-24,55,'#edf3fc',8))
                parts.append(text(x+24,stem_y+23,STEMS[i],16,NAVY,500,33 if mobile else 27,22))
            elif mobile:
                parts.append(f'<circle cx="{x+31}" cy="{y+33}" r="18" fill="{color}"/>')
                parts.append(text(x+20,y+39,badge,17,'white',750))
                parts.append(text(x+62,y+38,name,20,NAVY,750,25,24))
                parts.append(text(x+18,y+75,detail,18,'#4b6078',400,33,24))
            else:
                parts.append(f'<circle cx="{x+34}" cy="{y+36}" r="20" fill="{color}"/>')
                parts.append(text(x+22,y+43,badge,19,'white',750))
                label_width=max(12,int((cw-30)/12))
                parts.append(text(x+16,y+83,name,22 if kind!='solo' else 19,NAVY,750,label_width,26))
                label_lines=len(textwrap.wrap(name,width=label_width))
                parts.append(text(x+16,y+88+label_lines*26,detail,19 if kind!='solo' else 17,'#4b6078',400,max(12,int((cw-30)/10)),24))
        end=start+rows*(ch+gap)+(40 if kind=='solo' and not mobile else 0)
    note_lines=textwrap.wrap(note,width=34 if mobile else 88)
    nh=28+len(note_lines)*24
    parts.append(rect(24 if mobile else 32,end,w-(48 if mobile else 64),nh,NAVY,10))
    parts.append(text(40 if mobile else 48,end+29,note,17,'white',500,34 if mobile else 88,24))
    height=end+nh+24
    desc=' '.join([sub]+[f'{name}: {detail}' for _,name,detail in cards]+[note])
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{height}" viewBox="0 0 {w} {height}" role="img" aria-labelledby="title desc"><title id="title">{escape(title)}</title><desc id="desc">{escape(desc)}</desc><rect width="{w}" height="{height}" rx="18" fill="#f4f7fb" stroke="#cbd8e8"/><g font-family="Arial, Helvetica, sans-serif">'+''.join(parts)+'</g></svg>'

if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    for key in DIAGRAMS:
        for mobile in (False,True):
            (OUT/f'{key}{"-mobile" if mobile else ""}.svg').write_text(render(key,mobile))
    print(f'Built {len(DIAGRAMS)*2} infographic SVGs.')
