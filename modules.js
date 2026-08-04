/* ============================================================
 * CET-6 Learning Workstation - Module Logic
 * Vocabulary, Speaking, Dialogue, Translation, News, Video, Notebook
 * ============================================================ */
'use strict';

// ========== Vocabulary Module ==========
function initVocabulary() {
  const today = new Date().toDateString();
  if (appState.vocab.sessionDate !== today) {
    appState.vocab.sessionDate = today;
    appState.vocab.currentIndex = 0;
    saveState();
  }
  renderVocabCard();
}

function getVocabQueue() {
  const queue = [], now = Date.now();
  VOCAB_DATA.forEach((w, idx) => {
    const st = appState.vocab.stats[w.word];
    if (!st) queue.push({ word: w, isNew: true, idx });
    else if (st.nextReview && st.nextReview <= now) queue.push({ word: w, isNew: false, idx });
  });
  queue.sort((a,b) => (a.isNew&&!b.isNew) ? -1 : (!a.isNew&&b.isNew) ? 1 : 0);
  return queue;
}

function renderVocabCard() {
  const c = document.getElementById('vocab-content');
  if (!c) return;
  const queue = getVocabQueue();

  if (appState.vocab.currentIndex >= queue.length) {
    c.innerHTML = '<div class="card"><div class="card-title">今日单词已完成</div>' +
      '<p class="text-secondary">当前所有单词已学习完毕，请稍后回来复习。</p>' +
      '<div class="vocab-stats mt-16"><span>已学: <strong>'+Object.keys(appState.vocab.stats).length+'</strong></span>' +
      '<span>总词库: <strong>'+VOCAB_DATA.length+'</strong></span></div>' +
      '<button class="btn btn-small mt-16" id="vocab-restart">重新开始本轮</button></div>';
    const r = document.getElementById('vocab-restart');
    if (r) r.addEventListener('click', () => { appState.vocab.currentIndex = 0; renderVocabCard(); });
    return;
  }

  const item = queue[appState.vocab.currentIndex];
  const w = item.word;
  const st = appState.vocab.stats[w.word] || {};
  const ap = createAudioPlayerHTML(null, true, w.word);

  let html = '<div class="card vocab-card">';
  html += '<div class="vocab-word">'+escapeHtml(w.word)+'</div>';
  html += '<div class="vocab-phonetic">'+escapeHtml(w.phonetic)+'</div>';
  html += '<div class="vocab-pos">'+escapeHtml(w.pos)+'</div>';
  html += '<div class="vocab-meaning">'+escapeHtml(w.meaning)+'</div>';
  html += ap.html;
  html += '<div class="vocab-example"><div class="vocab-example-en">'+escapeHtml(w.example)+'</div>';
  html += '<div class="vocab-example-cn">'+escapeHtml(w.exampleTr)+'</div></div>';
  html += '<div class="vocab-btn-group">';
  html += '<button class="vocab-btn btn-known" data-status="known">认识</button>';
  html += '<button class="vocab-btn btn-fuzzy" data-status="fuzzy">模糊</button>';
  html += '<button class="vocab-btn btn-unknown" data-status="unknown">不认识</button>';
  html += '</div>';
  html += '<div class="vocab-stats">';
  html += '<span>进度: <strong>'+(appState.vocab.currentIndex+1)+'/'+queue.length+'</strong></span>';
  html += '<span>已学: <strong>'+Object.keys(appState.vocab.stats).length+'/'+VOCAB_DATA.length+'</strong></span>';
  if (!item.isNew) html += '<span class="text-tertiary">复习中</span>';
  html += '</div></div>';

  // Error word book
  html += '<div class="card"><div class="card-title">单词错题本</div>';
  const errs = Object.entries(appState.vocab.stats).filter(([k,v]) => v.lastStatus==='unknown'||v.lastStatus==='fuzzy');
  if (errs.length === 0) {
    html += '<p class="text-tertiary" style="font-size:13px;">暂无错词。选择"模糊"或"不认识"的单词会自动加入。</p>';
  } else {
    html += '<div style="font-size:13px;line-height:2;">';
    errs.slice(0, 30).forEach(([word]) => {
      const wd = VOCAB_DATA.find(v=>v.word===word);
      html += '<span style="display:inline-block;margin-right:12px;"><strong>'+word+'</strong>';
      if (wd) html += ' <span class="text-tertiary">'+wd.meaning+'</span>';
      html += '</span>';
    });
    if (errs.length > 30) html += '<span class="text-tertiary">... 共'+errs.length+'个</span>';
    html += '</div>';
  }
  html += '</div>';

  c.innerHTML = html;
  bindAudioPlayer(ap.id, null, true, w.word);
  c.querySelectorAll('.vocab-btn').forEach(btn => btn.addEventListener('click', () => markVocabWord(w.word, btn.dataset.status)));
}

function markVocabWord(word, status) {
  const now = Date.now();
  if (!appState.vocab.stats[word]) appState.vocab.stats[word] = { correctCount:0, wrongCount:0, reviewStage:0 };
  const st = appState.vocab.stats[word];
  st.lastStatus = status; st.lastReview = now;
  if (status === 'known') {
    st.correctCount = (st.correctCount||0)+1;
    st.reviewStage = Math.min((st.reviewStage||0)+1, REVIEW_INTERVALS.length-1);
    st.nextReview = now + (REVIEW_INTERVALS[st.reviewStage]||30)*86400000;
  } else {
    st.wrongCount = (st.wrongCount||0)+1;
    st.reviewStage = 0;
    st.nextReview = now + 300000;
    autoCollectNote('vocabulary', '拼写易错词: **'+word+'**\n\n' + (VOCAB_DATA.find(v=>v.word===word)||{}).meaning);
  }
  appState.vocab.currentIndex++;
  saveState();
  renderVocabCard();
}

// ========== Speaking Module ==========
function initSpeaking() { renderSpeakingContent(); }

function renderSpeakingContent() {
  const c = document.getElementById('speaking-content');
  if (!c) return;
  let html = '<div class="card"><div class="card-title">选择练习部分</div><div class="speaking-topic-select">';
  Object.keys(SPEAKING_DATA).forEach(key => {
    const p = SPEAKING_DATA[key];
    html += '<div class="topic-option'+(appState.speaking.currentPart===key?' active':'')+'" data-part="'+key+'"><strong>'+p.title+'</strong><br><span class="text-tertiary" style="font-size:12px;">'+p.description+'</span></div>';
  });
  html += '</div></div>';
  const part = SPEAKING_DATA[appState.speaking.currentPart];
  if (part) {
    html += '<div class="card"><div class="card-title">选择题目</div><div class="speaking-topic-select">';
    part.topics.forEach((t, i) => {
      html += '<div class="topic-option" data-topic="'+t.id+'"><strong>题目 '+(i+1)+'</strong><br><span class="text-secondary" style="font-size:13px;">'+escapeHtml(t.prompt)+'</span></div>';
    });
    html += '</div></div>';
  }
  html += '<div id="speaking-detail"></div>';
  html += '<div class="card"><div class="card-title">录音记录</div><div id="recording-list-container">加载中...</div></div>';
  c.innerHTML = html;
  c.querySelectorAll('[data-part]').forEach(el => el.addEventListener('click', () => { appState.speaking.currentPart = el.dataset.part; renderSpeakingContent(); }));
  c.querySelectorAll('[data-topic]').forEach(el => el.addEventListener('click', () => { appState.speaking.currentTopicId = el.dataset.topic; renderSpeakingDetail(); }));
  loadRecordingList('speaking');
}

