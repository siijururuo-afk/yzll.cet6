import json,re,pathlib,collections
root=pathlib.Path(__file__).resolve().parents[1];scratch=pathlib.Path('/workspace/scratch/798008f091de')
read=lambda p:json.load(open(p));dump=lambda x,p:json.dump(x,open(p,'w'),ensure_ascii=False,indent=2)
ecd=read(root/'sources/ecdict-selection.json');core={x['word']:x for x in read(root/'sources/core-words.json') if isinstance(x,dict)}
groups=read(root/'sources/groups.json');vocab=read(root/'dist/data/vocabulary.json');source={x['word']:x for x in vocab};gloss=read(root/'sources/gloss-overrides.json')
supplements=read(root/'sources/dictionary-supplements.json')
collocations={}
for line in (root/'sources/collocations.txt').read_text().splitlines():
 w,en,zh=line.split('|');collocations[w]={'en':en,'zh':zh}
posfix={'a.':'adj.','vt.':'v.','vi.':'v.','aux.':'modal v.','num.':'num.','prep.':'prep.','pron.':'pron.','conj.':'conj.'}
def ipa(s):
 if not s:return ''
 s=s.strip('/').replace("'",'ˈ').replace('.', 'ˌ').replace(':','ː').replace('ә','ə').replace('g','ɡ')
 for a,b in [('ei','eɪ'),('ai','aɪ'),('oi','ɔɪ'),('əu','əʊ'),('au','aʊ'),('iə','ɪə'),('uə','ʊə')]:s=s.replace(a,b)
 s=re.sub(r'(?<![aɑeɔoɪʊ])i(?!ː)','ɪ',s)
 s=re.sub(r'u(?!ː)','ʊ',s)
 return s
def make(w):
 d=ecd.get(w,{});defs=[]
 for line in re.split(r'\\+n',d.get('translation','')):
  m=re.match(r'([a-z]+\.)\s*(.+)',line)
  if m:defs.append({'pos':posfix.get(m[1],m[1]),'meaning':m[2].replace(', ','；')[:250]})
 if w in core:
  defs=[{'pos':z['pos'],'meaning':z.get('def') or z.get('meaning') or z.get('definition') or ''} for z in core[w]['definitions']]
 if not defs:
  tr=re.split(r'\\+n',d.get('translation',''))[0];defs=[{'pos':d.get('pos') or '', 'meaning':tr[:250]}]
 if w in source and not defs[0]['meaning']:defs=[{'pos':source[w]['pos'],'meaning':source[w]['meaning']}]
 phon=ipa(core.get(w,{}).get('phonetic') or d.get('phonetic',''))
 result={'word':w,'phonetic':phon.strip('/'),'definitions':defs[:5],'forms':d.get('exchange',''),'source':'cet-exams' if w in core else 'ECDICT'}
 if w in supplements:result.update(supplements[w]);result['source']=supplements[w].get('source','Editorial dictionary supplement')
 if w in collocations:result['collocation']=collocations[w]
 return result
# Inflection records use 0=lemma, 1=form; build article-specific mappings offline.
irregular={'is':('be','第三人称单数'),'are':('be','现在时'),'am':('be','现在时'),'was':('be','过去式'),'were':('be','过去式'),'been':('be','过去分词'),'being':('be','现在分词'),'better':('good','比较级'),'best':('good','最高级'),'worse':('bad','比较级'),'worst':('bad','最高级'),'children':('child','复数'),'people':('people',''),'could':('can','过去式／情态变化'),'would':('will','过去式／情态变化'),'should':('shall','过去式／情态变化'),'might':('may','过去式／情态变化'),'their':('their',''),'learning':('learning',''),'retold':('retell','过去式／过去分词'),'staffing':('staff','现在分词')}
formnames={'s':'复数','3':'第三人称单数','d':'过去式','p':'过去分词','i':'现在分词','r':'比较级','t':'最高级','dp':'过去式／过去分词'}
reverse={}
for w in list(source)+list(core):
 for item in ecd.get(w,{}).get('exchange','').split('/'):
  if ':' not in item:continue
  code,forms=item.split(':',1)
  if code in formnames:
   for f in forms.split(','):
    if f and f!=w:reverse.setdefault(f,(w,formnames[code]))
