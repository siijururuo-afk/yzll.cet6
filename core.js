/* ============================================================
 * CET-6 Learning Workstation - Core Logic
 * State, Storage, Navigation, Countdown, Pomodoro, TTS, Recording
 * ============================================================ */
'use strict';

// ========== Constants ==========
const STORAGE_KEY = 'cet6_workstation_v1';
const DB_NAME = 'CET6Recordings';
const DB_VERSION = 1;
const STORE_NAME = 'recordings';
const EXAM_DATE = new Date('2026-12-13T09:00:00+08:00');
// REVIEW_INTERVALS is defined in data.js

const COMMON_WORDS = new Set(['the','a','an','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','can','could','should','may','might','must','to','of','in','on','at','by','for','with','from','as','into','through','during','before','after','above','below','up','down','out','off','over','under','again','further','then','once','here','there','when','where','why','how','all','any','both','each','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','just','but','and','or','if','because','while','although','though','this','that','these','those','i','you','he','she','it','we','they','what','which','who','whom','whose','my','your','his','her','its','our','their','me','him','us','them','also','about']);

// ========== Global State ==========
let appState = {
  vocab: { stats: {}, currentIndex: 0, sessionCount: 0, sessionDate: '' },
  tasks: { date: '', completed: [] },
  pomodoro: { running: false, timeLeft: 1500, mode: 'work', workDuration: 900, breakDuration: 300 },
  notes: [],
  translation: { currentIndex: 0 },
  speaking: { currentPart: 'part1_selfIntro', currentTopicId: null },
  dialogue: { active: false, topicId: null, round: 0, messages: [], userResponses: [], userErrors: [] },
  ttsSpeed: 1.0
};

let mediaRecorder = null;
let mediaChunks = [];
let mediaStream = null;
let recordingStartTime = null;
let recordingTimer = null;
let dbInstance = null;
let pomodoroInterval = null;
let ttsVoices = [];
let dialogueRecognition = null;
let dialogueRecognitionActive = false;

// ========== Storage ==========
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s.vocab) appState.vocab = Object.assign(appState.vocab, s.vocab);
      if (s.tasks) appState.tasks = Object.assign(appState.tasks, s.tasks);
      if (s.pomodoro) { appState.pomodoro.timeLeft = s.pomodoro.timeLeft || 1500; appState.pomodoro.mode = s.pomodoro.mode || 'work'; }
      if (s.notes) appState.notes = s.notes;
      if (s.translation) appState.translation = Object.assign(appState.translation, s.translation);
      if (s.ttsSpeed) appState.ttsSpeed = s.ttsSpeed;
    }
  } catch(e) { console.warn('Load state failed:', e); }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      vocab: appState.vocab,
      tasks: appState.tasks,
      pomodoro: { timeLeft: appState.pomodoro.timeLeft, mode: appState.pomodoro.mode },
      notes: appState.notes,
      translation: appState.translation,
      ttsSpeed: appState.ttsSpeed
    }));
  } catch(e) { console.warn('Save state failed:', e); }
}

// ========== IndexedDB ==========
function openDB() {
  return new Promise((resolve, reject) => {
    if (dbInstance) { resolve(dbInstance); return; }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => { dbInstance = req.result; resolve(dbInstance); };
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        store.createIndex('date', 'date', { unique: false });
        store.createIndex('module', 'module', { unique: false });
      }
    };
  });
}

async function saveRecording(blob, mimeType, meta) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const rec = { blob, type: mimeType, date: new Date().toISOString(), module: meta.module||'speaking', topic: meta.topic||'', label: meta.label||'' };
    const r = tx.objectStore(STORE_NAME).add(rec);
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}

async function getAllRecordings() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const r = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).getAll();
    r.onsuccess = () => { const res = r.result||[]; res.sort((a,b)=>new Date(b.date)-new Date(a.date)); resolve(res); };
    r.onerror = () => reject(r.error);
  });
}

async function deleteRecording(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const r = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).delete(id);
    r.onsuccess = () => resolve();
    r.onerror = () => reject(r.error);
  });
}

// ========== Navigation ==========
function switchModule(name) {
  document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  const m = document.getElementById('module-'+name), t = document.querySelector('.nav-tab[data-module="'+name+'"]');
  if (m) m.classList.add('active');
  if (t) t.classList.add('active');
  window.scrollTo(0, 0);
}

function initNavigation() {
  document.querySelectorAll('.nav-tab').forEach(tab => tab.addEventListener('click', () => switchModule(tab.dataset.module)));
}

// ========== Countdown & Date ==========
function updateCountdown() {
  const days = Math.ceil((EXAM_DATE - new Date()) / 86400000);
  const d1 = document.getElementById('countdown-days'), d2 = document.getElementById('countdown-big');
  if (d1) d1.textContent = days;
  if (d2) d2.textContent = days;
}

function updateDate() {
  const now = new Date(), wk = ['日','一','二','三','四','五','六'];
  const el = document.getElementById('header-date');
  if (el) el.textContent = now.getFullYear()+'年'+(now.getMonth()+1)+'月'+now.getDate()+'日 周'+wk[now.getDay()];
}

