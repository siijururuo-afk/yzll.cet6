const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=path.resolve(__dirname,'../dist');
const source=fs.readFileSync(path.join(root,'assets/reader.js'),'utf8');
const loader=source.slice(source.indexOf('const offlineData='),source.indexOf('function node('));
function setup(protocol='https:',failScript=false,failFetch=false){
 let scripts=0,fetches=0;
 const c={Map,Promise,Error,AbortController,setTimeout,clearTimeout,location:{protocol},fetch:async url=>{fetches++;if(failFetch)throw Error('network failure');return{ok:true,json:async()=>JSON.parse(fs.readFileSync(path.join(root,url.split('?')[0]),'utf8'))};}};
 c.window=c;c.document={createElement:()=>({remove(){}}),head:{append(script){scripts++;queueMicrotask(()=>{if(failScript)return script.onerror();try{vm.runInContext(fs.readFileSync(path.join(root,script.src.split('?')[0]),'utf8'),context);script.onload();}catch(e){script.onerror();}});}}};
 const context=vm.createContext(c);vm.runInContext(loader+'\nwindow.testLoad=load;',context);
 return{load:c.testLoad,counts:()=>({scripts,fetches})};
}
(async()=>{
 const online=setup('https:',false,true);
 const [m,d,m2]=await Promise.all([online.load('data/manifest.json'),online.load('data/dictionary.json'),online.load('data/manifest.json')]);
 assert.equal(m.totalArticles,106);assert.equal(m.totalWords,5276);assert.strictEqual(m,m2);assert.equal(online.counts().scripts,2);assert.equal(online.counts().fetches,0);assert(Object.keys(d.entries).length>=5276);
 let targets=0;for(const a of m.articles){const article=await online.load(a.path);assert.equal(article.day,a.day);targets+=article.targetWords.length;}assert.equal(targets,5276);
 const offline=setup('file:',false,true);assert.equal((await offline.load('data/manifest.json')).totalArticles,106);
 const fallback=setup('https:',true,false);assert.equal((await fallback.load('data/manifest.json')).totalArticles,106);assert.equal(fallback.counts().fetches,1);
 const failure=setup('https:',true,true);await assert.rejects(failure.load('data/manifest.json'));await assert.rejects(failure.load('data/manifest.json'));assert.equal(failure.counts().scripts,2);
 const report={passed:true,articlesLoaded:106,targetWords:targets,dictionaryEntries:Object.keys(d.entries).length,checks:['script loading without fetch','deduplicated parallel loads','all article wrappers','file protocol','JSON fallback','retry after failure'],scope:'Node VM loader integration; not a physical-device test'};
 fs.writeFileSync(path.resolve(__dirname,'../LOAD-QA.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
})().catch(e=>{console.error(e);process.exit(1)});
