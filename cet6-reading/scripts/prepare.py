"""Recreate exact target groups from the bundled source snapshot, without network access."""
import json,re,pathlib
root=pathlib.Path(__file__).resolve().parents[1]
read=lambda p:json.load(open(root/p));dump=lambda x,p:json.dump(x,open(root/p,'w'),ensure_ascii=False,indent=2)
rows=read('sources/cet_full_list.json')['四六级词汇词频排序表'];ecd=read('sources/ecdict-selection.json')
day1='mitigate ambiguous deteriorate inevitable controversial substantial advocate incentive constrain undermine vulnerable sustainable accommodate compelling compatible compensate contemplate contradict conventional diminish discriminate elaborate empirical facilitate fluctuate formulate foster hamper implement impose intrinsic legitimate manipulate marginal neglect obsolete persistent preliminary prevalent profound reinforce reluctant resilient retain skeptical suppress tentative undergo utilize verify'.split()
raw={r['单词'].strip().lower():r for r in rows};selected=[w for w,r in raw.items() if r['六级']=='★' and w!='esthetic'];targets=day1+[w for w in selected if w not in day1]
remaining=targets[50:];remaining.sort(key=lambda w:(raw[w].get('分类') or '其他',raw[w].get('子分类') or '',raw[w]['序号']));groups=[day1]+[remaining[i:i+50] for i in range(0,len(remaining),50)]
assert len(targets)==1289 and len(groups)==26
old=read('sources/groups.json');assert old==groups,'Group ordering changed; reconcile article authoring before rebuilding.'
vocab=[]
for w in targets:
 r=raw.get(w,{});d=ecd.get(w,{});meaning=r.get('释义') or re.split(r'\\+n',d.get('translation',''))[0];meaning=re.sub(r'^[a-z]+\.\s*','',meaning)
 entry={'word':w,'phonetic':d.get('phonetic',''),'pos':'','meaning':meaning,'forms':d.get('exchange',''),'source':'CETVocabulary' if r else 'Day1 supplement + ECDICT','cet6':r.get('六级')=='★','otherSpellings':r.get('其他拼写'),'category':r.get('分类'),'subcategory':r.get('子分类'),'frequency':r.get('词频'),'sourceRow':r.get('序号')}
 if w=='aesthetic':entry.update(otherSpellings='esthetic',mergedSourceRows=[raw[k]['序号'] for k in ['esthetic','aesthetic']])
 vocab.append(entry)
dump(vocab,'dist/data/vocabulary.json');dump(groups,'sources/groups.json');print('Target words:',len(targets),'articles:',len(groups),'last group:',len(groups[-1]))