def resolve(token):
 w=token.lower().replace('’',"'")
 if w in irregular:return irregular[w]
 if w.endswith("'s"):
  b=w[:-2]
  if b in ecd:return b,'所有格'
 if w in source:return w,''
 if w=='esthetic':return 'aesthetic','拼写变体'
 ex=dict(x.split(':',1) for x in ecd.get(w,{}).get('exchange','').split('/') if ':' in x)
 if ex.get('0') in ecd and ex['0']!=w:return ex['0'],formnames.get(ex.get('1'), '变形')
 if w in reverse:return reverse[w]
 if w in ecd:return w,''
 candidates=[]
 if w.endswith('ies'):candidates.append((w[:-3]+'y','复数／第三人称单数'))
 if w.endswith('s'):candidates.extend([(w[:-1],'复数／第三人称单数'),(w[:-2],'复数／第三人称单数')])
 for suf,label in [('ing','现在分词'),('ed','过去式／过去分词'),('est','最高级'),('er','比较级')]:
  if w.endswith(suf):
   b=w[:-len(suf)];candidates.extend([(b,label),(b+'e',label),(b[:-1],label) if len(b)>1 and b[-1]==b[-2] else ('',label),(b[:-1]+'y',label) if b.endswith('i') else ('',label)])
 for b,label in candidates:
  if b in ecd:return b,label
 return w,''
articles=[];alltokens=set();unresolved=[]
for block in (root/'sources/articles.txt').read_text().split('@')[1:]:
 lines=block.strip().splitlines();day,title=lines[0].split(' ',1);day=int(day);assert len(lines[1:])%2==0
 paragraphs=[{'en':lines[j],'zh':lines[j+1]} for j in range(1,len(lines),2)]
 tokens=re.findall(r"[A-Za-z]+(?:['’][A-Za-z]+)?",' '.join(p['en'] for p in paragraphs)+' '+title)
 alltokens.update(t.lower() for t in tokens)
 targets=[]
 for w in groups[day-1]:
  x=source[w];g=gloss.get(w) or re.split(r'[、,，;；]',x['meaning'])[0].strip()
  targets.append({'word':w,'gloss':g})
 articles.append({'day':day,'title':title,'targetWords':targets,'paragraphs':paragraphs,'previous':day-1 if day>1 else None,'next':day+1 if day<len(groups) else None})
dictionary={};forms={}
for token in sorted(alltokens|{'regulations','students','studied','studying','works','better','largest'}):
 lemma,form=resolve(token);ent=make(lemma)
 if not ent['definitions'][0]['meaning']:unresolved.append(token)
 dictionary[lemma]=ent;forms[token]={'lemma':lemma,'form':form}
for w in source:dictionary[w]=make(w);forms.setdefault(w,{'lemma':w,'form':''})
# Preserve all source rows as the fallback dictionary, not as article targets.
raw=read(root/'sources/cet_full_list.json')['四六级词汇词频排序表']
for r in raw:
 w=r['单词'].lower()
 if w not in dictionary:dictionary[w]=make(w)
 if not dictionary[w]['definitions'][0]['meaning']:dictionary[w]['definitions']=[{'pos':'','meaning':r['释义']}]
for a in articles:
 for t in a['targetWords']:
  w=t['word'];sent=next((s.strip() for p in a['paragraphs'] for s in re.split(r'(?<=[.!?])\s+',p['en']) if re.search(r'(?<![A-Za-z])'+re.escape(w)+r'(?![A-Za-z])',s,re.I)), '')
  tokens=re.findall(r"[A-Za-z]+(?:['’][A-Za-z]+)?",sent);i=next((i for i,z in enumerate(tokens) if resolve(z)[0]==w),0);t['collocation']=' '.join(tokens[max(0,i-1):i+4]);t['collocationZh']=t['gloss'];t['context']=sent;t['contextZh']=next(p['zh'] for p in a['paragraphs'] if sent in p['en']);t['collocation']=collocations.get(w)
 dump(a,root/f'dist/data/articles/day-{a["day"]:03}.json')
for x in vocab:
 d=dictionary[x['word']];x['phonetic']=d['phonetic'];x['pos']='; '.join(dict.fromkeys(y['pos'] for y in d['definitions']));x['definitions']=d['definitions'];x['shortMeaning']=gloss.get(x['word']) or re.split(r'[、,，;；]',x['meaning'])[0]
dump(vocab,root/'dist/data/vocabulary.json');dump({'entries':dictionary,'forms':forms},root/'dist/data/dictionary.json')
audit=read(root/'sources/data-audit.json');manifest={'totalWords':len(vocab),'totalArticles':len(articles),'repositorySixLevelWords':1252,'day1SupplementWords':37,'articles':[{'day':a['day'],'title':a['title'],'targetCount':len(a['targetWords']),'path':f'data/articles/day-{a["day"]:03}.json','previous':a['previous'],'next':a['next']} for a in articles],'dataAudit':audit}
dump(manifest,root/'dist/data/manifest.json')
print('Articles',len(articles),'target words',len(vocab),'dictionary entries',len(dictionary),'surface forms',len(forms));print('Unresolved:',unresolved);print('Target missing phonetics:',[w for w in source if not dictionary[w]['phonetic']]);print('Target missing pos:',[w for w in source if not dictionary[w]['definitions'][0]['pos']]);
