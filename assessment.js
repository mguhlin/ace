/* Local, explainable rubric suggestions. No document-specific score overrides. */
(function(root) {
'use strict';
const engineVersion = '2.0';
function passages(text) {
 let section='Document'; let buffer=[]; const rows=[];
 const flush=()=>{const value=buffer.join('\n').trim();if(value&&!/^\|[- :|]+\|$/.test(value))rows.push({text:value,section});buffer=[];};
 for(const line of text.split('\n')) {
  if(/^#{1,6}\s/.test(line)) {flush();section=line.replace(/^#+\s*/, '').trim();}
  else if(!line.trim())flush();
  else buffer.push(line);
 }
 flush();return rows;
}
function positive(p, pattern) {
 const sentences=p.text.split(/(?<=[.!?])\s+|\n/);
 return sentences.some(s=>{
  if(/\b(?:hope to|wish to|consider adding|could add|not yet|future idea)\b/i.test(s))return false;
  const match=pattern.exec(s); if(!match)return false;
  const before=s.slice(Math.max(0,match.index-65),match.index);
  // Do not count a named practice that the writer explicitly excludes.
  if(/\b(?:no|never|not|without|omit|omits|exclude|excludes)\b[^.;:!?]{0,55}$/i.test(before))return false;
  if(/\b(?:do not|does not|will not|must not|may not|don't|doesn't|won't)\b[^.;:!?]{0,55}$/i.test(before))return false;
  return true;
 });
}
function tokens(text) {
 const ignored=new Set('students student candidates candidate teacher teachers explain explains learning goal outcome criteria success evidence support supported task assignment assessment intended stated that this with from their have will about through using make clear'.split(' '));
 return new Set((text.toLowerCase().match(/[a-z]{4,}/g)||[]).map(w=>w.replace(/^geograph\w*$/,'geograph').replace(/(?:ing|tion|s)$/,'')).filter(w=>!ignored.has(w)));
}
function linked(a,b) { const left=tokens(a.text);return [...tokens(b.text)].some(t=>left.has(t)); }
function assessDocument(text) {
 const rows=passages(text);
 const hit=(re,where=()=>true)=>rows.find(p=>where(p)&&positive(p,re));
 const context=(p,re)=>re.test(p.section)||re.test(p.text);
 const studentExplanation=hit(/\b(?:explain|describe|define)\b|in (?:your|their|own) words/i,p=>/success criteria|articulate|reasoning/i.test(p.section))||hit(/\b(?:explain|describe|define|interpret)\b|in (?:your|their|own) words/i,p=>context(p,/student|candidate|learning intention|success criteria|articulate|exit|reasoning|teacher prompt|sentence stem/i));
 const evidence=hit(/(?:require|give|cite|support|strongest|accurate).{0,65}evidence|evidence.{0,65}(?:support|claim|reason)/i,p=>/comparison|success criteria|exit ticket|reasoning|recommendation|scenario|formative check/i.test(p.section))||hit(/evidence|support|justify|because/i);
 const goal=hit(/students will|candidates will|explain|understand|demonstrate/i,p=>/learning (?:goal|intention|objective)/i.test(p.section))||hit(/students will|candidates will|learning (?:goal|intention|objective|outcome)|by the end/i);
 const taskAction=/\b(?:explain|make|complete|write|choose|design|respond|prepare|teach|select|identify)\b/i;
 const taskContext=p=>context(p,/assignment|task|challenge|recommendation|exit|investigation|assessment|scenario/i);
 const task=hit(taskAction,p=>/scenario|challenge|exit|recommendation/i.test(p.section)&&goal&&linked(goal,p))||hit(taskAction,p=>taskContext(p)&&goal&&linked(goal,p))||hit(taskAction,taskContext);
 const criterionAction=/\b(?:explain|claim|connect|compare|describe|evidence|reasoning|demonstrate|accurate)\b/i;
 const criteria=hit(criterionAction,p=>/success criteria|exit ticket criteria/i.test(p.section))||hit(criterionAction,p=>context(p,/success criteria|exit ticket criteria|rubric|proficient|success/i));
 const model=hit(/\bmodel(?:s|ing)?\b|worked example|think.aloud/i);
 const reasoningModel=hit(/\bmodel(?:s|ing)?\b|worked example|think.aloud/i,p=>/reason|thinking|worked example|process|explain/i.test(p.text));
 const feedback=hit(/\bfeedback\b/i,p=>positive(p,/revise|revision|next step|specific/i))||hit(/\bfeedback\b/i);
 const revision=hit(/(?:revise|practice).{0,65}(?:feedback|explanation|reasoning|claim|segment)/i,p=>!context(p,/(?:be|are|is) willing|opportunities to|what would you|would you revise/i))||hit(/\brevise\b|\brevision\b|\bpractice\b/i,p=>!context(p,/(?:be|are|is) willing|opportunities to|what would you|would you revise/i));
 const revisionWhy=hit(/explain.{0,65}(?:improv|chang|revis)|explanation.{0,65}(?:chang|why)|what (?:changed|improved).{0,30}(?:why|reason)|how.{0,30}revis.{0,50}improv/i,p=>positive(p,/revis|feedback/i));
 const individual=hit(/respond individually|individual (?:check|response|exit|explanation|application|item)|students.{0,30}individually/i)||hit(/each student.{0,70}(?:explain|apply|respond|solve|reason)/i);
 const accessible=hit(/oral explanation|spoken explanation|written response.{0,60}(?:diagram|spoken)|multiple ways.{0,60}show understanding|accessible response|response (?:option|mode)/i);
 const checkReason=hit(/explain|reasoning|apply|understanding/i,p=>/reasoning|exit ticket/i.test(p.section))||hit(/explain|reasoning|apply|understanding/i,p=>context(p,/individual/i));
 const nextTeaching=hit(/\b(?:will|then|must)\s+(?:reteach|remodel|extend|teach again)|\b(?:reteach|remodel)\b.{0,80}\bif\b|\bif\b.{0,120}\b(?:reteach|remodel|small.group|extension)\b/i,p=>!/\?/.test(p.text));
 const checkCondition=hit(/\bif\b.{0,100}(?:unclear|weak|incorrect|misconception|cannot|can't|struggl|not understand|list facts)/i);
 const relationship=hit(/how.{0,100}(?:relat|affect|connect|influenc|interact|support)|(?:relationship|interact|connect).{0,100}(?:explain|evidence|because)|difference.{0,100}because/i);
 const relationshipRevision=hit(/(?:revise|test|revising)\s+(?:(?:their|your|the|a|an|one|our|initial|original|supported)\s+){0,3}(?:relationship|claim|explanation|conclusion|reasoning|argument)/i,p=>!context(p,/(?:be|are|is) willing|may ask|optional|what would you/i));
 const novel=hit(/new (?:case|context|situation|community)|changed (?:condition|constraint)|different (?:case|context|scenario)|not discussed|\bscenario\b|\btransfer\b/i);
 const application=hit(/\b(?:apply|choose|recommend|explain|predict)\b/i,p=>context(p,/scenario|new case|new context|changed condition|not discussed|transfer|extend|recommendation/i));
 const broad=hit(/(?:justify|explain|support|test).{0,80}(?:broader|general|principle|prediction)|(?:principle|generalization|prediction).{0,80}(?:justify|explain|support|test)/i,p=>!context(p,/optional|advanced learners|(?:be|are|is) willing/i));
 const bounded=broad&&hit(/limit|counterexample|fail|boundar/i,p=>p===broad||Math.abs(rows.indexOf(p)-rows.indexOf(broad))<=1);
 function result(rating,selected,rationale) {
  const unique=[...new Set(selected.filter(Boolean))];
  return {rating,evidence:unique.map(p=>p.text).join('\n\n---\n\n'),evidenceParts:unique.map(p=>p.text),locations:unique.map(p=>p.section),rationale};
 }
 const aligned=goal&&task&&criteria&&(linked(goal,task)||linked(goal,criteria)||/that learning goal|stated learning goal|intended learning/i.test(criteria.text));
 const nonExample=hit(/non.example|example.{0,30}non.example|contrast.{0,40}(?:example|incorrect)/i);
 const misconceptionSupport=hit(/(?:address|correct|clarify|reteach|reinforce|contrast|support).{0,80}(?:misconception|incorrect|non.example)|misconception.{0,80}(?:address|correct|clarify|reteach)/i);
 const conceptExample=hit(/\bexample\b|characteristics of each|at least two characteristics|describe.{0,70}(?:region|concept|feature)/i);
 const identification=hit(/\b(?:identify|label|locate|list|recall)\b/i,p=>/student|candidate/i.test(p.text)||/concept|practice|instruction|articulate|success criteria|assessment/i.test(p.section)||/^(?:[-*]\s*)?(?:identify|label|locate|list|recall)\b/i.test(p.text));
 const supportedRelation=relationship&&evidence;
 const extendedApplication=novel&&application&&(evidence||studentExplanation);
 return {
  alignment:result(aligned?3:goal&&task&&linked(goal,task)?2:goal||task?1:0,[goal,task,criteria],aligned?'The document links a learning goal, a demonstration task, and success criteria. Check that they assess the same intended depth.':'The detected goal and task need a clearer connection to success criteria.'),
  articulate:result(studentExplanation&&conceptExample&&nonExample&&misconceptionSupport?3:studentExplanation&&conceptExample?2:identification||studentExplanation?1:0,[studentExplanation,conceptExample,nonExample,misconceptionSupport],nonExample&&misconceptionSupport?'Explanation, examples/non-examples, and a response to misconceptions are documented.':'Concept explanation is documented where detected; an explicit non-example and response to misconceptions are needed for three points.'),
  connect:result(supportedRelation&&relationshipRevision?3:supportedRelation?2:relationship||identification?1:0,[relationship,supportedRelation?evidence:null,relationshipRevision],relationshipRevision?'The document asks for a supported relationship and requires testing or revision of reasoning.':'Supported relationships can earn two points. Encouraging willingness to revise alone does not earn three.'),
  extend:result(extendedApplication&&broad&&bounded?3:extendedApplication?2:novel&&application?1:0,[novel,application,extendedApplication?evidence:null,broad,bounded],broad&&bounded?'A broader principle or prediction is justified and its limits are examined.':'Application to a different case is supported where detected; a required broader generalization and its limits are needed for three points.'),
  revision:result(reasoningModel&&feedback&&revision&&revisionWhy?3:(model||feedback)&&revision?2:model||feedback?1:0,[reasoningModel||model,revisionWhy||feedback,revision,revisionWhy],revisionWhy?'Modeling, feedback, revision, and an explanation of what changed and why are documented across the supplied material.':'Pair modeling or useful feedback with action, then require students to explain what the revision improved.'),
  check:result(individual&&checkReason&&accessible&&nextTeaching&&checkCondition?3:individual&&checkReason&&accessible?2:individual?1:0,[individual,checkReason,accessible,nextTeaching&&checkCondition?nextTeaching:null],nextTeaching&&checkCondition?'An accessible individual reasoning check is tied to a conditional teaching response.':'An individual explanation can earn two points with an accessible mode. A stated teaching response to its results is needed for three.'),
 };
}
function validateEvidence(evidence,text) {
 const parts=evidence.split(/\n\n---\n\n/).map(p=>p.trim()).filter(Boolean);
 return parts.length>0&&parts.every(p=>text.includes(p));
}
const api={engineVersion,assessDocument,validateEvidence};
if(typeof module==='object'&&module.exports)module.exports=api;else root.ACE_ASSESSMENT=api;
})(globalThis);