// ========== Daily Tasks ==========
const DAILY_TASKS = [
  { id: 'vocab', label: '背诵 20 个六级单词', module: 'vocabulary' },
  { id: 'translation', label: '完成 1 篇段落翻译', module: 'translation' },
  { id: 'speaking', label: '口语练习 15 分钟', module: 'speaking' },
  { id: 'dialogue', label: '完成 1 次口语对话', module: 'dialogue' },
  { id: 'news', label: '阅读每日热点英文', module: 'news' },
  { id: 'video', label: '观看每日视频片段', module: 'video' }
];

function checkTaskReset() {
  const today = new Date().toDateString();
  if (appState.tasks.date !== today) { appState.tasks.date = today; appState.tasks.completed = []; saveState(); }
}

function initDailyTasks() { checkTaskReset(); renderDailyTasks(); }

function renderDailyTasks() {
  const c = document.getElementById('daily-tasks');
  if (!c) return;
  c.innerHTML = '';
  DAILY_TASKS.forEach(task => {
    const done = appState.tasks.completed.includes(task.id);
    const li = document.createElement('li');
    li.className = 'task-item' + (done ? ' completed' : '');
    li.innerHTML = '<div class="task-checkbox'+(done?' checked':'')+'" data-task="'+task.id+'"></div><div class="task-label">'+task.label+'</div>';
    c.appendChild(li);
  });
  c.querySelectorAll('.task-checkbox').forEach(cb => cb.addEventListener('click', () => toggleTask(cb.dataset.task)));
  updateProgress();
}

function toggleTask(id) {
  const i = appState.tasks.completed.indexOf(id);
  if (i >= 0) appState.tasks.completed.splice(i, 1); else appState.tasks.completed.push(id);
  saveState(); renderDailyTasks();
}

function updateProgress() {
  const total = DAILY_TASKS.length, done = appState.tasks.completed.length;
  const bar = document.getElementById('daily-progress'), txt = document.getElementById('progress-text');
  if (bar) bar.style.width = (total>0 ? done/total*100 : 0) + '%';
  if (txt) txt.textContent = '今日任务 ' + done + '/' + total;
}

// ========== Pomodoro ==========
function pomodoroStart() {
  if (appState.pomodoro.running) return;
  appState.pomodoro.running = true;
  pomodoroInterval = setInterval(pomodoroTick, 1000);
  updatePomodoroButtons();
}

function pomodoroPause() {
  appState.pomodoro.running = false;
  if (pomodoroInterval) { clearInterval(pomodoroInterval); pomodoroInterval = null; }
  updatePomodoroButtons();
}

function pomodoroReset() {
  appState.pomodoro.running = false;
  if (pomodoroInterval) { clearInterval(pomodoroInterval); pomodoroInterval = null; }
  appState.pomodoro.mode = 'work';
  appState.pomodoro.timeLeft = appState.pomodoro.workDuration;
  updatePomodoroDisplay(); updatePomodoroButtons();
}

function pomodoroTick() {
  appState.pomodoro.timeLeft--;
  if (appState.pomodoro.timeLeft <= 0) {
    if (appState.pomodoro.mode === 'work') {
      appState.pomodoro.mode = 'break';
      appState.pomodoro.timeLeft = appState.pomodoro.breakDuration;
    } else {
      appState.pomodoro.mode = 'work';
      appState.pomodoro.timeLeft = appState.pomodoro.workDuration;
    }
  }
  updatePomodoroDisplay();
}

function updatePomodoroDisplay() {
  const m = Math.floor(appState.pomodoro.timeLeft/60), s = appState.pomodoro.timeLeft%60;
  const t = document.getElementById('pomodoro-time'), mo = document.getElementById('pomodoro-mode');
  if (t) t.textContent = String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
  if (mo) mo.textContent = appState.pomodoro.mode==='work' ? '专注时间' : '休息时间';
}

function updatePomodoroButtons() {
  const b = document.getElementById('pomodoro-start');
  if (b) { b.textContent = appState.pomodoro.running ? '运行中' : '开始'; b.disabled = appState.pomodoro.running; }
}

function initPomodoro() {
  updatePomodoroDisplay(); updatePomodoroButtons();
  document.getElementById('pomodoro-start').addEventListener('click', pomodoroStart);
  document.getElementById('pomodoro-pause').addEventListener('click', pomodoroPause);
  document.getElementById('pomodoro-reset').addEventListener('click', pomodoroReset);
}

// ========== TTS ==========
function loadTTSVoices() { if (window.speechSynthesis) ttsVoices = window.speechSynthesis.getVoices(); }

function getUSVoice() {
  if (!ttsVoices.length) loadTTSVoices();
  return ttsVoices.find(v=>v.lang==='en-US'&&v.name.toLowerCase().includes('samantha'))
    || ttsVoices.find(v=>v.lang==='en-US'&&v.name.toLowerCase().includes('google'))
    || ttsVoices.find(v=>v.lang==='en-US')
    || ttsVoices.find(v=>v.lang.startsWith('en'));
}

