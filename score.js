'use strict';
const find=id=>document.getElementById(id);
const {rubric,version}=ACE_RUBRIC;
const {assessDocument,validateEvidence,engineVersion}=ACE_ASSESSMENT;
let review=null;
function node(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
function activeCriteria(depth){return rubric.filter(r=>r.stage==='a'||depth==='e'||depth==='c'&&r.stage==='c');}
function band(score){return score<25?'Start with the goal':score<50?'Add learning actions':score<75?'Strengthen the connections':'Refine and try it';}
function update(){
 if(!review)return;
 let sum=0,confirmed=0;
 for(const item of review.items){item.rating=Number(find('rating-'+item.id).value);item.evidence=find('evidence-'+item.id).value.trim();item.checked=find('confirm-'+item.id).checked;
 const valid=item.rating===0||item.evidence.length>0&&validateEvidence(item.evidence,review.text);
 find('error-'+item.id).textContent=valid?'':'Use exact passages from the document for a positive rating. Separate multiple passages with a blank line, ---, and another blank line.';
 if(item.checked&&valid)confirmed++;sum+=item.rating;}
 const score=Math.round(sum/(review.items.length*3)*100),complete=confirmed===review.items.length;
 find('score-number').textContent=String(score);find('score-label').textContent=(complete?'Reviewed':'Preliminary')+' design score';find('score-band').textContent=band(score);find('score-calculation').textContent=`${sum} of ${review.items.length*3} rubric points · ${review.items.length} applicable criteria`;find('confirmation-count').textContent=`${confirmed} of ${review.items.length} ratings confirmed with evidence. ${complete?'All ratings reviewed.':'Review the passages and anchors before using this score.'}`;
 review.score=score;review.complete=complete;
 const priorities=find('priorities');priorities.replaceChildren();
 [...review.items].sort((a,b)=>a.rating-b.rating).filter(i=>i.rating<3).slice(0,3).forEach(i=>{const li=node('li');li.append(node('strong',i.name+': '),document.createTextNode(i.improve));priorities.append(li);});
 if(!priorities.children.length)priorities.append(node('li','Try the plan with learners and use their responses to check whether the intended depth is reached.'));
}
function makeReview(event){
 if(event)event.preventDefault();const text=find('document-text').value.trim();if(!text){find('review-status').textContent='Paste a document before creating a review.';find('document-text').focus();return;}
 const depth=find('review-depth').value;
 const suggestions=assessDocument(text);
 review={text,title:find('document-name').value.trim()||'Untitled document',type:find('document-type').value,depth,items:activeCriteria(depth).map(i=>({...i,...suggestions[i.id],suggestedRating:suggestions[i.id].rating,checked:false}))};
 const out=find('review-output');out.replaceChildren();const scorebox=node('section',undefined,'score-card');const scoreline=node('div',undefined,'score-line');scoreline.append(node('strong','0','score-number'));scoreline.firstChild.id='score-number';scoreline.append(node('span','/ 100'));scorebox.append(scoreline);const label=node('h3');label.id='score-label';scorebox.append(label);const b=node('p');b.id='score-band';scorebox.append(b);const calculation=node('p');calculation.id='score-calculation';scorebox.append(calculation);const count=node('p');count.id='confirmation-count';scorebox.append(count);scorebox.append(node('p',`Scope: ${review.type==='lesson'?'lesson plan':review.type==='combined'?'syllabus and lesson plans':'syllabus'} · ${find('review-depth').selectedOptions[0].textContent} · rubric ${version} · engine ${engineVersion}`));scorebox.append(node('p','Automatic rules collect evidence across sections and can suggest zero to three points. Check each rationale: optional activities and inferred connections still need your judgment.'));out.append(scorebox);
 out.append(node('p',review.type==='combined'?'This review uses the entire supplied document, including course procedures and lesson examples. A course procedure does not prove it occurs in every lesson.':review.type==='syllabus'?'Rate the documented course design. Do not assume missing lesson details are absent from teaching.':'This review reads all supplied sections. Choose the combined scope when course procedures and lesson examples appear together.'));
 for(const item of review.items){const card=node('section',undefined,'rating-card');card.append(node('h3',item.name));card.append(node('p',`Automatic suggestion: ${item.suggestedRating}/3. ${item.rationale}`,'rating-rationale'));if(item.locations.length)card.append(node('p','Evidence locations: '+item.locations.join('; '),'evidence-locations'));
 const label=node('label','Rating');label.htmlFor='rating-'+item.id;const select=node('select');select.id=label.htmlFor;item.anchors.forEach((anchor,index)=>{const option=node('option',index+' · '+anchor);option.value=index;select.append(option);});select.value=item.rating;select.addEventListener('change',()=>{find('confirm-'+item.id).checked=false;update();});card.append(label,select);const anchors=node('details');anchors.append(node('summary','Read all rating anchors'));const anchorList=node('ol');anchorList.start=0;item.anchors.forEach(a=>anchorList.append(node('li',a)));anchors.append(anchorList);card.append(anchors);
 const el=node('label','Supporting passages (exact text)');el.htmlFor='evidence-'+item.id;const evidence=node('textarea');evidence.id=el.htmlFor;evidence.rows=6;evidence.value=item.evidence;evidence.addEventListener('input',()=>{find('confirm-'+item.id).checked=false;update();});card.append(el,evidence);
 const error=node('p',undefined,'evidence-error');error.id='error-'+item.id;error.setAttribute('aria-live','polite');card.append(error);
 const cl=node('label',undefined,'confirm-label');const checkbox=node('input');checkbox.type='checkbox';checkbox.id='confirm-'+item.id;checkbox.addEventListener('change',update);cl.append(checkbox,document.createTextNode('I reviewed this rating against the passage and rubric.'));card.append(cl);out.append(card);}
 const next=node('section',undefined,'record');next.append(node('h3','Your next improvements'));const list=node('ul');list.id='priorities';next.append(list);out.append(next);
 const buttons=node('div',undefined,'review-actions');for(const [name,handler] of [['Copy review',copyReview],['Download review',downloadReview],['Print review',printReview]]){const button=node('button',name);button.type='button';button.addEventListener('click',handler);buttons.append(button);}out.append(buttons);update();find('review-status').textContent='Preliminary review ready. Check each passage, adjust the rating, and confirm it. Changes to the document or scope require a new review.';
}
function report(){if(!review)return '';return `ACE Check · rubric ${version}\n${review.title}\nDocument: ${review.type}\nDepth: ${review.depth}\nScoring engine: ${engineVersion}\n${review.complete?'Reviewed':'Preliminary'} design score: ${review.score}/100 · ${band(review.score)}\n\n`+review.items.map(i=>`${i.name}: ${i.rating}/3\nAnchor: ${i.anchors[i.rating]}\nAutomatic suggestion: ${i.suggestedRating}/3\nRationale: ${i.rationale}\nEvidence locations: ${i.locations.join('; ')||'No evidence detected'}\nEvidence: ${i.evidence||'Not documented in the provided text.'}\nConfirmed: ${i.checked&&(i.rating===0||i.evidence&&validateEvidence(i.evidence,review.text))?'yes':'no'}\nNext step: ${i.improve}`).join('\n\n')+'\n\n'+find('priorities').innerText+'\n\nThis planning rubric is not independently validated and does not measure student achievement or misconduct.\nhttps://mguhlin.github.io/ace/score.html\n';}
async function copyReview(){try{await navigator.clipboard.writeText(report());find('review-status').textContent='Review copied.';}catch{find('review-status').textContent='Clipboard unavailable. Use Download review.';}}
function downloadReview(){const url=URL.createObjectURL(new Blob([report()],{type:'text/plain;charset=utf-8'}));const a=node('a');a.href=url;a.download='ace-review.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);find('review-status').textContent='Review downloaded.';}
function invalidate(){if(review){review=null;find('review-output').replaceChildren(node('p','Document or scope changed. Create a new review to score the current version.'));find('review-status').textContent='Previous review cleared.';}}
find('review-form').addEventListener('submit',makeReview);
for(const id of ['document-text','document-type','review-depth','document-name'])find(id).addEventListener('input',invalidate);
// PDF.js is served by this site and loaded only for a PDF selection.
let fileLoadId = 0;
let pdfTask = null;
let pdfLibrary = null;
let docxTask = null;
function setFileLoading(loading) {
 find('review-form').setAttribute('aria-busy', String(loading));
 for (const control of find('review-form').querySelectorAll('input, textarea, select, button')) {
  if (control.id !== 'document-file') control.disabled = loading;
 }
}
async function extractPDF(file, loadId) {
 pdfLibrary ||= import('./vendor/pdfjs/pdf.min.mjs').catch(error => { pdfLibrary = null; throw error; });
 const pdfjs = await pdfLibrary;
 if (loadId !== fileLoadId) return null;
 pdfjs.GlobalWorkerOptions.workerSrc = new URL('./vendor/pdfjs/pdf.worker.min.mjs', document.baseURI).href;
 const task = pdfjs.getDocument({
  data: new Uint8Array(await file.arrayBuffer()),
  cMapUrl: new URL('./vendor/pdfjs/cmaps/', document.baseURI).href,
  cMapPacked: true,
  standardFontDataUrl: new URL('./vendor/pdfjs/standard_fonts/', document.baseURI).href,
  isEvalSupported: false,
  disableFontFace: true
 });
 if (loadId !== fileLoadId) { await task.destroy(); return null; }
 pdfTask = task;
 try {
  const pdf = await task.promise;
  if (pdf.numPages > 200) throw new Error('PDF_PAGE_LIMIT');
  const pages = []; let total = 0; let emptyPages = 0;
  for (let number = 1; number <= pdf.numPages; number++) {
   if (loadId !== fileLoadId) return null;
   find('file-status').textContent = `Reading PDF page ${number} of ${pdf.numPages}…`;
   const page = await pdf.getPage(number);
   const content = await page.getTextContent();
   const text = content.items.filter(item => typeof item.str === 'string')
    .map(item => item.str + (item.hasEOL ? '\n' : ' ')).join('').trim();
   page.cleanup();
   if (!text) emptyPages++;
   pages.push(text);
   total += text.length + 2;
   if (total > 100000) throw new Error('DOCUMENT_TEXT_LIMIT');
  }
  const text = pages.join('\n\n').trim();
  if (!text) throw new Error('PDF_NO_TEXT');
  return {text, message: `PDF text loaded locally from ${pdf.numPages} ${pdf.numPages === 1 ? 'page' : 'pages'}. Check the extracted text before scoring.` +
   (emptyPages ? ` ${emptyPages} ${emptyPages === 1 ? 'page had' : 'pages had'} no readable text; check for scans or missing content.` : '')};
 } finally {
  await task.destroy();
  if (pdfTask === task) pdfTask = null;
 }
}
async function extractDOCX(file, loadId) {
 const data = await file.arrayBuffer();
 if (loadId !== fileLoadId) return null;
 return new Promise((resolve, reject) => {
  const worker = new Worker('./docx-worker.js');
  const timer = setTimeout(() => finish(new Error('DOCX_TIMEOUT')), 30000);
  const task = {worker, cancel: () => finish(new Error('LOAD_CANCELLED'))};
  docxTask = task;
  function finish(error, result) {
   clearTimeout(timer); worker.terminate();
   if (docxTask === task) docxTask = null;
   if (error) reject(error); else resolve(result);
  }
  worker.onmessage = event => {
   if (event.data.error) return finish(new Error(event.data.error));
   finish(null, {text: event.data.text, message: 'DOCX text loaded locally. Check the extracted text before scoring.' +
    (event.data.warnings ? ' Some document features were not recognized; compare the text with your original.' : '')});
  };
  worker.onerror = event => { event.preventDefault(); finish(new Error('DOCX_INVALID')); };
  worker.postMessage(data, [data]);
 });
}
find('document-file').addEventListener('change', async () => {
 const file = find('document-file').files[0]; if (!file) return;
 const loadId = ++fileLoadId;
 if (pdfTask) { pdfTask.destroy().catch(() => {}); pdfTask = null; }
 if (docxTask) docxTask.cancel();
 find('document-file').value = '';
 const isPDF = /\.pdf$/i.test(file.name);
 const isDOCX = /\.docx$/i.test(file.name);
 if (!/\.(pdf|docx|txt|md)$/i.test(file.name) || file.size > (isPDF || isDOCX ? 10000000 : 500000)) {
  setFileLoading(false);
  find('file-status').textContent = 'Choose a PDF or DOCX up to 10 MB, or a .txt or .md file up to 500 KB. Your existing text is unchanged.';
  return;
 }
 setFileLoading(true);
 find('file-status').textContent = isPDF ? 'Reading PDF locally…' : isDOCX ? 'Reading DOCX locally…' : 'Reading file locally…';
 try {
  const result = isPDF ? await extractPDF(file, loadId) : isDOCX ? await extractDOCX(file, loadId) : {text: await file.text(), message: 'File loaded locally. Check the text before scoring.'};
  if (loadId !== fileLoadId || !result) return;
  if (result.text.length > 100000) throw new Error('DOCUMENT_TEXT_LIMIT');
  if (!result.text.trim()) throw new Error('DOCUMENT_NO_TEXT');
  invalidate();
  find('document-text').value = result.text;
  find('file-status').textContent = result.message;
  find('review-status').textContent = 'Document loaded. Create a preliminary review when ready.';
 } catch (error) {
  if (loadId !== fileLoadId) return;
  let message = 'Could not read this file. Try a different file or paste its text.';
  if (error.name === 'PasswordException') message = 'This PDF needs a password. Save an unlocked copy and try again.';
  else if (error.message === 'PDF_NO_TEXT') message = 'No readable text was found. This PDF may be a scan. Run OCR first, then upload the searchable PDF or paste its text.';
  else if (error.message === 'PDF_PAGE_LIMIT') message = 'This PDF exceeds 200 pages. Upload the relevant lesson or syllabus pages.';
  else if (error.message === 'DOCUMENT_TEXT_LIMIT') message = 'The extracted text exceeds 100,000 characters. Upload a shorter document or paste the relevant sections.';
  else if (error.message === 'DOCUMENT_NO_TEXT') message = 'This file contains no text. Choose another file or paste its text.';
  else if (error.message === 'DOCX_INVALID') message = 'Could not read this DOCX. It may be damaged, password-protected, or not a DOCX file. Save a fresh DOCX copy or paste its text.';
  else if (error.message === 'DOCX_TIMEOUT') message = 'This DOCX took too long to read. Try a shorter document or paste the relevant text.';
  else if (error.name === 'InvalidPDFException') message = 'This PDF is damaged or is not a valid PDF. Save a fresh copy and try again.';
  find('file-status').textContent = message + ' Your existing text is unchanged.';
 } finally {
  if (loadId === fileLoadId) setFileLoading(false);
 }
});
find('review-example').addEventListener('click',()=>{find('document-type').value='lesson';find('review-depth').value='e';find('document-name').value='Survey conclusions';find('document-text').value='Learning goal: Students will explain how sample selection affects a survey conclusion.\nThe assignment and success criteria assess that learning goal through a supported explanation.\nStudents explain the concept of sample bias and give an example and a non-example.\nStudents explain how sample selection and the resulting conclusion relate, using evidence to support the relationship.\nThe teacher models a worked example, gives specific feedback, and asks students to revise their explanation and explain what improved.\nStudents predict how the conclusion changes in a new case, justify a broader principle, and explain its limits with a counterexample.\nEach student completes an individual check to explain their reasoning, using a written response, diagram, or spoken explanation. The teacher will reteach if the relationship is unclear.';makeReview();});

function printReview(){let pre=find('print-review');if(!pre){pre=node('pre');pre.id='print-review';document.body.append(pre);}pre.textContent=report();document.body.classList.add('printing-review');window.print();}
window.addEventListener('afterprint',()=>document.body.classList.remove('printing-review'));
