'use strict';
const find=id=>document.getElementById(id);
const {rubric,version}=ACE_RUBRIC;
let review=null;
function node(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
function activeCriteria(depth){return rubric.filter(r=>r.stage==='a'||depth==='e'||depth==='c'&&r.stage==='c');}
function band(score){return score<25?'Start with the goal':score<50?'Add learning actions':score<75?'Strengthen the connections':'Refine and try it';}
function draftRating(item,text){
 const passages=text.split(/\n+|(?<=[.!?])\s+/).map(x=>x.trim()).filter(Boolean);
 const hits=passages.filter(p=>item.patterns.some(pattern=>pattern.test(p)));
 // A phrase match is a candidate for human review, not a semantic judgment.
 const together=hits.find(p=>item.patterns.every(pattern=>pattern.test(p)));
 return {rating:together?2:hits.length?1:0,evidence:together||hits[0]||''};
}
function update(){
 if(!review)return;
 let sum=0,confirmed=0;const missing=[];
 for(const item of review.items){item.rating=Number(find('rating-'+item.id).value);item.evidence=find('evidence-'+item.id).value.trim();item.checked=find('confirm-'+item.id).checked;
 const valid=item.rating===0||item.evidence.length>0&&review.text.includes(item.evidence);
 find('error-'+item.id).textContent=valid?'':'Use an exact passage from the document for a positive rating.';
 if(item.checked&&valid)confirmed++;else missing.push(item.name);sum+=item.rating;}
 const score=Math.round(sum/(review.items.length*3)*100),complete=confirmed===review.items.length;
 find('score-number').textContent=String(score);find('score-label').textContent=(complete?'Reviewed':'Preliminary')+' design score';find('score-band').textContent=band(score);find('confirmation-count').textContent=`${confirmed} of ${review.items.length} ratings confirmed with evidence. ${complete?'All ratings reviewed.':'Review the passages and anchors before using this score.'}`;
 review.score=score;review.complete=complete;
 const priorities=find('priorities');priorities.replaceChildren();
 [...review.items].sort((a,b)=>a.rating-b.rating).filter(i=>i.rating<3).slice(0,3).forEach(i=>{const li=node('li');li.append(node('strong',i.name+': '),document.createTextNode(i.improve));priorities.append(li);});
 if(!priorities.children.length)priorities.append(node('li','Try the plan with learners and use their responses to check whether the intended depth is reached.'));
}
function makeReview(event){
 if(event)event.preventDefault();const text=find('document-text').value.trim();if(!text){find('review-status').textContent='Paste a document before creating a review.';find('document-text').focus();return;}
 const depth=find('review-depth').value;
 review={text,title:find('document-name').value.trim()||'Untitled document',type:find('document-type').value,depth,items:activeCriteria(depth).map(i=>({...i,...draftRating(i,text),checked:false}))};
 const out=find('review-output');out.replaceChildren();const scorebox=node('section',undefined,'score-card');const scoreline=node('div',undefined,'score-line');scoreline.append(node('strong','0','score-number'));scoreline.firstChild.id='score-number';scoreline.append(node('span','/ 100'));scorebox.append(scoreline);const label=node('h3');label.id='score-label';scorebox.append(label);const b=node('p');b.id='score-band';scorebox.append(b);const count=node('p');count.id='confirmation-count';scorebox.append(count);scorebox.append(node('p',`Scope: ${review.type==='lesson'?'lesson plan':'syllabus'} · ${find('review-depth').selectedOptions[0].textContent} · rubric ${version}`));out.append(scorebox);
 out.append(node('p',review.type==='syllabus'?'Rate the documented course design. Do not assume missing lesson details are absent from teaching.':'Rate only the practices documented in this lesson plan. A practice named without an action is not an integrated design.'));
 for(const item of review.items){const card=node('section',undefined,'rating-card');card.append(node('h3',item.name));
 const label=node('label','Rating');label.htmlFor='rating-'+item.id;const select=node('select');select.id=label.htmlFor;item.anchors.forEach((anchor,index)=>{const option=node('option',index+' · '+anchor);option.value=index;select.append(option);});select.value=item.rating;select.addEventListener('change',()=>{find('confirm-'+item.id).checked=false;update();});card.append(label,select);const anchors=node('details');anchors.append(node('summary','Read all rating anchors'));const anchorList=node('ol');anchorList.start=0;item.anchors.forEach(a=>anchorList.append(node('li',a)));anchors.append(anchorList);card.append(anchors);
 const el=node('label','Supporting passage (exact text)');el.htmlFor='evidence-'+item.id;const evidence=node('textarea');evidence.id=el.htmlFor;evidence.rows=3;evidence.value=item.evidence;evidence.addEventListener('input',()=>{find('confirm-'+item.id).checked=false;update();});card.append(el,evidence);
 const error=node('p',undefined,'evidence-error');error.id='error-'+item.id;error.setAttribute('aria-live','polite');card.append(error);
 const cl=node('label',undefined,'confirm-label');const checkbox=node('input');checkbox.type='checkbox';checkbox.id='confirm-'+item.id;checkbox.addEventListener('change',update);cl.append(checkbox,document.createTextNode('I reviewed this rating against the passage and rubric.'));card.append(cl);out.append(card);}
 const next=node('section',undefined,'record');next.append(node('h3','Your next improvements'));const list=node('ul');list.id='priorities';next.append(list);out.append(next);
 const buttons=node('div',undefined,'review-actions');for(const [name,handler] of [['Copy review',copyReview],['Download review',downloadReview],['Print review',printReview]]){const button=node('button',name);button.type='button';button.addEventListener('click',handler);buttons.append(button);}out.append(buttons);update();find('review-status').textContent='Preliminary review ready. Check each passage, adjust the rating, and confirm it. Changes to the document or scope require a new review.';
}
function report(){if(!review)return '';return `ACE Check · rubric ${version}\n${review.title}\nDocument: ${review.type}\nDepth: ${review.depth}\n${review.complete?'Reviewed':'Preliminary'} design score: ${review.score}/100 · ${band(review.score)}\n\n`+review.items.map(i=>`${i.name}: ${i.rating}/3\nAnchor: ${i.anchors[i.rating]}\nEvidence: ${i.evidence||'Not documented in the provided text.'}\nConfirmed: ${i.checked&&(i.rating===0||i.evidence&&review.text.includes(i.evidence))?'yes':'no'}\nNext step: ${i.improve}`).join('\n\n')+'\n\n'+find('priorities').innerText+'\n\nThis planning rubric is not independently validated and does not measure student achievement or misconduct.\nhttps://mguhlin.github.io/ace/score.html\n';}
async function copyReview(){try{await navigator.clipboard.writeText(report());find('review-status').textContent='Review copied.';}catch{find('review-status').textContent='Clipboard unavailable. Use Download review.';}}
function downloadReview(){const url=URL.createObjectURL(new Blob([report()],{type:'text/plain;charset=utf-8'}));const a=node('a');a.href=url;a.download='ace-review.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);find('review-status').textContent='Review downloaded.';}
function invalidate(){if(review){review=null;find('review-output').replaceChildren(node('p','Document or scope changed. Create a new review to score the current version.'));find('review-status').textContent='Previous review cleared.';}}
find('review-form').addEventListener('submit',makeReview);
for(const id of ['document-text','document-type','review-depth','document-name'])find(id).addEventListener('input',invalidate);
find('document-file').addEventListener('change',async()=>{const file=find('document-file').files[0];if(!file)return;if(!/\.(txt|md)$/i.test(file.name)||file.size>500000){find('review-status').textContent='Choose a .txt or .md file under 500 KB.';find('document-file').value='';return;}try{const text=await file.text();if(text.length>100000)throw new Error('too large');invalidate();find('document-text').value=text;find('review-status').textContent='File loaded locally. Create a preliminary review when ready.';}catch{find('review-status').textContent='Could not read this file. Paste text under 100,000 characters instead.';}find('document-file').value='';});
find('review-example').addEventListener('click',()=>{find('document-type').value='lesson';find('review-depth').value='e';find('document-name').value='Survey conclusions';find('document-text').value='Learning goal: Students will explain how sample selection affects a survey conclusion.\nThe assignment and success criteria assess that learning goal through a supported explanation.\nStudents explain the concept of sample bias and give an example and a non-example.\nStudents explain how sample selection and the resulting conclusion relate, using evidence to support the relationship.\nThe teacher models a worked example, gives specific feedback, and asks students to revise their explanation and explain what improved.\nStudents predict how the conclusion changes in a new case, justify a broader principle, and explain its limits with a counterexample.\nEach student completes an individual check to explain their reasoning, using a written response, diagram, or spoken explanation. The teacher will reteach if the relationship is unclear.';makeReview();});

function printReview(){let pre=find('print-review');if(!pre){pre=node('pre');pre.id='print-review';document.body.append(pre);}pre.textContent=report();document.body.classList.add('printing-review');window.print();}
window.addEventListener('afterprint',()=>document.body.classList.remove('printing-review'));
