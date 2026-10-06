/* Shared rubric for the browser review and downloadable skill. */
(function(root){
const rubric = [
 {id:'alignment',name:'Goal-to-task fit',stage:'a',anchors:['No assessable learning goal or no task is stated.','A learning goal and task are stated, but their alignment is unclear.','The task asks students to demonstrate the stated goal.','The goal, task, and success criteria align at the intended SOLO depth.'],improve:'State one assessable outcome, then identify the task and success criteria that show it.'},
 {id:'articulate',name:'Concept explanation',stage:'a',anchors:['No opportunity to reveal concept understanding is described.','Students identify or recall relevant information.','Students explain relevant concepts and provide examples.','Students explain concepts, distinguish examples from non-examples, and receive support for misconceptions.'],improve:'Add a brief explanation with an example. Identify how you will respond to a misconception.'},
 {id:'connect',name:'Reasoned relationships',stage:'c',anchors:['No relationship among ideas is required.','Students name or compare several ideas without explaining their relationship.','Students explain how or why ideas relate, with support.','Students integrate ideas into a coherent explanation and test or revise the relationship.'],improve:'Ask students to explain how two ideas interact, support the relationship, and revise one weak link.'},
 {id:'extend',name:'Bounded generalization',stage:'e',anchors:['No application beyond the original case is described.','Students apply a method to a similar example.','Students apply a principle under changed conditions and explain their reasoning.','Students justify a broader principle or prediction and explain a limit or counterexample.'],improve:'Change an assumption or case. Ask what principle carries over and when it would fail.'},
 {id:'revision',name:'Instruction-to-revision cycle',stage:'a',anchors:['No modeling, useful feedback, or opportunity to act on feedback is described.','Modeling or feedback is mentioned without a clear student action.','Modeling or actionable feedback is paired with student practice or revision.','Students see modeled reasoning, act on specific feedback, and explain how a revision improves their understanding.'],improve:'Model one reasoning move. Give specific feedback, allow revision, and ask what improved.'},
 {id:'check',name:'Individual learning check',stage:'a',anchors:['Only a completed product or group result is assessed.','An individual response is collected, but understanding is not examined.','Students individually explain or apply the intended learning, with an accessible response option.','The individual check reveals the intended depth and informs a stated reteaching or extension decision.'],improve:'Add a brief individual explanation or application. Offer an accessible mode and state how the result guides teaching.'}
];
const depthHelp={
 a:{label:'Articulate',meaning:'Students explain one concept or several relevant facts accurately. This is unistructural (one aspect) or multistructural (several aspects) understanding in SOLO.',example:'Explain what a physical region is and describe its features.'},
 c:{label:'Connect',meaning:'Students explain how ideas fit together and why the relationship matters. This is relational understanding in SOLO; a list of separate facts is not enough.',example:'Explain how access to water influences where people settle, using evidence.'},
 e:{label:'Extend',meaning:'Students justify a principle or prediction beyond the original case and explain when it might fail. This is extended-abstract understanding in SOLO; another similar example alone is not enough.',example:'Propose a principle about water and settlement, test it in another setting, and explain when technology could change the prediction.'}
};
const guidance={
 alignment:{meaning:'Does the work students do actually show the understanding promised by the learning goal?',explanations:[
  'An assessable goal says what students will explain, solve, or demonstrate. A topic such as “geography” alone is not a goal; without a goal or task, the match cannot be checked.',
  'The goal and task exist, but you cannot tell whether the task shows that learning. Example: the goal asks students to explain settlement, but the task only asks them to label a map.',
  'Students do work that demonstrates the goal. Example: they explain why a settlement fits a location. Clear success criteria describing a good explanation are still needed for three points.',
  'Intended SOLO depth means the kind of understanding you want students to show: explain concepts (Articulate), explain relationships (Connect), or justify generalizations and their limits (Extend). The goal, task, and success criteria must ask for that same kind of thinking. Success criteria describe what a successful response includes.'
 ]},
 articulate:{meaning:'Can students explain the idea accurately, rather than only name it?',explanations:[
  'The document does not describe how students will show that they understand the concept. This means the opportunity is not documented, not that students cannot understand it.',
  'Students name, label, identify, or recall information. Example: they name a river. This checks recognition, but does not yet show that they can explain the concept.',
  'Students explain the concept and give an example. Example: they explain what a natural resource is and identify water as an example.',
  'Students explain what belongs to the concept and what does not. A non-example is a case that does not fit, such as a human-built road when identifying natural features. The teacher also addresses a mistaken idea, rather than only listing possible misconceptions.'
 ]},
 connect:{meaning:'Can students explain a relationship among ideas and support it?',explanations:[
  'Students are not asked to show how ideas relate. Listing water, climate, and transport as separate facts does not explain their connections.',
  'Students name or compare ideas but do not explain how or why they are connected. Example: they state that two places have different rainfall without explaining why the difference matters.',
  'Students explain the relationship and support it with evidence or reasoning. Example: they use rainfall and farming information to explain why a location may support crops.',
  'A coherent explanation brings the ideas together so the reasoning makes sense. Students must test the relationship or revise their explanation after a challenge or new evidence. “Be willing to revise” alone does not require this action.'
 ]},
 extend:{meaning:'Can students carry a principle into another situation and explain its limits?',explanations:[
  'Students work only with the original case. The document does not describe using the learning in another situation.',
  'Students repeat a familiar method on a similar example. Example: they use the same map-reading steps on another map, without explaining a broader principle.',
  'Students apply an idea when a case, condition, or assumption changes and explain why it still works or needs adjustment. Example: they explain how a settlement choice changes during a drought.',
  'A generalization is a broader claim that reaches beyond one case. Bounded means students explain when that claim may not hold. A counterexample is a case that challenges it. Example: students justify a claim about water and settlement, then explain how irrigation limits that claim.'
 ]},
 revision:{meaning:'Do teaching and feedback lead students to improve and explain their reasoning?',explanations:[
  'The document does not describe showing students how to think through a task, giving useful feedback, or letting them act on it. A final grade alone does not provide this cycle.',
  'Modeling or feedback is mentioned, but the student action is unclear. Modeling means showing the thinking steps, not simply displaying a finished answer.',
  'Students see a model or receive a specific suggestion, then practice or revise. Actionable feedback tells them what to improve, such as “explain how this evidence supports your claim.”',
  'Integrated means the parts work together: students see reasoning modeled, act on specific feedback, and explain what changed and why the revision improved their understanding. These steps can be documented in different sections of a combined plan.'
 ]},
 check:{meaning:'Can you see each student’s understanding and decide what to teach next?',explanations:[
  'Only a final product or group answer is assessed. That does not reveal what each student can explain or apply independently.',
  'Each student submits something, but the response does not examine the intended learning. Example: an attendance check or “Did you enjoy the activity?” is not a check of understanding.',
  'Each student explains or applies the learning. An accessible response option lets them use speech, writing, or a diagram when that mode is not the skill being assessed.',
  'Intended depth means the selected Articulate, Connect, or Extend target. The individual response checks that thinking, and the plan states what happens next. Reteaching means addressing a gap; extension means offering a further challenge. Example: if a student lists facts without explaining their relationship, model the missing connection and ask for a revised response.'
 ]}
};
rubric.forEach(item=>Object.assign(item,guidance[item.id]));
const data={version:'1.0',rubric,depthHelp}; if(typeof module==='object'&&module.exports)module.exports=data;else root.ACE_RUBRIC=data;
})(globalThis);
