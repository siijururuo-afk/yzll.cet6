"""Extend the bundled ECDICT subset with article surface forms and likely lemmas."""
import csv,json,re,pathlib,sys
root=pathlib.Path(__file__).resolve().parents[1]
source=pathlib.Path(sys.argv[1]) if len(sys.argv)>1 else pathlib.Path('/workspace/scratch/798008f091de/sources/ecdict.csv')
if not source.exists():print('No full ECDICT CSV; bundled dictionary snapshot retained.');sys.exit(0)
p=root/'sources/ecdict-selection.json';entries=json.loads(p.read_text());tokens=set()
for f in (root/'sources/full-articles').glob('*.json'):
 a=json.loads(f.read_text());text=a['title']+' '+' '.join(z['en'] for z in a['paragraphs']);tokens.update(t.lower().replace('’',"'") for t in re.findall(r"[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['’][A-Za-zÀ-ÖØ-öø-ÿ]+)?",text))
requested=set(tokens)
for w in tokens:
 if w.endswith("'s"):requested.add(w[:-2])
 if w.endswith('ies'):requested.add(w[:-3]+'y')
 for ending in ['s','es','ed','ing','er','est']:
  if w.endswith(ending):
   b=w[:-len(ending)];requested.update([b,b+'e'])
   if len(b)>1 and b[-1]==b[-2]:requested.add(b[:-1])
   if b.endswith('i'):requested.add(b[:-1]+'y')
for attempt in range(2):
 for row in csv.DictReader(source.open()):
  w=row.get('word','').lower()
  if w in requested and (w not in entries or not entries[w].get('phonetic')):entries[w]=row
 for w in list(requested):
  for exchange in entries.get(w,{}).get('exchange','').split('/'):
   if exchange.startswith('0:'):requested.update(exchange[2:].split(','))
p.write_text(json.dumps(entries,ensure_ascii=False,indent=2));print('Dictionary subset entries:',len(entries),'article tokens:',len(tokens))