function renderSpeakingDetail() {
  const c = document.getElementById('speaking-detail');
  if (!c) return;
  const part = SPEAKING_DATA[appState.speaking.currentPart];
  if (!part) return;
  const topic = part.topics.find(t => t.id === appState.speaking.currentTopicId);
  if (!topic) return;

  let html = '<div class="card"><div class="card-title">'+part.title+'</div>';
  html += '<div class="speaking-prompt">'+escapeHtml(topic.prompt)+'</div>';
  if (topic.passage) {
    html += '<div class="speaking-prompt">'+escapeHtml(topic.passage)+'</div>';
    const ap = createAudioPlayerHTML(null, true, topic.passage);
    html += ap.html;
  }
  if (topic.sampleAnswer) {
    html += '<div class="card-title mt-16">参考范例</div>';
    html += '<div class="speaking-prompt">'+escapeHtml(topic.sampleAnswer)+'</div>';
    const ap2 = createAudioPlayerHTML(null, true, topic.sampleAnswer);
    html += ap2.html;
  }
  html += '<div class="recording-controls">';
  html += '<button class="record-btn" id="spk-rec"><div class="record-dot"></div><span class="record-label">开始录音</span></button>';
  html += '<span class="recording-time" id="spk-rec-time">00:00</span></div>';
  html += '<div class="feedback-toast" id="spk-fb"></div>';
  html += '<div class="card-title mt-16">六级口语评分标准</div>';
  html += '<div style="font-size:13px;line-height:1.8;">';
  html += '<div><strong>准确性</strong> - 语音、语调、语法</div>';
  html += '<div><strong>流利度</strong> - 表达流畅度与停顿</div>';
  html += '<div><strong>词汇语法</strong> - 词汇量与语法多样性</div>';
  html += '<div><strong>语音语调</strong> - 发音清晰度与语调变化</div>';
  html += '<div><strong>互动交际</strong> - 回答切题与逻辑连贯</div>';
  html += '</div></div>';

  c.innerHTML = html;
  const players = c.querySelectorAll('.audio-player');
  let pi = 0;
  if (topic.passage && players[pi]) { bindAudioPlayer(players[pi].id, null, true, topic.passage); pi++; }
  if (topic.sampleAnswer && players[pi]) { bindAudioPlayer(players[pi].id, null, true, topic.sampleAnswer); }
  document.getElementById('spk-rec').addEventListener('click', () => toggleSpeakingRecording(topic));
}

async function toggleSpeakingRecording(topic) {
  const btn = document.getElementById('spk-rec');
  const timeEl = document.getElementById('spk-rec-time');
  if (!btn) return;
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    const result = await stopMediaRecording();
    btn.classList.remove('recording');
    btn.querySelector('.record-label').textContent = '开始录音';
    if (recordingTimer) { clearInterval(recordingTimer); recordingTimer = null; }
    if (result) {
      const part = SPEAKING_DATA[appState.speaking.currentPart];
      await saveRecording(result.blob, result.mimeType, { module:'speaking', topic:topic.id, label:part.title });
      showFeedback('spk-fb', '录音已保存。');
      loadRecordingList('speaking');
    }
    return;
  }
  try {
    const mimeType = await startMediaRecording();
    mediaRecorder.onstop = async () => {};
    btn.classList.add('recording');
    btn.querySelector('.record-label').textContent = '停止录音';
    recordingStartTime = Date.now();
    recordingTimer = setInterval(() => {
      const e = Math.floor((Date.now()-recordingStartTime)/1000);
      if (timeEl) timeEl.textContent = String(Math.floor(e/60)).padStart(2,'0')+':'+String(e%60).padStart(2,'0');
    }, 1000);
  } catch(e) { showFeedback('spk-fb', '无法访问麦克风，请检查浏览器权限设置。'); }
}

async function loadRecordingList(moduleFilter) {
  const c = document.getElementById('recording-list-container');
  if (!c) return;
  try {
    const all = await getAllRecordings();
    const filtered = moduleFilter ? all.filter(r => r.module === moduleFilter) : all;
    if (filtered.length === 0) { c.innerHTML = '<p class="text-tertiary" style="font-size:13px;">暂无录音记录。</p>'; return; }
    let html = '';
    filtered.slice(0, 30).forEach(rec => {
      const url = URL.createObjectURL(rec.blob);
      const d = new Date(rec.date);
      const ds = (d.getMonth()+1)+'/'+d.getDate()+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
      html += '<div class="recording-item"><span class="recording-date">'+ds+'</span>';
      html += '<div class="recording-audio"><audio controls src="'+url+'"></audio></div>';
      html += '<button class="note-delete" data-rid="'+rec.id+'">删除</button></div>';
    });
    c.innerHTML = html;
    c.querySelectorAll('[data-rid]').forEach(b => b.addEventListener('click', async () => { await deleteRecording(parseInt(b.dataset.rid)); loadRecordingList(moduleFilter); }));
  } catch(e) { c.innerHTML = '<p class="text-tertiary" style="font-size:13px;">录音加载失败。</p>'; }
}

