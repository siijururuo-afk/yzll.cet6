import json,pathlib
root=pathlib.Path(__file__).resolve().parents[1];dist=root/'dist'
for p in (dist/'data').rglob('*.json'):
 rel=p.relative_to(dist).as_posix();p.with_suffix('.js').write_text('window.CET6_DATA('+json.dumps(rel)+','+p.read_text()+');\n')
files=['./','index.html','assets/style.css','assets/app.js','assets/annotations.js','assets/reader.js','reader.html','reader-ink.html','assets/reader-color.js','assets/annotations-color.js']+[p.relative_to(dist).as_posix() for p in (dist/'data').rglob('*') if p.is_file()]
version='cet6-ink-v3';(dist/'sw.js').write_text("const CACHE="+json.dumps(version)+";const FILES="+json.dumps(files)+";\n"+'''self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>(k.startsWith('cet6-static-')||k.startsWith('cet6-full-')||k.startsWith('cet6-reader-')||k.startsWith('cet6-ink-'))&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==location.origin)return;event.respondWith(caches.open(CACHE).then(c=>c.match(event.request,{ignoreSearch:true})).then(hit=>hit||fetch(event.request)));});
''')
(dist/'sw-reader.js').write_bytes((dist/'sw.js').read_bytes())
print('Offline companion files:',len(files))

(dist/'sw-colors.js').write_bytes((dist/'sw.js').read_bytes())
