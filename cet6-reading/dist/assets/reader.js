'use strict';
(() => {
const $ = id => document.getElementById(id);
const storageKey='cet6-reading-full-v1';
if('scrollRestoration' in history)history.scrollRestoration='manual';
let manifest, lexicon, article, currentDay=1, ticket=0, activeWord, lastFocus, scrollTimer;
let saved={day:1,positions:{}};
try{const s=JSON.parse(localStorage.getItem(storageKey));if(s&&typeof s==='object')saved={day:s.day||1,positions:s.positions||{}};}catch{}
const offlineData=new Map();window.CET6_DATA=(path,data)=>offlineData.set(path,data);
const pendingData=new Map();
async function load(path){
 if(offlineData.has(path))return offlineData.get(path);
 if(pendingData.has(path))return pendingData.get(path);
 const request=(async()=>{
  try{
   await new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    const alias=path==='data/dictionary.json'?'data/dictionary-reader.js':path==='data/manifest.json'?'data/manifest-reader.js':path.replace(/\.json$/,'.js');
    script.src=alias+'?v=reader-v2';script.async=true;
    const timer=setTimeout(()=>{script.remove();reject(new Error('资料加载超时'));},20000);
    script.onload=()=>{clearTimeout(timer);script.remove();offlineData.has(path)?resolve():reject(new Error('资料文件未返回数据'));};
    script.onerror=()=>{clearTimeout(timer);script.remove();reject(new Error('资料文件加载失败'));};
    document.head.append(script);
   });
   return offlineData.get(path);
  }catch(error){
   if(location.protocol==='file:')throw error;
   const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);
   try{const response=await fetch(path+'?v=reader-v2',{cache:'no-store',signal:controller.signal});if(!response.ok)throw new Error('资料读取失败');const data=await response.json();offlineData.set(path,data);return data;}finally{clearTimeout(timer);}
  }
 })();pendingData.set(path,request);
 try{return await request;}finally{pendingData.delete(path);}
}
function node(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
function storePosition(){if(!article)return;saved.day=currentDay;saved.positions[currentDay]=Math.round(window.scrollY);try{localStorage.setItem(storageKey,JSON.stringify(saved));}catch{}}
function lookup(surface){const key=surface.toLowerCase().replace(/’/g,"'");let f=lexicon.forms[key];if(!f&&key.endsWith("'s"))f={lemma:key.slice(0,-2),form:'所有格'};return f||{lemma:key,form:''};}
function chapterLabel(n){const c=['零','一','二','三','四','五','六','七','八','九'];let v;if(n<10)v=c[n];else if(n<20)v='十'+(n%10?c[n%10]:'');else if(n<100)v=c[Math.floor(n/10)]+'十'+(n%10?c[n%10]:'');else v=c[Math.floor(n/100)]+'百'+(n%100?(n%100<10?'零'+c[n%10]:(n%100<20?'一十':c[Math.floor(n%100/10)]+'十')+(n%10&&n%100>=10?c[n%10]:'')):'');return '第'+v+'篇';}
function renderEnglish(text,targets){
 const p=node('p','english');p.lang='en';let end=0;
 const special=[...targets.keys()].filter(w=>/[ -]/.test(w)).sort((a,b)=>b.length-a.length);
 const tokenPattern="[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['’][A-Za-zÀ-ÖØ-öø-ÿ]+)?";
 const pattern=new RegExp((special.length?'(?<![A-Za-zÀ-ÖØ-öø-ÿ])(?:'+special.join('|')+')(?![A-Za-zÀ-ÖØ-öø-ÿ])|':'')+tokenPattern,'gi');
 for(const m of text.matchAll(pattern)){
  const punctuation=text.slice(m.index+m[0].length).match(/^[,.;:!?]+/)?.[0]||'';
  p.append(document.createTextNode(text.slice(end,m.index)));const f=lookup(m[0]),target=targets.get(m[0].toLowerCase())||targets.get(f.lemma);const wrap=target?node('strong','target'):null;
  const pieces=m[0].includes(' ')?[...m[0].matchAll(/[A-Za-zÀ-ÖØ-öø-ÿ]+/g)]:null;
  function makeButton(surface,phrase){const b=node('button','word'+(target?' target':''),surface);b.type='button';b.dataset.word=surface;b.dataset.lemma=target?target.word:f.lemma;if(target)b.dataset.targetWord=target.word;if(phrase)b.dataset.phrase=phrase;b.setAttribute('aria-label',surface+'，查看释义');return b;}
  if(pieces&&target){let offset=0;for(const piece of pieces){wrap.append(document.createTextNode(m[0].slice(offset,piece.index)),makeButton(piece[0],m[0]));offset=piece.index+piece[0].length;}wrap.append(document.createTextNode(m[0].slice(offset)));}
  else if(target)wrap.append(makeButton(m[0]));else{const b=makeButton(m[0]);b.append(document.createTextNode(punctuation));p.append(b);}
  if(target){wrap.append(node('span','gloss','（'+target.gloss+'）'+punctuation));p.append(wrap);}end=m.index+m[0].length+punctuation.length;
 }p.append(document.createTextNode(text.slice(end)));return p;
}
async function showDay(day,{restore=true,updateHash=true}={}){
 const id=++ticket;day=Math.max(1,Math.min(manifest.totalArticles,Number(day)||1));storePosition();closeDialogs();$('reader').setAttribute('aria-busy','true');
 try{
 const data=await load(manifest.articles[day-1].path);if(id!==ticket)return;article=data;currentDay=day;saved.day=day;
 const heading=node('section','chapter-heading');heading.append(node('p','day-label',chapterLabel(day)),node('h1',null,article.title),node('p','word-count',article.targetWords.length+' words'));
 const fragment=document.createDocumentFragment();fragment.append(heading);const targets=new Map(article.targetWords.map(w=>[w.word,w]));
 for(const p of article.paragraphs){const section=node('section','paragraph');section.append(renderEnglish(p.en,targets),node('p','chinese',p.zh));fragment.append(section);}
 $('reader').replaceChildren(fragment);window.dispatchEvent(new CustomEvent('cet6:article',{detail:{day,title:article.title}}));$('reader').setAttribute('aria-busy','false');$('navigation').hidden=false;$('previous').disabled=!article.previous;$('next').disabled=!article.next;$('chapter-count').textContent=`${chapterLabel(day)} / 共 ${manifest.totalArticles} 篇`;
 document.title=`${chapterLabel(day)} · ${article.title} · CET-6`;
 if(updateHash)history.replaceState(null,'',`#day=${day}`);
 requestAnimationFrame(()=>{window.scrollTo(0,restore?(Number(saved.positions[day])||0):0);storePosition();});
 }catch(e){if(id!==ticket)return;const p=node('p','status','文章读取失败，请检查项目文件是否完整。');const b=node('button','retry','重新打开');b.onclick=()=>showDay(day,{restore});$('reader').replaceChildren(p,b);$('reader').setAttribute('aria-busy','false');}
}
function openDialog(d){lastFocus=document.activeElement;document.body.classList.add('modal-open');d.showModal();d.setAttribute('tabindex','-1');d.focus({preventScroll:true});d.scrollTop=0;}
function closeDialogs(){for(const d of document.querySelectorAll('dialog[open]'))d.close();}
function section(label,en,zh){const d=node('section','dict-section');d.append(node('h3',null,label),node('p','context-en',en));if(zh)d.append(node('p','context-zh',zh));return d;}
function showWord(button){
 const surface=button.dataset.phrase||button.dataset.word,f=lookup(surface),entry=lexicon.entries[f.lemma];if(!entry)return;
 activeWord?.classList.remove('active');activeWord=button;button.classList.add('active');const container=document.createDocumentFragment();const head=node('div','headword-row');const h=node('h2',null,f.lemma);h.id='dict-word';const speak=node('button','sound');speak.type='button';speak.title='朗读单词';speak.setAttribute('aria-label','朗读 '+f.lemma);speak.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 8a6 6 0 0 1 0 8M19 5a10 10 0 0 1 0 14"/></svg>';
 speak.disabled=!('speechSynthesis' in window);speak.onclick=()=>{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(f.lemma);u.lang='en-GB';const voices=speechSynthesis.getVoices();u.voice=voices.find(v=>v.lang==='en-GB'&&v.localService)||voices.find(v=>v.lang.startsWith('en')&&v.localService)||voices.find(v=>v.lang.startsWith('en'))||null;u.rate=.85;speechSynthesis.speak(u);};head.append(h,speak);container.append(head,node('p','phonetic',entry.phonetic?'/'+entry.phonetic+'/':''));
 if(f.form||surface.toLowerCase()!==f.lemma)container.append(node('p','form-note',surface+' → '+f.lemma+(f.form?' · '+f.form:'')));
 const target=article.targetWords.find(t=>t.word===(button.dataset.targetWord||f.lemma));if(target)container.append(node('p','definition context-gloss','本文义：'+target.gloss));
 for(const def of entry.definitions.slice(0,3)){const p=node('p','definition');p.append(node('span','pos',def.pos),document.createTextNode(def.meaning.split(/[；;,，]/).slice(0,4).join('；')));container.append(p);}
 if(target&&entry.collocation)container.append(section('常见搭配',entry.collocation.en,entry.collocation.zh));
 if(target){container.append(section('本文',target.context));container.append(section('所在段落译文','',(target.contextZh||article.paragraphs[target.contextParagraph]?.zh||'')));}
 $('dict-content').replaceChildren(container);openDialog($('dictionary'));if(!speak.disabled)speak.onclick();
}
function openContents(){
 const frag=document.createDocumentFragment();for(const a of manifest.articles){const li=node('li');const b=node('button');b.type='button';b.append(node('span','toc-day',chapterLabel(a.day)),document.createTextNode(a.title));if(a.day===currentDay)b.setAttribute('aria-current','page');b.onclick=()=>{closeDialogs();showDay(a.day,{restore:true});};li.append(b);frag.append(li);}
 $('toc-list').replaceChildren(frag);$('toc-meta').textContent=`${manifest.totalArticles} 篇 · ${manifest.totalWords.toLocaleString()} 个目标词` ;openDialog($('toc'));$('toc-list button[aria-current]')?.scrollIntoView({block:'center'});
}
$('reader').addEventListener('click',e=>{const b=e.target.closest('button[data-word]');if(b)showWord(b);});
$('contents').onclick=()=>manifest&&openContents();$('previous').onclick=()=>article?.previous&&showDay(article.previous,{restore:true});$('next').onclick=()=>article?.next&&showDay(article.next,{restore:true});
for(const d of document.querySelectorAll('dialog')){d.addEventListener('click',e=>{if(e.target.closest('[data-close]'))d.close();if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});d.addEventListener('close',()=>{document.body.classList.remove('modal-open');activeWord?.classList.remove('active');lastFocus?.focus({preventScroll:true});});}
window.addEventListener('scroll',()=>{clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>{if(!document.querySelector('dialog[open]'))storePosition();},200);},{passive:true});window.addEventListener('pagehide',storePosition);window.addEventListener('hashchange',()=>{if(manifest)showDay(new URLSearchParams(location.hash.slice(1)).get('day'),{restore:true,updateHash:false});});
async function start(){
 $('reader').replaceChildren(node('p','status','正在打开文章…'));$('reader').setAttribute('aria-busy','true');
 try{
  [manifest,lexicon]=await Promise.all([load('data/manifest.json'),load('data/dictionary.json')]);
  if(!manifest?.articles?.length||!lexicon?.entries||!lexicon?.forms)throw new Error('资料结构不完整');
  await showDay(new URLSearchParams(location.hash.slice(1)).get('day')||saved.day,{restore:true});
  if('serviceWorker' in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('sw-colors.js').catch(()=>{});
 }catch(error){
  console.error('CET-6 data loading failed',error);
  const message=node('p','status','资料暂未加载成功。请重新加载，或检查网络连接。'),retry=node('button','retry','重新加载');retry.type='button';retry.onclick=start;$('reader').replaceChildren(message,retry);$('reader').setAttribute('aria-busy','false');
 }
}
start();
})();