// ========== Dialogue Module ==========
const DIALOGUE_SCRIPTS = {
  'dp-1': { title:'AI与人类就业', rounds: [
    { ai:"Thank you for choosing this topic. To begin our discussion, in your opinion, which specific industries or types of jobs do you think are most vulnerable to being replaced by artificial intelligence?" },
    { branches:[
      { keywords:['manufactur','factory','robot','automat'], ai:"You mentioned manufacturing and automation. Indeed, factory work has been significantly transformed. But what about creative fields such as writing, art, or design? Do you think AI poses a genuine threat to creative professionals as well?" },
      { keywords:['creative','art','design','write','music'], ai:"That is a thoughtful observation about creative work. Some argue that while AI can generate content, it lacks genuine creativity and emotional depth. What is your take on this distinction?" },
      { keywords:['data','analy','account','financ'], ai:"Data and analytical work is indeed heavily impacted. Should workers in these fields view AI as a threat, or as a tool that enhances their capabilities?" },
      { default:true, ai:"That is an interesting perspective. Some argue that rather than replacing humans, AI will augment human capabilities and create new types of jobs. How would you respond to this argument?" }
    ]},
    { branches:[
      { keywords:['yes','agree','threat','replace','worried'], ai:"You seem to view AI as a significant threat. If governments and companies invested heavily in retraining programs, what specific skills would be most valuable?" },
      { keywords:['no','disagree','tool','enhance','augment','help'], ai:"You view AI more as a tool than a threat. However, there will inevitably be disruptions. How should society prepare for this transition?" },
      { keywords:['retrain','learn','skill','adapt','education'], ai:"You touched on retraining. What role should universities play in preparing students for an AI-driven workplace?" },
      { default:true, ai:"Do you think there are certain qualities or skills that AI will never be able to replicate, no matter how advanced it becomes?" }
    ]},
    { branches:[
      { keywords:['emotion','empathy','creative','human','consciousness'], ai:"You highlighted uniquely human qualities. How could these be leveraged in an AI-dominated workplace?" },
      { keywords:['adapt','learn','flexib','critical','think'], ai:"Adaptability and critical thinking are crucial. What advice would you give a student preparing for a career in the age of AI?" },
      { default:true, ai:"How do you personally feel about working alongside AI in your future career? Are you excited, concerned, or both?" }
    ]},
    { ai:"Thank you for this engaging discussion. As a final question: in one or two sentences, what is your overall stance on the relationship between AI and human employment?", isClosing:true }
  ]},
  'dp-2': { title:'社交媒体与人际关系', rounds: [
    { ai:"Let us discuss social media and interpersonal relationships. In your experience, do you think social media has brought people closer together or pushed them further apart?" },
    { branches:[
      { keywords:['connect','close','friend','communicat'], ai:"You mentioned connectivity. However, some argue online interactions lack the depth of face-to-face communication. Do you agree?" },
      { keywords:['isolat','lonely','distance','apart','superficial'], ai:"You raised the issue of isolation. Is the problem with social media itself, or with how people use it?" },
      { default:true, ai:"How do you think social media affects young people's ability to form and maintain friendships compared to previous generations?" }
    ]},
    { branches:[
      { keywords:['authentic','genuine','real','fake','superficial'], ai:"You touched on authenticity. Do people present different versions of themselves online? What are the consequences?" },
      { keywords:['privacy','security','personal','data'], ai:"Privacy is indeed a concern. How can we balance connectivity with protecting personal information?" },
      { keywords:['communicat','skill','face','talk'], ai:"You raised communication skills. Is excessive social media use affecting young people's ability to communicate in person?" },
      { default:true, ai:"Research links heavy social media use with increased anxiety among teenagers. What contributes to this?" }
    ]},
    { branches:[
      { keywords:['compare','jealous','envy','self-esteem','image'], ai:"You mentioned comparison and self-image. How could social media platforms be redesigned to reduce these effects?" },
      { keywords:['balance','limit','control','moderat'], ai:"You suggest balance is key. Can individuals manage this alone, or are systemic solutions needed?" },
      { default:true, ai:"If you could give one piece of advice to someone overwhelmed by social media, what would it be?" }
    ]},
    { ai:"Thank you for sharing your perspectives. As a final question: in one or two sentences, what is your overall view on whether social media has had a net positive or negative effect on relationships?", isClosing:true }
  ]},
  'dp-3': { title:'在线教育与传统课堂', rounds: [
    { ai:"Let us talk about online education. With the increasing popularity of online learning, do you think traditional classrooms will eventually disappear?" },
    { branches:[
      { keywords:['no','never','not','still','important'], ai:"You believe traditional classrooms will persist. What aspects of in-person learning cannot be replicated online?" },
      { keywords:['yes','replace','disappear','future'], ai:"You think online education could replace traditional classrooms. What advantages make it so powerful?" },
      { keywords:['flexib','convenience','schedule','time'], ai:"Flexibility is a major advantage. But flexibility may come at the cost of engagement. How would you address this?" },
      { default:true, ai:"Do you think a blended approach combining online and in-person learning might be ideal?" }
    ]},
    { branches:[
      { keywords:['social','interact','friend','peer','collaborat'], ai:"You highlighted social interaction. How could online education better facilitate peer interaction?" },
      { keywords:['engagement','focus','distract','motivat','discipline'], ai:"Engagement is a challenge in online learning. What strategies could help students stay motivated?" },
      { keywords:['teacher','instructor','guidance','mentor'], ai:"The role of the teacher is important. How do you see this role changing in a digital environment?" },
      { default:true, ai:"Can the quality of online education ever match traditional education, or will there always be a gap?" }
    ]},
    { branches:[
      { keywords:['equal','access','gap','digital','divide','rural'], ai:"You raised educational inequality. How can we bridge the digital divide?" },
      { keywords:['skill','technical','technology','device'], ai:"Technical access is fundamental. Should governments invest more in technology for education?" },
      { default:true, ai:"If you were designing the ideal education system, how would you balance online and traditional learning?" }
    ]},
    { ai:"Thank you for this thoughtful discussion. To conclude: in one or two sentences, what is your overall opinion on the future of education?", isClosing:true }
  ]},
  'dp-4': { title:'年轻人的焦虑与压力', rounds: [
    { ai:"Let us discuss anxiety and stress among young people. What do you think are the main causes of increasing anxiety in young adults today?" },
    { branches:[
      { keywords:['academic','exam','study','grade','school','parent'], ai:"You mentioned academic pressure. Does the education system need to change, or is it about societal expectations?" },
      { keywords:['social','media','comparison','instagram','image'], ai:"You pointed to social media. How does it specifically contribute to anxiety, and what can be done?" },
      { keywords:['job','employ','future','career','uncertain'], ai:"Concerns about employment are significant. Is this anxiety justified given the economic situation?" },
      { default:true, ai:"Do young people today face more pressure than previous generations, or is it just more visible?" }
    ]},
    { branches:[
      { keywords:['mental','health','aware','support','counseling'], ai:"You mentioned mental health awareness. Are universities doing enough to support students?" },
      { keywords:['communicat','talk','share','family','friend'], ai:"Communication is vital. Why do many young people find it difficult to talk about their stress?" },
      { keywords:['balance','lifestyle','exercise','sleep','hobby'], ai:"You emphasized balance. What habits are most effective for managing stress?" },
      { default:true, ai:"Where is the line between healthy pressure and harmful anxiety?" }
    ]},
    { branches:[
      { keywords:['support','system','family','friend','community'], ai:"Building a support system is crucial. How can isolated young people build connections?" },
      { keywords:['society','culture','expectation','change'], ai:"You suggest societal changes are needed. What specific changes would you advocate for?" },
      { default:true, ai:"If you could speak to a young person feeling overwhelmed by anxiety right now, what would you say?" }
    ]},
    { ai:"Thank you for this meaningful discussion. As a final question: what do you believe is the single most important step to address youth anxiety?", isClosing:true }
  ]},
  'dp-5': { title:'全球化与本土文化', rounds: [
    { ai:"Let us discuss globalization and local culture. Some argue globalization threatens local cultures. Do you agree or disagree?" },
    { branches:[
      { keywords:['agree','threat','lose','disappear','homogeniz'], ai:"You agree that globalization threatens local cultures. Can you give a specific example?" },
      { keywords:['disagree','not','enrich','exchange','diversity','benefit'], ai:"You see globalization as enriching. What positive effects of cultural exchange do you find most significant?" },
      { keywords:['both','mixed','complex','double'], ai:"You see both sides. How can a society enjoy globalization's benefits while preserving its cultural identity?" },
      { default:true, ai:"Does globalization lead to cultural homogenization, or does it create new forms of diversity?" }
    ]},
    { branches:[
      { keywords:['language','english','chinese','mother','tongue'], ai:"You mentioned language. Does the dominance of English threaten local languages, or can they coexist?" },
      { keywords:['food','festival','custom','tradition','dress'], ai:"You highlighted cultural practices. How can younger generations be encouraged to maintain these traditions?" },
      { keywords:['media','film','music','internet','western'], ai:"Global media is powerful. Can local cultural products compete, or is it unfair?" },
      { default:true, ai:"Some countries have cultural protection policies. Are these effective or overly protectionist?" }
    ]},
    { branches:[
      { keywords:['education','school','teach','learn','young'], ai:"You emphasized education. How should schools balance global competencies with local cultural knowledge?" },
      { keywords:['identity','pride','belong','community'], ai:"Cultural identity is essential. How can individuals maintain identity while being open to global influences?" },
      { keywords:['government','policy','support','invest'], ai:"Government support matters. What specific policies would be most effective?" },
      { default:true, ai:"Given the unstoppable nature of globalization, is it realistic to preserve local cultures, or must they evolve?" }
    ]},
    { ai:"Thank you for this rich discussion. To conclude: is globalization primarily a threat, an opportunity, or both for local culture?", isClosing:true }
  ]},
  'dp-6': { title:'实用技能与理论知识', rounds: [
    { ai:"Let us discuss the balance between practical skills and theoretical knowledge. Should universities prioritize practical skills training or theoretical knowledge?" },
    { branches:[
      { keywords:['practical','skill','employ','career','job','hands'], ai:"You lean towards practical skills. But without theoretical foundations, practical skills become obsolete. How would you respond?" },
      { keywords:['theory','theoretical','knowledge','foundat','think'], ai:"You value theoretical knowledge. How would you address the criticism that graduates lack practical readiness?" },
      { keywords:['both','balance','combine','integrate'], ai:"You advocate for balance. How should universities integrate practical and theoretical elements?" },
      { default:true, ai:"Do different fields require different balances of theory and practice, or should there be a universal approach?" }
    ]},
    { branches:[
      { keywords:['internship','work','experience','industry','company'], ai:"You mentioned internships. Should all programs require internships, even theoretical fields?" },
      { keywords:['critical','think','analyz','problem','solve'], ai:"Critical thinking is essential. Is it naturally developed through theory, or must it be explicitly taught?" },
      { keywords:['curriculum','course','design','reform'], ai:"You touched on curriculum design. What changes would you recommend?" },
      { default:true, ai:"Employers complain graduates lack workplace skills. Is this the responsibility of universities or employers?" }
    ]},
    { branches:[
      { keywords:['lifelong','learn','adapt','change','future'], ai:"You emphasized lifelong learning. How can universities prepare students for continuous learning?" },
      { keywords:['research','academ','innovat','discover'], ai:"You value research. How can universities balance research with teaching?" },
      { default:true, ai:"If you could redesign the university curriculum, what would the ideal balance look like?" }
    ]},
    { ai:"Thank you for this engaging discussion. To wrap up: in one or two sentences, what is your philosophy on how universities should prepare students?", isClosing:true }
  ]}
};