function speak(text, rate) {
  if (!window.speechSynthesis) { showInlineFeedback('当前浏览器不支持语音合成'); return; }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US'; u.rate = rate || appState.ttsSpeed;
  const v = getUSVoice(); if (v) u.voice = v;
  window.speechSynthesis.speak(u);
}

function stopSpeaking() { if (window.speechSynthesis) window.speechSynthesis.cancel(); }

// ========== Audio Player Component ==========
function createAudioPlayerHTML(getAudioFn, isTTS, ttsText) {
  const id = 'p'+Math.random().toString(36).substr(2,9);
  let html = '<div class="audio-player" id="'+id+'">';
  html += '<button class="audio-btn" data-action="play"><div class="audio-btn-icon"></div></button>';
  html += '<div class="speed-selector">';
  [0.5,0.75,1.0,1.25,1.5,2.0].forEach(sp => {
    html += '<button class="speed-btn'+(sp===appState.ttsSpeed?' active':'')+'" data-speed="'+sp+'">'+(sp===1.0?'1x':sp+'x')+'</button>';
  });
  html += '</div></div>';
  return { html, id };
}

function bindAudioPlayer(playerId, audioUrl, isTTS, ttsText) {
  const c = document.getElementById(playerId);
  if (!c) return;
  let playing = false, audioEl = null, speed = appState.ttsSpeed;
  const playBtn = c.querySelector('.audio-btn');
  const speedBtns = c.querySelectorAll('.speed-btn');

  function updateSpeedUI() { speedBtns.forEach(b => b.classList.toggle('active', parseFloat(b.dataset.speed)===speed)); }

  function play() {
    if (playing) { stop(); return; }
    playing = true; playBtn.classList.add('playing');
    if (isTTS) {
      speak(ttsText, speed);
      const check = setInterval(() => { if (!window.speechSynthesis.speaking) { clearInterval(check); stop(); } }, 200);
    } else {
      if (!audioUrl) { stop(); return; }
      audioEl = new Audio(audioUrl);
      audioEl.playbackRate = speed; audioEl.defaultPlaybackRate = speed;
      audioEl.onended = () => stop(); audioEl.onerror = () => stop();
      audioEl.play().catch(() => stop());
    }
  }

  function stop() {
    playing = false; playBtn.classList.remove('playing');
    if (audioEl) { audioEl.pause(); audioEl = null; }
    if (isTTS) stopSpeaking();
  }

  playBtn.addEventListener('click', play);
  speedBtns.forEach(btn => btn.addEventListener('click', () => {
    speed = parseFloat(btn.dataset.speed); appState.ttsSpeed = speed; saveState(); updateSpeedUI();
    if (audioEl) audioEl.playbackRate = speed;
    if (isTTS && playing) speak(ttsText, speed);
  }));
}

// ========== Feedback Toast ==========
function showFeedback(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) { el.textContent = message; el.classList.add('show'); }
}

function showInlineFeedback(msg) {
  // Simple inline feedback - can be enhanced
  console.log(msg);
}

// ========== Utility ==========
function escapeHtml(text) {
  if (!text) return '';
  return String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
}

function levenshtein(a, b) {
  if (!a||!b) return Math.max((a||'').length,(b||'').length);
  const m=a.length, n=b.length;
  const dp = Array(m+1).fill(null).map(()=>Array(n+1).fill(0));
  for (let i=0;i<=m;i++) dp[i][0]=i;
  for (let j=0;j<=n;j++) dp[0][j]=j;
  for (let i=1;i<=m;i++) for (let j=1;j<=n;j++) dp[i][j] = a[i-1]===b[j-1] ? dp[i-1][j-1] : Math.min(dp[i-1][j-1],dp[i-1][j],dp[i][j-1])+1;
  return dp[m][n];
}

// ========== Notebook Auto-Collect ==========
function autoCollectNote(category, content) {
  appState.notes.push({
    category: category,
    content: content,
    date: new Date().toISOString(),
    auto: true
  });
  saveState();
}

// ========== MediaRecorder Helper ==========
async function startMediaRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaStream = stream;
  mediaChunks = [];

  let mimeType = 'audio/webm';
  if (typeof MediaRecorder.isTypeSupported === 'function') {
    if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) mimeType = 'audio/webm;codecs=opus';
    else if (MediaRecorder.isTypeSupported('audio/mp4')) mimeType = 'audio/mp4';
    else if (MediaRecorder.isTypeSupported('audio/mpeg')) mimeType = 'audio/mpeg';
  }

  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.ondataavailable = (e) => { if (e.data&&e.data.size>0) mediaChunks.push(e.data); };
  mediaRecorder.start();
  return mimeType;
}

function stopMediaRecording() {
  return new Promise((resolve) => {
    if (!mediaRecorder || mediaRecorder.state !== 'recording') { resolve(null); return; }
    mediaRecorder.onstop = () => {
      const blob = new Blob(mediaChunks, { type: mediaRecorder.mimeType || 'audio/webm' });
      if (mediaStream) { mediaStream.getTracks().forEach(t => t.stop()); mediaStream = null; }
      resolve({ blob, mimeType: mediaRecorder.mimeType || 'audio/webm' });
    };
    mediaRecorder.stop();
  });
}
