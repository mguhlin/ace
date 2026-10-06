const assert=require('node:assert/strict');const fs=require('node:fs');
const {assessDocument,validateEvidence}=require('../assessment.js');
const ratings=result=>Object.fromEntries(Object.entries(result).map(([id,r])=>[id,r.rating]));
const sum=result=>Object.values(result).reduce((total,r)=>total+r.rating,0);
const strong=`# Learning goal
Students will explain how sample selection affects survey conclusions.
# Success criteria
Students explain how sample selection changes survey conclusions and support the relationship with evidence.
# Assignment
Students choose a sample and explain their survey conclusions with evidence.
# Concept practice
Students explain the concept of sample bias with an example and a non-example. The teacher addresses misconceptions using contrasting examples.
# Reasoning
Students explain how sample selection and conclusions relate using evidence.
Students revise their explanation after feedback.
# Teaching routine
The instructor models a worked example of reasoning and provides specific feedback.
# Revision
Students revise their explanation using feedback and explain what improved and why.
# Changed conditions
Students predict outcomes in a new case and justify a broader principle. They explain its limits with a counterexample.
# Individual check
Each student completes an individual check to explain their reasoning using a written response, diagram, or spoken explanation. The teacher will reteach if the relationship is unclear.`;
const full=assessDocument(strong);assert.deepEqual(ratings(full),{alignment:3,articulate:3,connect:3,extend:3,revision:3,check:3});assert.equal(sum(full),18);for(const r of Object.values(full))assert.ok(validateEvidence(r.evidence,strong));
const noRevision=strong.replace('Students revise their explanation after feedback.','Students are willing to revise a claim.').replace('Students revise their explanation using feedback and explain what improved and why.','After teaching, revise the segment using feedback and write a short explanation of what changed and why.');assert.equal(assessDocument(noRevision).connect.rating,2);assert.equal(assessDocument(noRevision).revision.rating,3);
const noNonExample=strong.replace('with an example and a non-example. The teacher addresses misconceptions using contrasting examples.','with an example.');assert.equal(assessDocument(noNonExample).articulate.rating,2);
const noDecision=strong.replace('The teacher will reteach if the relationship is unclear.','What would you reteach next time?');assert.equal(assessDocument(noDecision).check.rating,2);
const optional=strong.replace('# Changed conditions','# Optional extension');assert.equal(assessDocument(optional).extend.rating,2);
assert.equal(sum(assessDocument('Office hours are Wednesday. The reading list is posted.')),0);
assert.equal(assessDocument('# Learning goal\nStudents will explain photosynthesis.\n# Assignment\nStudents write a report on the French Revolution.\n# Success criteria\nCompare historical sources using evidence.').alignment.rating,1);
const basic=assessDocument('Students identify regions and list facts.');assert.ok(sum(basic)<6);assert.deepEqual(ratings(assessDocument('# ACE\n\n# SOLO\n\n# Feedback\n\n# Transfer')),{alignment:0,articulate:0,connect:0,extend:0,revision:0,check:0});
const negative=assessDocument('Students do not explain concepts. No feedback is provided. Students will not revise their explanation. No individual check is required.');assert.equal(negative.articulate.rating,0);assert.equal(negative.revision.rating,0);assert.equal(negative.check.rating,0);
assert.ok(validateEvidence('first passage\n\n---\n\nsecond passage','first passage and second passage'));assert.equal(validateEvidence('first passage\n\n---\n\ninvented passage','first passage and second passage'),false);
if(process.env.ACE_REVIEW_DOCUMENT){const text=fs.readFileSync(process.env.ACE_REVIEW_DOCUMENT,'utf8');const assessment=assessDocument(text);assert.deepEqual(ratings(assessment),{alignment:3,articulate:2,connect:2,extend:2,revision:3,check:2});assert.equal(Math.round(sum(assessment)/18*100),78);assert.equal(Math.round((sum(assessment)-assessment.extend.rating)/15*100),80);for(const r of Object.values(assessment))assert.ok(validateEvidence(r.evidence,text));console.log('PASS: supplied combined document scores 78 Extend and 80 Connect without publishing its content.');}
console.log('PASS: full-range ratings, cross-section evidence, required versus encouraged revision, non-examples, conditional teaching decisions, optional extension, negative/empty inputs, and multi-passage evidence validation.');