function initDialogue() { renderDialogueContent(); }

function renderDialogueContent() {
  const c = document.getElementById('dialogue-content');
  if (!c) return;
  let html = '<div class="card"><div class="card-title">选择讨论话题</div><div class="speaking-topic-select">';
  SPEAKING_DATA.part3_discussion.topics.forEach(t => {
    const sc = DIALOGUE_SCRIPTS[t.id];
    html += '<div class="topic-option" data-topic="'+t.id+'"><strong>'+(sc?sc.title:t.id)+'</strong><br><span class="text-tertiary" style="font-size:12px;">'+escapeHtml(t.prompt)+'</span></div>';
  });
  html += '</div></div><div id="dialogue-session"></div>';
  c.innerHTML = html;
  c.querySelectorAll('[data-topic]').forEach(el => el.addEventListener('click', () => startDialogue(el.dataset.topic)));
}

function startDialogue(topicId) {
  const sc = DIALOGUE_SCRIPTS[topicId];
  if (!sc) return;
  const topic = SPEAKING_DATA.part3_discussion.topics.find(t => t.id === topicId);
  appState.dialogue = { active:true, topicId, round:0, messages:[], userResponses:[], userErrors:[] };

  const c = document.getElementById('dialogue-session');
  if (!c) return;
  c.innerHTML = '<div class="card"><div class="card-title">'+escapeHtml(sc.title)+'</div><div class="speaking-prompt">'+escapeHtml(topic.prompt)+'</div></div>' +
    '<div class="dialogue-container" id="dl-msgs"></div>' +
    '<div id="dl-input"></div>' +
    '<div class="feedback-toast" id="dl-fb"></div>' +
    '<div id="dl-result"></div>' +
    '<div class="mt-16" style="display:flex;gap:8px;">' +
    '<button class="btn btn-ghost btn-small" id="dl-end">结束对话</button>' +
    '<button class="btn btn-ghost btn-small" id="dl-back">返回选话题</button></div>';

  setTimeout(() => addAIMessage(sc.rounds[0].ai), 300);
  document.getElementById('dl-end').addEventListener('click', endDialogue);
  document.getElementById('dl-back').addEventListener('click', () => { stopDialogueRecognition(); renderDialogueContent(); });
}

function addAIMessage(text) {
  appState.dialogue.messages.push({ speaker:'ai', text, date:new Date().toISOString() });
  renderDialogueMessages();
  renderDialogueInput();
}

function renderDialogueMessages() {
  const c = document.getElementById('dl-msgs');
  if (!c) return;
  let html = '';
  appState.dialogue.messages.forEach(msg => {
    const isAI = msg.speaker === 'ai';
    html += '<div class="dialogue-message '+(isAI?'ai':'user')+'"><span class="speaker">'+(isAI?'AI:':'You:')+'</span>'+escapeHtml(msg.text);
    if (isAI) {
      const ap = createAudioPlayerHTML(null, true, msg.text);
      html += '<div class="audio-replay mt-8">'+ap.html+'</div>';
    }
    html += '</div>';
  });
  c.innerHTML = html;
  c.scrollTop = c.scrollHeight;
  let aiIdx = 0;
  const players = c.querySelectorAll('.audio-player');
  appState.dialogue.messages.forEach(msg => {
    if (msg.speaker === 'ai' && players[aiIdx]) { bindAudioPlayer(players[aiIdx].id, null, true, msg.text); aiIdx++; }
  });
}

function renderDialogueInput() {
  const c = document.getElementById('dl-input');
  if (!c) return;
  const hasSR = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  let html = '<div class="card"><div class="card-title">你的回答</div>';
  if (hasSR) {
    html += '<p class="text-tertiary" style="font-size:12px;margin-bottom:8px;">点击"开始说话"后用英语回答，系统将自动识别语音。也可直接在下方打字。</p>';
    html += '<div class="recording-controls"><button class="record-btn" id="dl-speak"><div class="record-dot"></div><span class="record-label">开始说话</span></button><span class="recording-time" id="dl-speak-status"></span></div>';
  } else {
    html += '<p class="text-tertiary" style="font-size:12px;margin-bottom:8px;">在下方输入框中用英语回答。建议同时录音以便后续回听。</p>';
  }
  html += '<textarea class="translation-input" id="dl-text" placeholder="Type your response in English..." style="min-height:80px;margin-bottom:12px;"></textarea>';
  html += '<div class="recording-controls"><button class="record-btn" id="dl-rec"><div class="record-dot"></div><span class="record-label">录音(供回听)</span></button><span class="recording-time" id="dl-rec-time">00:00</span></div>';
  html += '<div class="mt-8"><button class="btn btn-primary btn-small" id="dl-submit">提交回答</button></div></div>';
  c.innerHTML = html;
  if (hasSR) document.getElementById('dl-speak').addEventListener('click', toggleDialogueSR);
  document.getElementById('dl-rec').addEventListener('click', toggleDialogueRec);
  document.getElementById('dl-submit').addEventListener('click', submitDialogueResponse);
}

function toggleDialogueSR() {
  const btn = document.getElementById('dl-speak');
  const status = document.getElementById('dl-speak-status');
  const text = document.getElementById('dl-text');
  if (!btn) return;
  if (dialogueRecognitionActive) {
    if (dialogueRecognition) dialogueRecognition.stop();
    dialogueRecognitionActive = false;
    btn.classList.remove('recording');
    btn.querySelector('.record-label').textContent = '开始说话';
    if (status) status.textContent = '';
    return;
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  dialogueRecognition = new SR();
  dialogueRecognition.lang = 'en-US'; dialogueRecognition.continuous = true; dialogueRecognition.interimResults = true;
  let finalText = text.value || '';
  dialogueRecognition.onresult = (e) => {
    let interim = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) finalText += e.results[i][0].transcript + ' ';
      else interim += e.results[i][0].transcript;
    }
    text.value = finalText + interim;
  };
  dialogueRecognition.onerror = (e) => { if (status) status.textContent = '识别出错'; dialogueRecognitionActive = false; btn.classList.remove('recording'); btn.querySelector('.record-label').textContent = '开始说话'; };
  dialogueRecognition.onend = () => { dialogueRecognitionActive = false; btn.classList.remove('recording'); btn.querySelector('.record-label').textContent = '开始说话'; };
  dialogueRecognition.start();
  dialogueRecognitionActive = true;
  btn.classList.add('recording');
  btn.querySelector('.record-label').textContent = '停止说话';
  if (status) status.textContent = '正在识别...';
}

