'use strict';
(() => {
const $ = id => document.getElementById(id);
const storageKey='cet6-reading-v1';
if('scrollRestoration' in history)history.scrollRestoration='manual';
let manifest, lexicon, article, currentDay=1, ticket=0, activeWord, lastFocus, scrollTimer;
let saved={day:1,positions:{}};
try{const s=JSON.parse(localStorage.getItem(storageKey));if(s&&typeof s==='object')saved={day:s.day||1,positions:s.positions||{}};}catch{}
const offlineData=new Map();window.CET6_DATA=(path,data)=>offlineData.set(path,data);
async function load(path){
 if(location.protocol!=='file:'){if('caches' in window){try{const cached=await caches.match(new URL(path,document.baseURI).href);if(cached)return cached.json();}catch{}}const r=await fetch(path);if(!r.ok)throw new Error('资料读取失败');return r.json();}
 if(offlineData.has(path))return offlineData.get(path);
 await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=path.replace(/\.json$/,'.js');script.onload=resolve;script.onerror=reject;document.head.append(script);});
 if(!offlineData.has(path))throw new Error('离线资料读取失败');return offlineData.get(path);
}
function node(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
function storePosition(){if(!article)return;saved.day=currentDay;saved.positions[currentDay]=Math.round(window.scrollY);try{localStorage.setItem(storageKey,JSON.stringify(saved));}catch{}}
function lookup(surface){const key=surface.toLowerCase().replace(/’/g,"'");let f=lexicon.forms[key];if(!f&&key.endsWith("'s"))f={lemma:key.slice(0,-2),form:'所有格'};return f||{lemma:key,form:''};}
function renderEnglish(text,targets){
 const p=node('p','english');p.lang='en';let end=0;
 for(const m of text.matchAll(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)){
  p.append(document.createTextNode(text.slice(end,m.index)));const f=lookup(m[0]);const target=targets.get(f.lemma);const b=node('button','word'+(target?' target':''),m[0]);b.type='button';b.dataset.word=m[0];b.dataset.lemma=f.lemma;b.setAttribute('aria-label',m[0]+'，查看释义');
  if(target){const wrap=node('strong','target');wrap.append(b,node('span','gloss','（'+target.gloss+'）'));p.append(wrap);}else p.append(b);end=m.index+m[0].length;
 }p.append(document.createTextNode(text.slice(end)));return p;
}
async function showDay(day,{restore=true,updateHash=true}={}){
 const id=++ticket;day=Math.max(1,Math.min(manifest.totalArticles,Number(day)||1));storePosition();closeDialogs();$('reader').setAttribute('aria-busy','true');
 try{
 const data=await load(manifest.articles[day-1].path);if(id!==ticket)return;article=data;currentDay=day;saved.day=day;
 const heading=node('section','chapter-heading');heading.append(node('p','day-label','DAY '+day),node('h1',null,article.title),node('p','word-count',article.targetWords.length+' words'));
 const fragment=document.createDocumentFragment();fragment.append(heading);const targets=new Map(article.targetWords.map(w=>[w.word,w]));
 for(const p of article.paragraphs){const section=node('section','paragraph');section.append(renderEnglish(p.en,targets),node('p','chinese',p.zh));fragment.append(section);}
 $('reader').replaceChildren(fragment);$('reader').setAttribute('aria-busy','false');$('navigation').hidden=false;$('previous').disabled=!article.previous;$('next').disabled=!article.next;$('chapter-count').textContent=`Day ${day} / ${manifest.totalArticles}`;
 document.title=`Day ${day} · ${article.title} · CET-6`;
 if(updateHash)history.replaceState(null,'',`#day=${day}`);
 requestAnimationFrame(()=>{window.scrollTo(0,restore?(Number(saved.positions[day])||0):0);storePosition();});
 }catch(e){if(id!==ticket)return;const p=node('p','status','文章读取失败，请检查项目文件是否完整。');const b=node('button','retry','重新打开');b.onclick=()=>showDay(day,{restore});$('reader').replaceChildren(p,b);$('reader').setAttribute('aria-busy','false');}
}
function openDialog(d){lastFocus=document.activeElement;document.body.classList.add('modal-open');d.showModal();d.setAttribute('tabindex','-1');d.focus({preventScroll:true});d.scrollTop=0;}
function closeDialogs(){for(const d of document.querySelectorAll('dialog[open]'))d.close();}
function section(label,en,zh){const d=node('section','dict-section');d.append(node('h3',null,label),node('p','context-en',en));if(zh)d.append(node('p','context-zh',zh));return d;}
function showWord(button){
 const surface=button.dataset.word,f=lookup(surface),entry=lexicon.entries[f.lemma];if(!entry)return;
 activeWord?.classList.remove('active');activeWord=button;button.classList.add('active');const container=document.createDocumentFragment();const head=node('div','headword-row');const h=node('h2',null,f.lemma);h.id='dict-word';const speak=node('button','sound');speak.type='button';speak.title='朗读单词';speak.setAttribute('aria-label','朗读 '+f.lemma);speak.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 8a6 6 0 0 1 0 8M19 5a10 10 0 0 1 0 14"/></svg>';
 speak.disabled=!('speechSynthesis' in window);speak.onclick=()=>{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(f.lemma);u.lang='en-GB';const voices=speechSynthesis.getVoices();u.voice=voices.find(v=>v.lang==='en-GB'&&v.localService)||voices.find(v=>v.lang.startsWith('en')&&v.localService)||voices.find(v=>v.lang.startsWith('en'))||null;u.rate=.85;speechSynthesis.speak(u);};head.append(h,speak);container.append(head,node('p','phonetic',entry.phonetic?'/'+entry.phonetic+'/':''));
 if(f.form||surface.toLowerCase()!==f.lemma)container.append(node('p','form-note',surface+' → '+f.lemma+(f.form?' · '+f.form:'')));
 const target=article.targetWords.find(t=>t.word===f.lemma);if(target)container.append(node('p','definition context-gloss','本文义：'+target.gloss));
 for(const def of entry.definitions.slice(0,3)){const p=node('p','definition');p.append(node('span','pos',def.pos),document.createTextNode(def.meaning.split(/[；;,，]/).slice(0,4).join('；')));container.append(p);}
 if(target&&entry.collocation)container.append(section('常见搭配',entry.collocation.en,entry.collocation.zh));
 if(target){container.append(section('本文',target.context));container.append(section('所在段落译文','',target.contextZh));}
 $('dict-content').replaceChildren(container);openDialog($('dictionary'));if(!speak.disabled)speak.onclick();
}
function openContents(){
 const frag=document.createDocumentFragment();for(const a of manifest.articles){const li=node('li');const b=node('button');b.type='button';b.append(node('span','toc-day','Day '+a.day),document.createTextNode(a.title));if(a.day===currentDay)b.setAttribute('aria-current','page');b.onclick=()=>{closeDialogs();showDay(a.day,{restore:true});};li.append(b);frag.append(li);}
 $('toc-list').replaceChildren(frag);$('toc-meta').textContent=`${manifest.totalArticles} 篇 · ${manifest.totalWords.toLocaleString()} 个目标词` ;openDialog($('toc'));$('toc-list button[aria-current]')?.scrollIntoView({block:'center'});
}
$('reader').addEventListener('click',e=>{const b=e.target.closest('button[data-word]');if(b)showWord(b);});
$('contents').onclick=()=>manifest&&openContents();$('previous').onclick=()=>article?.previous&&showDay(article.previous,{restore:true});$('next').onclick=()=>article?.next&&showDay(article.next,{restore:true});
for(const d of document.querySelectorAll('dialog')){d.addEventListener('click',e=>{if(e.target.closest('[data-close]'))d.close();if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});d.addEventListener('close',()=>{document.body.classList.remove('modal-open');activeWord?.classList.remove('active');lastFocus?.focus({preventScroll:true});});}
window.addEventListener('scroll',()=>{clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>{if(!document.querySelector('dialog[open]'))storePosition();},200);},{passive:true});window.addEventListener('pagehide',storePosition);window.addEventListener('hashchange',()=>{if(manifest)showDay(new URLSearchParams(location.hash.slice(1)).get('day'),{restore:true,updateHash:false});});
(async()=>{try{[manifest,lexicon]=await Promise.all([load('data/manifest.json'),load('data/dictionary.json')]);await showDay(new URLSearchParams(location.hash.slice(1)).get('day')||saved.day,{restore:true});if('serviceWorker' in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('sw.js').catch(()=>{});}catch{$('reader').replaceChildren(node('p','status','资料加载失败。请完整解压 ZIP 后打开 dist/index.html，或按照 README 启动本地服务器。'));$('reader').setAttribute('aria-busy','false');}})();
})();
