'use strict';
const $ = id => document.getElementById(id);
const policyText = {
 feedback: 'Gen AI may be used for practice questions and draft feedback. Students must check suggestions against course materials. Gen AI may not compose checkpoint responses. Complete the individual follow-up without Gen AI, using permitted course resources.',
 open: 'Gen AI may assist with this assignment. Students must verify claims and explain which suggestions they checked, changed, or rejected. Complete the individual follow-up without Gen AI, using permitted course resources.',
 none: 'Do not use Gen AI for this assignment. Course resources, approved assistive technology, and other support follow the instructor’s directions. Complete the individual follow-up using permitted course resources.'
};
function element(tag, text, className) { const node = document.createElement(tag); if(text !== undefined) node.textContent = text; if(className) node.className = className; return node; }
function paragraph(parent, label, text) { const p = element('p'); p.append(element('strong', label + ' '), document.createTextNode(text)); parent.append(p); }
function editable(parent, label, text) { const p = element('p', text); p.contentEditable = 'true'; p.setAttribute('role','textbox'); p.setAttribute('aria-label',label); p.setAttribute('aria-multiline','true'); parent.append(p); }
function checkpoint(letter, name, prompt, teaching, look, solo) {
 const section = element('section',undefined,'checkpoint');
 const h = element('h3'); h.append(element('span',letter,'step-letter'),document.createTextNode(name)); section.append(h);
 section.append(element('strong','Student prompt (click to edit)')); editable(section,name+' student prompt',prompt);
 paragraph(section,'Teaching move:',teaching); paragraph(section,'Look for:',look); section.append(element('p',solo,'solo')); return section;
}
function generate(event) {
 if(event) event.preventDefault();
 const assignment = $('assignment').value.trim(), goal = $('goal').value.trim();
 if(!assignment || !goal) { $('status').textContent='Enter an assignment and a learning goal.'; (!assignment ? $('assignment') : $('goal')).focus(); return; }
 const depth = $('depth').value, level = $('level').value, change = $('change').value.trim();
 const changed = change || 'a second case, assumption, or constraint selected by your instructor';
 const elementary = level === 'Elementary';
 const output = $('output'); output.replaceChildren();
 const summary = element('div',undefined,'plan-summary'); paragraph(summary,'Assignment:',assignment); paragraph(summary,'Learning goal:',goal); paragraph(summary,'Learners:',level); paragraph(summary,'Target:',$('depth').selectedOptions[0].textContent); output.append(summary);
 output.append(checkpoint('A','Articulate',`Learning goal: ${goal}\nExplain the central idea accurately. Give ${elementary ? 'one example and use a sentence starter if needed' : 'an example and distinguish it from a non-example'}. Point to the course material that supports your explanation.`, `Model a short example, then collect a brief individual explanation. ${elementary ? 'Offer a diagram, spoken explanation, or sentence starter.' : 'Offer accessible response modes when the mode is not the assessed skill.'} Reteach a missing concept before moving on.`, 'Relevant concepts explained accurately. Several separate facts can show useful knowledge without yet explaining their relationship.', 'SOLO: unistructural to multistructural. A response that misses the task calls for clarification and support.'));
 if(depth !== 'a') output.append(checkpoint('C','Connect',`Return to the learning goal: ${goal}\nChoose two or more relevant ideas. Explain how they interact and why the relationship matters for your assignment. Support your explanation with course evidence.`, 'Compare a list of facts with a connected explanation. Give one specific suggestion about the weakest relationship. Provide time to revise, then ask students how the revision improved their reasoning.', 'A coherent explanation that links the ideas, supported by appropriate evidence or reasoning.', 'SOLO: relational. Naming multiple ideas alone does not establish this level.'));
 if(depth === 'e') output.append(checkpoint('E','Extend',`Changed situation: ${changed}.\nUse the learning goal (${goal}) to propose a principle or prediction. Apply it to the changed situation. Explain what carries over, what changes, and a condition under which your claim would fail.`, 'Compare the original and changed situations. Model how to test the boundaries of a claim. Finish with a brief individual follow-up using permitted course resources and an accessible response mode.', 'A justified principle, prediction, or generalization beyond the original case, plus a defensible limit.', 'SOLO: extended abstract when the student justifies a broader generalization. Applying a method to a similar example alone does not establish this level.'));
 const policy = element('section',undefined,'checkpoint'); policy.append(element('h3','Gen AI permissions')); editable(policy,'Gen AI permissions',policyText[$('policy').value]); output.append(policy);
 const record = element('section',undefined,'record'); record.append(element('h3','Student learning record')); record.append(element('p','Copy these prompts into one shared document or staged submissions in your learning management system.'));
 const list = element('ul');
 const prompts = [`Articulate: ${goal}. Explain the key idea and give an example.`];
 if(depth !== 'a') prompts.push('Connect: Explain how relevant ideas work together. Support the relationship.');
 prompts.push('Feedback and revision: What did you change, and how did that improve your reasoning?');
 if(depth === 'e') prompts.push(`Extend: Test a principle using ${changed}. Explain its limits.`);
 prompts.push('Tool use: What help did you use? Which suggestion did you check, change, or reject, and why?'); prompts.forEach(p=>list.append(element('li',p))); record.append(list); output.append(record);
 const assess = element('section',undefined,'checkpoint'); assess.append(element('h3','Assess and follow up'));
 paragraph(assess,'Questions:', depth === 'a' ? 'Is the explanation accurate? Does the example show understanding?' : depth === 'c' ? 'Is the explanation accurate? Is the relationship defensible?' : 'Is the explanation accurate? Is the relationship defensible? Is the generalization justified?');
 paragraph(assess,'Individual follow-up:', depth === 'a' ? 'Ask for a new example and an explanation of why it fits the concept.' : depth === 'c' ? 'Ask students how their explanation changes if one factor changes.' : 'Ask students to test their principle against one additional condition.');
 assess.append(element('p','Use an accessible response mode when speaking or writing is not the assessed skill. A mismatch calls for clarification or further assessment, not an automatic finding of misconduct. This template needs your subject expertise; it does not rate assignment quality or guarantee learning.')); output.append(assess);
 $('plan-title').textContent='Your ACE plan'; $('actions').hidden=false; $('status').textContent='Plan ready. Click a student prompt or the permissions text to edit it before sharing.';
}
$('builder').addEventListener('submit',generate);
$('example').addEventListener('click',()=>{ $('assignment').value='Write a report explaining the causes of the French Revolution.'; $('goal').value='Explain how economic pressure and political legitimacy interact, and test that relationship against another historical case.'; $('level').value='Secondary'; $('depth').value='e'; $('change').value='A second revolution studied in the course'; $('policy').value='feedback'; generate(); });
function planText(){return 'ACE It: Assignment plan\n\n'+$('output').innerText+'\n\nCreated with https://mguhlin.github.io/ace/\n';}
$('copy').addEventListener('click', async()=>{try { await navigator.clipboard.writeText(planText()); $('status').textContent='Plan copied.'; } catch { $('status').textContent='Clipboard access is unavailable. Use Download to save your plan.'; }});
$('download').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([planText()],{type:'text/plain;charset=utf-8'})); const a=element('a'); a.href=url; a.download='ace-learning-plan.txt'; document.body.append(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),1000); $('status').textContent='Plan downloaded.';});
$('print').addEventListener('click',()=>window.print());