function stopDialogueRecognition() {
  if (dialogueRecognition) { try { dialogueRecognition.stop(); } catch(e){} dialogueRecognition = null; }
  dialogueRecognitionActive = false;
}

async function toggleDialogueRec() {
  const btn = document.getElementById('dl-rec');
  const timeEl = document.getElementById('dl-rec-time');
  if (!btn) return;
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    const result = await stopMediaRecording();
    btn.classList.remove('recording');
    btn.querySelector('.record-label').textContent = '录音(供回听)';
    if (recordingTimer) { clearInterval(recordingTimer); recordingTimer = null; }
    if (result) {
      const sc = DIALOGUE_SCRIPTS[appState.dialogue.topicId];
      await saveRecording(result.blob, result.mimeType, { module:'dialogue', topic:appState.dialogue.topicId, label:sc?sc.title+' R'+(appState.dialogue.round+1):'Dialogue' });
    }
    return;
  }
  try {
    await startMediaRecording();
    btn.classList.add('recording');
    btn.querySelector('.record-label').textContent = '停止录音';
    recordingStartTime = Date.now();
    recordingTimer = setInterval(() => {
      const e = Math.floor((Date.now()-recordingStartTime)/1000);
      if (timeEl) timeEl.textContent = String(Math.floor(e/60)).padStart(2,'0')+':'+String(e%60).padStart(2,'0');
    }, 1000);
  } catch(e) { showFeedback('dl-fb', '无法访问麦克风。'); }
}

function submitDialogueResponse() {
  const text = document.getElementById('dl-text');
  if (!text || !text.value.trim()) { showFeedback('dl-fb', '请输入你的回答。'); return; }
  const userText = text.value.trim();
  stopDialogueRecognition();
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    (async () => { const r = await stopMediaRecording(); if (r) { const sc = DIALOGUE_SCRIPTS[appState.dialogue.topicId]; await saveRecording(r.blob, r.mimeType, { module:'dialogue', topic:appState.dialogue.topicId, label:sc?sc.title+' R'+(appState.dialogue.round+1):'Dialogue' }); } })();
    const btn = document.getElementById('dl-rec');
    if (btn) { btn.classList.remove('recording'); btn.querySelector('.record-label').textContent = '录音(供回听)'; }
    if (recordingTimer) { clearInterval(recordingTimer); recordingTimer = null; }
  }
  appState.dialogue.messages.push({ speaker:'user', text:userText, date:new Date().toISOString() });
  appState.dialogue.userResponses.push(userText);
  appState.dialogue.round++;
  const errs = checkSpeakingErrors(userText);
  appState.dialogue.userErrors.push(...errs);
  renderDialogueMessages();
  text.value = '';
  const sc = DIALOGUE_SCRIPTS[appState.dialogue.topicId];
  if (!sc) return;
  if (appState.dialogue.round >= sc.rounds.length) {
    setTimeout(() => endDialogue(), 500);
  } else {
    const rd = sc.rounds[appState.dialogue.round];
    let aiResp = rd.ai;
    if (rd.branches) {
      const lr = userText.toLowerCase();
      let matched = false;
      for (const b of rd.branches) {
        if (b.default) continue;
        if (b.keywords.some(k => lr.includes(k))) { aiResp = b.ai; matched = true; break; }
      }
      if (!matched) { const db = rd.branches.find(b => b.default); if (db) aiResp = db.ai; }
    }
    setTimeout(() => addAIMessage(aiResp), 500);
  }
}

function endDialogue() {
  stopDialogueRecognition();
  if (mediaRecorder && mediaRecorder.state === 'recording') stopMediaRecording();
  appState.dialogue.active = false;
  renderDialogueFeedback();
}

function renderDialogueFeedback() {
  const c = document.getElementById('dl-result');
  if (!c) return;
  const resp = appState.dialogue.userResponses, errs = appState.dialogue.userErrors;
  if (resp.length === 0) { c.innerHTML = '<div class="card"><p class="text-tertiary">对话尚未开始。</p></div>'; return; }
  const totalWords = resp.join(' ').split(/\s+/).length;
  const avg = Math.round(totalWords / resp.length);
  const unique = new Set(resp.join(' ').toLowerCase().match(/\b[a-z']+\b/g) || []).size;
  const diversity = totalWords > 0 ? (unique/totalWords*100).toFixed(1) : 0;
  let fluency = avg>=50?90:avg>=30?80:avg>=15?70:60;
  const errRate = totalWords>0 ? errs.length/totalWords*100 : 0;
  let accuracy = Math.max(40, Math.min(100 - errRate*10, 100));
  let vocab = parseFloat(diversity)>=60?90:parseFloat(diversity)>=45?80:parseFloat(diversity)>=30?70:60;
  const topic = SPEAKING_DATA.part3_discussion.topics.find(t => t.id === appState.dialogue.topicId);
  const allText = resp.join(' ').toLowerCase();
  let kwHits = 0;
  if (topic && topic.keywords) kwHits = topic.keywords.filter(k => allText.includes(k.toLowerCase())).length;
  let interaction = Math.min(60 + kwHits*8, 100);
  const pron = 75;
  const overall = Math.round((fluency+accuracy+vocab+interaction+pron)/5);

  let html = '<div class="card"><div class="card-title">对话反馈与评分</div>';
  html += '<div class="score-display"><div class="score-number">'+overall+'</div><div class="score-comment">/ 100 - 六级口语综合评分</div></div>';
  html += '<div style="font-size:13px;line-height:2;">';
  html += scoreRow('准确性 (Accuracy)', accuracy);
  html += scoreRow('流利度 (Fluency)', fluency);
  html += scoreRow('词汇语法 (Vocabulary)', vocab);
  html += scoreRow('语音语调 (Pronunciation)', pron);
  html += scoreRow('互动交际 (Interaction)', interaction);
  html += '</div>';
  html += '<div class="mt-16"><strong>统计数据</strong></div><div style="font-size:13px;line-height:1.8;">';
  html += '<div>对话轮数: '+resp.length+'</div><div>总词数: '+totalWords+'</div>';
  html += '<div>平均每轮词数: '+avg+'</div><div>词汇多样性: '+diversity+'%</div>';
  html += '<div>话题关键词使用: '+kwHits+'/'+(topic&&topic.keywords?topic.keywords.length:0)+'</div></div>';
  if (errs.length > 0) {
    html += '<div class="mt-16"><strong>语法错误与表达问题</strong></div><div class="error-list">';
    errs.slice(0, 15).forEach(e => {
      html += '<div class="error-item"><span class="error-type '+e.type+'">'+e.category+'</span>'+escapeHtml(e.explanation)+'</div>';
    });
    html += '</div>';
  }
  html += '</div>';
  // Full record
  html += '<div class="card"><div class="card-title">完整对话记录</div><div class="dialogue-container">';
  appState.dialogue.messages.forEach(m => {
    html += '<div class="dialogue-message '+(m.speaker==='ai'?'ai':'user')+'"><span class="speaker">'+(m.speaker==='ai'?'AI:':'You:')+'</span>'+escapeHtml(m.text)+'</div>';
  });
  html += '</div><p class="text-tertiary mt-8" style="font-size:12px;">你的每轮回答均已录音保存，可在"口语练习"的录音记录中回听。</p></div>';
  c.innerHTML = html;
  errs.forEach(e => autoCollectNote('speaking', '**错误类型:** '+e.category+'\n\n**问题:** '+e.original+'\n\n**修改建议:** '+e.correction+'\n\n**说明:** '+e.explanation));
  showFeedback('dl-fb', '对话完成，评分和错误已保存到笔记本。');
}

function scoreRow(label, score) {
  return '<div style="display:flex;align-items:center;gap:8px;"><span style="width:180px;font-size:13px;">'+label+'</span><div style="flex:1;background:#f0f0f0;height:8px;border-radius:4px;overflow:hidden;"><div style="width:'+score+'%;background:#111;height:100%;"></div></div><span style="font-size:13px;font-weight:600;width:40px;text-align:right;">'+Math.round(score)+'</span></div>';
}

function checkSpeakingErrors(text) {
  const errors = [];
  if (/(?:^|[.!?]\s+)([a-z])/.test(text)) errors.push({ type:'hard', category:'大小写', original:text.substring(0,30), correction:'Capitalize', explanation:'句子首字母应大写。' });
  if (/\bi\s+are\b/i.test(text)) errors.push({ type:'hard', category:'主谓一致', original:'I are', correction:'I am', explanation:'主语"I"应搭配"am"。' });
  if (/\b(he|she|it)\s+are\b/i.test(text)) errors.push({ type:'hard', category:'主谓一致', original:'he/she/it are', correction:'is', explanation:'第三人称单数应搭配"is"。' });
  if (/\b(they|we)\s+is\b/i.test(text)) errors.push({ type:'hard', category:'主谓一致', original:'they/we is', correction:'are', explanation:'复数主语应搭配"are"。' });
  const m = text.match(/\ba\s+(apple|orange|hour|important|easy|interesting|effective|english|exam)\b/i);
  if (m) errors.push({ type:'hard', category:'冠词', original:'a '+m[1], correction:'an '+m[1], explanation:'元音音素前应使用"an"。' });
  const vc = (text.match(/\bvery\b/gi)||[]).length;
  if (vc >= 3) errors.push({ type:'polish', category:'用词', original:'very(x'+vc+')', correction:'extremely, remarkably', explanation:'"very"使用过于频繁，建议丰富表达。' });
  const gc = (text.match(/\bgood\b/gi)||[]).length;
  if (gc >= 3) errors.push({ type:'polish', category:'用词', original:'good(x'+gc+')', correction:'excellent, beneficial', explanation:'"good"使用过于频繁，建议精确用词。' });
  const itc = (text.match(/\bi\s+think\b/gi)||[]).length;
  if (itc >= 2) errors.push({ type:'polish', category:'表达', original:'I think(x'+itc+')', correction:'I believe, in my view', explanation:'"I think"过于频繁，建议变换表达。' });
  if (text.trim().split(/\s+/).length < 10) errors.push({ type:'polish', category:'流利度', original:text.substring(0,30), correction:'elaborate', explanation:'回答过短，建议补充细节和例子。' });
  text.split(/[.!?]+/).forEach(s => { if (s.trim().split(/\s+/).length > 35) errors.push({ type:'polish', category:'句子结构', original:s.trim().substring(0,30)+'...', correction:'split', explanation:'句子过长，建议拆分。' }); });
  return errors;
}

// ========== Translation Module ==========
function initTranslation() { renderTranslationContent(); }

function renderTranslationContent() {
  const c = document.getElementById('translation-content');
  if (!c) return;
  let html = '<div class="card"><div class="card-title">选择翻译练习</div><div class="speaking-topic-select">';
  TRANSLATION_DATA.forEach((ex, i) => {
    html += '<div class="topic-option" data-idx="'+i+'"><strong>'+escapeHtml(ex.title)+'</strong> <span class="text-tertiary" style="font-size:12px;">('+ex.year+')</span></div>';
  });
  html += '</div></div><div id="trans-detail"></div>';
  c.innerHTML = html;
  c.querySelectorAll('[data-idx]').forEach(el => el.addEventListener('click', () => { appState.translation.currentIndex = parseInt(el.dataset.idx); renderTranslationDetail(); }));
  renderTranslationDetail();
}

function renderTranslationDetail() {
  const c = document.getElementById('trans-detail');
  if (!c) return;
  const ex = TRANSLATION_DATA[appState.translation.currentIndex];
  if (!ex) return;
  c.innerHTML = '<div class="card"><div class="card-title">'+escapeHtml(ex.title)+' <span class="text-tertiary" style="font-size:12px;font-weight:400;">('+ex.year+')</span></div>' +
    '<div class="module-desc mb-16">请将以下中文段落翻译为英文</div>' +
    '<div class="translation-source">'+escapeHtml(ex.passage)+'</div>' +
    '<textarea class="translation-input" id="tr-input" placeholder="在此输入你的英文翻译..."></textarea>' +
    '<div class="mt-8" style="display:flex;gap:8px;">' +
    '<button class="btn btn-primary btn-small" id="tr-submit">提交批改</button>' +
    '<button class="btn btn-ghost btn-small" id="tr-clear">清空</button></div>' +
    '<div class="feedback-toast" id="tr-fb"></div></div><div id="tr-result"></div>';
  document.getElementById('tr-submit').addEventListener('click', () => submitTranslation(ex));
  document.getElementById('tr-clear').addEventListener('click', () => { document.getElementById('tr-input').value=''; document.getElementById('tr-result').innerHTML=''; });
}

function submitTranslation(exercise) {
  const input = document.getElementById('tr-input');
  if (!input || !input.value.trim()) { showFeedback('tr-fb', '请先输入你的翻译。'); return; }
  const userText = input.value.trim();
  const result = correctTranslation(userText, exercise);
  renderTranslationResult(userText, exercise, result);
}

function correctTranslation(userText, exercise) {
  const ref = exercise.reference, kp = exercise.keyPoints;
  const errors = []; let correctKP = 0;
  const userSents = userText.split(/[.!?]+/).map(s=>s.trim()).filter(s=>s.length>0);
  const refSents = ref.split(/[.!?]+/).map(s=>s.trim()).filter(s=>s.length>0);

  kp.forEach(p => {
    const parts = p.split(' -> ');
    if (parts.length < 2) return;
    const cn = parts[0].trim(), en = parts[1].trim().toLowerCase();
    const enWords = (en.match(/\b[a-z']+\b/g)||[]).filter(w => w.length>3 && !COMMON_WORDS.has(w));
    if (!enWords.length) return;
    const matched = enWords.filter(w => userText.toLowerCase().includes(w));
    const ratio = matched.length / enWords.length;
    if (ratio === 0) errors.push({ type:'hard', category:'漏译', original:'('+cn+')', correction:parts[1].trim(), explanation:'漏译了关键表达："'+cn+'"，参考译法 "'+parts[1].trim()+'"' });
    else if (ratio < 0.5) errors.push({ type:'polish', category:'翻译不完整', original:'('+cn+')', correction:parts[1].trim(), explanation:'"'+cn+'" 翻译不够完整，参考 "'+parts[1].trim()+'"' });
    else correctKP++;
  });

  const refArt = (ref.match(/\b(a|an|the)\b/gi)||[]).length;
  const usrArt = (userText.match(/\b(a|an|the)\b/gi)||[]).length;
  if (usrArt < refArt * 0.6) errors.push({ type:'hard', category:'冠词', original:'articles: '+usrArt, correction:'~'+refArt, explanation:'冠词使用不足。参考'+refArt+'处，你的'+usrArt+'处。' });
  if (/(?:^|[.!?]\s+)([a-z])/.test(userText)) errors.push({ type:'hard', category:'大小写', original:userText.substring(0,30)+'...', correction:'Capitalize', explanation:'句子开头应大写。' });
  if (userSents.length < refSents.length * 0.5) errors.push({ type:'hard', category:'漏译', original:userSents.length+'句', correction:refSents.length+'句', explanation:'句子过少，可能有大段漏译。' });

  userSents.forEach((us, idx) => {
    const rs = refSents[Math.min(idx, refSents.length-1)] || '';
    const uw = (us.toLowerCase().match(/\b[a-z']+\b/g)||[]);
    const rSet = new Set((rs.toLowerCase().match(/\b[a-z']+\b/g)||[]));
    uw.filter(w => !rSet.has(w) && w.length>4 && !COMMON_WORDS.has(w)).slice(0,3).forEach(w => {
      const close = (rs.toLowerCase().match(/\b[a-z']+\b/g)||[]).find(rw => rw.length>4 && levenshtein(w,rw)<=2);
      if (close) errors.push({ type:'hard', category:'拼写/用词', original:w, correction:close, explanation:'"'+w+'" 可能是 "'+close+'" 的拼写错误。' });
      else errors.push({ type:'polish', category:'用词', original:w, correction:'(对照参考)', explanation:'"'+w+'" 可能不是最佳用词。' });
    });
  });

  if (!/[.!?]$/.test(userText.trim())) errors.push({ type:'hard', category:'标点', original:'(结尾)', correction:'.', explanation:'译文结尾缺少句号。' });

  const totalKP = kp.length, hardErr = errors.filter(e=>e.type==='hard').length, polErr = errors.filter(e=>e.type==='polish').length;
  let score = 100 - hardErr*6 - polErr*2;
  score = Math.round(Math.max(score * (0.5 + (totalKP>0?correctKP/totalKP:0)*0.5), 0));
  score = Math.min(score, 99);
  let comment = score>=85?'译文质量高，关键表达准确。' : score>=70?'译文不错，部分表达可改进。' : score>=55?'译文有待改进，存在较多漏译或语法错误。' : '译文需大幅改进，建议对照参考译文逐句修改。';
  return { errors, score, comment, correctKP, totalKP, hardErr, polErr };
}

function renderTranslationResult(userText, exercise, result) {
  const c = document.getElementById('tr-result');
  if (!c) return;
  let html = '<div class="card"><div class="score-display"><div class="score-number">'+result.score+'</div><div class="score-comment">/ 100 - '+escapeHtml(result.comment)+'</div></div>';
  html += '<div style="font-size:13px;text-align:center;color:var(--text-tertiary);">关键表达: '+result.correctKP+'/'+result.totalKP+' | 硬错误: '+result.hardErr+' | 润色: '+result.polErr+'</div></div>';

  html += '<div class="card"><div class="card-title">你的译文（红色标记修订）</div>';
  html += '<div class="correction-legend"><span class="legend-item"><span class="mark-delete">删除线</span> = 建议删除</span><span class="legend-item"><span class="mark-insert">插入</span> = 建议补充</span><span class="legend-item"><span class="mark-highlight">高亮</span> = 需修改</span></div>';
  html += '<div class="correction-display">'+generateMarkedText(userText, result.errors)+'</div></div>';

  html += '<div class="card"><div class="card-title">错误与修改建议</div><div class="error-list">';
  result.errors.forEach(e => {
    html += '<div class="error-item"><span class="error-type '+e.type+'">'+e.category+'</span>'+escapeHtml(e.explanation);
    if (e.correction) html += ' <span class="mark-insert">'+escapeHtml(e.correction)+'</span>';
    html += '</div>';
  });
  html += '</div></div>';

  html += '<div class="card"><div class="card-title">参考标准译文</div><div class="correction-display">'+escapeHtml(exercise.reference)+'</div>';
  html += '<div class="mt-16"><strong>关键表达对照</strong></div><div style="font-size:13px;line-height:1.8;">';
  exercise.keyPoints.forEach(p => html += '<div>'+escapeHtml(p)+'</div>');
  html += '</div></div>';

  c.innerHTML = html;
  result.errors.forEach(e => autoCollectNote('translation', '**原文:** '+e.original+'\n\n**错误类型:** '+e.category+' ('+(e.type==='hard'?'硬错误':'润色建议')+')\n\n**修改建议:** '+e.correction+'\n\n**说明:** '+e.explanation+'\n\n**来源:** '+exercise.title+' ('+exercise.year+')'));
  showFeedback('tr-fb', '批改完成，'+result.errors.length+' 处错误已收录到笔记本。');
}

function generateMarkedText(userText, errors) {
  let result = escapeHtml(userText);
  errors.forEach(err => {
    if (!err.original || err.original.startsWith('(') || err.original.startsWith('article') || err.original.includes('句') || err.original.includes('结尾')) return;
    const orig = err.original.trim();
    if (orig.length < 2) return;
    const escOrig = orig.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
    if (err.type === 'hard' && err.correction && !err.correction.startsWith('(') && !err.correction.startsWith('~') && err.correction !== 'Capitalize' && err.correction !== '.' && err.correction.length > 1) {
      const escCorr = err.correction.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
      const marked = '<span class="mark-delete">'+escOrig+'</span> <span class="mark-insert">'+escCorr+'</span>';
      try { result = result.replace(new RegExp(escOrig.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'), 'gi'), marked); } catch(e){}
    } else if (err.type === 'polish') {
      const marked = '<span class="mark-highlight">'+escOrig+'</span>';
      try { result = result.replace(new RegExp(escOrig.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'), 'gi'), marked); } catch(e){}
    }
  });
  return result;
}

// ========== News Module ==========
function initNews() {
  const today = new Date();
  const dayIdx = Math.floor((today - new Date(today.getFullYear(),0,0)) / 86400000);
  renderNewsContent(dayIdx % NEWS_DATA.length);
}

function renderNewsContent(idx) {
  const c = document.getElementById('news-content');
  if (!c) return;
  const news = NEWS_DATA[idx];
  const ap = createAudioPlayerHTML(null, true, news.title + '. ' + news.summary);

  let html = '<div class="news-card">';
  html += '<div class="news-title">'+escapeHtml(news.title)+'</div>';
  html += '<div class="news-summary">'+escapeHtml(news.summary)+'</div>';
  html += ap.html;
  html += '<div class="news-keywords">';
  news.keywords.forEach(kw => {
    const added = appState.notes.some(n => n.category==='vocabulary' && n.content.includes(kw.word));
    html += '<span class="keyword-chip'+(added?' added':'')+'" data-word="'+escapeHtml(kw.word)+'" data-meaning="'+escapeHtml(kw.meaning)+'">'+escapeHtml(kw.word)+' <span class="text-tertiary">'+escapeHtml(kw.meaning)+'</span></span>';
  });
  html += '</div>';
  html += '<p class="text-tertiary mt-8" style="font-size:12px;">点击词汇可加入笔记本。点击播放按钮收听美音朗读。</p>';
  html += '</div>';

  // Navigation
  html += '<div style="display:flex;gap:8px;justify-content:center;">';
  html += '<button class="btn btn-ghost btn-small" id="news-prev">上一篇</button>';
  html += '<button class="btn btn-ghost btn-small" id="news-next">下一篇</button>';
  html += '</div>';

  c.innerHTML = html;
  bindAudioPlayer(ap.id, null, true, news.title + '. ' + news.summary);
  c.querySelectorAll('.keyword-chip').forEach(chip => chip.addEventListener('click', () => {
    autoCollectNote('vocabulary', '热点词汇: **'+chip.dataset.word+'**\n\n'+chip.dataset.meaning);
    chip.classList.add('added');
    showInlineFeedback('已加入笔记本: ' + chip.dataset.word);
  }));
  document.getElementById('news-prev').addEventListener('click', () => renderNewsContent((idx-1+NEWS_DATA.length)%NEWS_DATA.length));
  document.getElementById('news-next').addEventListener('click', () => renderNewsContent((idx+1)%NEWS_DATA.length));
}

// ========== Video Module ==========
function initVideo() {
  const today = new Date();
  const dayIdx = Math.floor((today - new Date(today.getFullYear(),0,0)) / 86400000);
  renderVideoContent(dayIdx % VIDEO_DATA.length);
}

function renderVideoContent(idx) {
  const c = document.getElementById('video-content');
  if (!c) return;
  const v = VIDEO_DATA[idx];

  let html = '<div class="video-card">';
  html += '<div class="video-title">'+escapeHtml(v.title)+'</div>';
  html += '<div class="video-desc">'+escapeHtml(v.description)+'</div>';
  html += '<div class="video-placeholder">视频播放区域<br>（此处嵌入1-2分钟美剧/英剧片段）<br>支持中英文字幕切换与语速调节</div>';
  html += '<div class="subtitle-toggle">';
  html += '<button class="subtitle-btn active" data-sub="en">English</button>';
  html += '<button class="subtitle-btn" data-sub="cn">中文字幕</button>';
  html += '<button class="subtitle-btn" data-sub="both">双语</button>';
  html += '</div>';

  // Expressions
  html += '<div class="card-title mt-16">核心口语表达</div>';
  v.expressions.forEach(exp => {
    const ap = createAudioPlayerHTML(null, true, exp.english);
    html += '<div class="expression-item">';
    html += '<div class="expression-en">'+escapeHtml(exp.english)+'</div>';
    html += '<div class="expression-cn">'+escapeHtml(exp.chinese)+'</div>';
    html += '<div class="expression-note">'+escapeHtml(exp.note)+'</div>';
    html += ap.html;
    html += '</div>';
  });

  // Shadowing record
  html += '<div class="mt-16"><strong>跟读录音</strong></div>';
  html += '<div class="recording-controls">';
  html += '<button class="record-btn" id="vid-rec"><div class="record-dot"></div><span class="record-label">开始录音</span></button>';
  html += '<span class="recording-time" id="vid-rec-time">00:00</span></div>';
  html += '<div class="feedback-toast" id="vid-fb"></div>';
  html += '</div>';

  // Navigation
  html += '<div style="display:flex;gap:8px;justify-content:center;margin-top:16px;">';
  html += '<button class="btn btn-ghost btn-small" id="vid-prev">上一个</button>';
  html += '<button class="btn btn-ghost btn-small" id="vid-next">下一个</button>';
  html += '</div>';

  c.innerHTML = html;

  // Bind audio players for expressions
  const players = c.querySelectorAll('.audio-player');
  let pi = 0;
  v.expressions.forEach(exp => {
    if (players[pi]) { bindAudioPlayer(players[pi].id, null, true, exp.english); pi++; }
  });

  // Subtitle toggle
  c.querySelectorAll('.subtitle-btn').forEach(btn => btn.addEventListener('click', () => {
    c.querySelectorAll('.subtitle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }));

  // Recording
  document.getElementById('vid-rec').addEventListener('click', async () => {
    const btn = document.getElementById('vid-rec');
    const timeEl = document.getElementById('vid-rec-time');
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      const result = await stopMediaRecording();
      btn.classList.remove('recording');
      btn.querySelector('.record-label').textContent = '开始录音';
      if (recordingTimer) { clearInterval(recordingTimer); recordingTimer = null; }
      if (result) {
        await saveRecording(result.blob, result.mimeType, { module:'video', topic:v.id, label:v.title });
        showFeedback('vid-fb', '跟读录音已保存。');
      }
      return;
    }
    try {
      await startMediaRecording();
      btn.classList.add('recording');
      btn.querySelector('.record-label').textContent = '停止录音';
      recordingStartTime = Date.now();
      recordingTimer = setInterval(() => {
        const e = Math.floor((Date.now()-recordingStartTime)/1000);
        if (timeEl) timeEl.textContent = String(Math.floor(e/60)).padStart(2,'0')+':'+String(e%60).padStart(2,'0');
      }, 1000);
    } catch(e) { showFeedback('vid-fb', '无法访问麦克风。'); }
  });

  document.getElementById('vid-prev').addEventListener('click', () => renderVideoContent((idx-1+VIDEO_DATA.length)%VIDEO_DATA.length));
  document.getElementById('vid-next').addEventListener('click', () => renderVideoContent((idx+1)%VIDEO_DATA.length));
}

// ========== Notebook Module ==========
function initNotebook() { renderNotebook('all'); bindNotebookControls(); }

function bindNotebookControls() {
  document.querySelectorAll('.notebook-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.notebook-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderNotebook(tab.dataset.cat);
    });
  });
  document.getElementById('note-add-btn').addEventListener('click', () => {
    const input = document.getElementById('note-input');
    const cat = document.getElementById('note-category').value;
    if (!input || !input.value.trim()) return;
    appState.notes.push({ category: cat, content: input.value.trim(), date: new Date().toISOString(), auto: false });
    saveState();
    input.value = '';
    const activeTab = document.querySelector('.notebook-tab.active');
    renderNotebook(activeTab ? activeTab.dataset.cat : 'all');
  });
}

function renderNotebook(category) {
  const c = document.getElementById('notebook-list');
  if (!c) return;
  const filtered = category === 'all' ? appState.notes : appState.notes.filter(n => n.category === category);
  if (filtered.length === 0) {
    c.innerHTML = '<div class="empty-state">暂无笔记。翻译和口语练习中的错误会自动收录到这里。</div>';
    return;
  }
  let html = '<div class="card">';
  const sorted = [...filtered].sort((a,b) => new Date(b.date) - new Date(a.date));
  sorted.forEach((note, idx) => {
    const realIdx = appState.notes.indexOf(note);
    const d = new Date(note.date);
    const ds = d.getMonth()+1+'/'+d.getDate()+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
    const tagLabel = { translation:'翻译', speaking:'口语', vocabulary:'词汇', manual:'手动' }[note.category] || note.category;
    html += '<div class="note-entry">';
    html += '<div class="note-header"><span class="note-tag '+note.category+'">'+tagLabel+(note.auto?' (自动)':'')+'</span><span class="note-date">'+ds+'</span></div>';
    html += '<div class="note-content">'+renderNoteContent(note.content)+'</div>';
    html += '<button class="note-delete" data-nidx="'+realIdx+'">删除</button>';
    html += '</div>';
  });
  html += '</div>';
  c.innerHTML = html;
  c.querySelectorAll('[data-nidx]').forEach(b => b.addEventListener('click', () => {
    appState.notes.splice(parseInt(b.dataset.nidx), 1);
    saveState();
    const activeTab = document.querySelector('.notebook-tab.active');
    renderNotebook(activeTab ? activeTab.dataset.cat : 'all');
  }));
}

function renderNoteContent(content) {
  // Simple markdown rendering for bold and newlines
  let html = escapeHtml(content);
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\n/g, '<br>');
  return html;
}

// ========== Init ==========
function initApp() {
  loadState();
  initNavigation();
  updateCountdown();
  updateDate();
  initDailyTasks();
  initPomodoro();
  initVocabulary();
  initSpeaking();
  initDialogue();
  initTranslation();
  initNews();
  initVideo();
  initNotebook();

  // Load TTS voices
  if (window.speechSynthesis) {
    loadTTSVoices();
    window.speechSynthesis.onvoiceschanged = loadTTSVoices;
  }

  // Update countdown daily
  setInterval(updateCountdown, 3600000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
