"""Rebuild full source vocabulary and deterministic groups. No level filtering."""
import json,pathlib,collections,math
root=pathlib.Path(__file__).resolve().parents[1]
read=lambda p:json.loads((root/p).read_text())
def dump(x,p): (root/p).write_text(json.dumps(x,ensure_ascii=False,indent=2))
rows=read('sources/cet_full_list.json')['四六级词汇词频排序表'];ecd=read('sources/ecdict-selection.json');by=collections.defaultdict(list)
for row in rows:
 word=str(row.get('单词') or '').strip().lower()
 if not word:raise ValueError('Missing headword at source row '+str(row.get('序号')))
 by[word].append(row)
words=sorted(by,key=lambda w:(by[w][0].get('分类') or '其他',by[w][0].get('子分类') or '',by[w][0]['序号']))
groups=[words[i:i+50] for i in range(0,len(words),50)]
if (root/'sources/full-groups.json').exists():assert read('sources/full-groups.json')==groups,'Authored group order must be preserved'
vocab=[]
for word in words:
 rr=by[word];r=rr[0];d=ecd.get(word,{})
 vocab.append({'word':word,'phonetic':d.get('phonetic',''),'pos':'','meaning':'；'.join(dict.fromkeys(str(x.get('释义') or '') for x in rr)),'forms':d.get('exchange',''),'source':'CETVocabulary','cet6':any(x.get('六级')=='★' for x in rr),'otherSpellings':[x['其他拼写'] for x in rr if x.get('其他拼写')],'category':r.get('分类'),'subcategory':r.get('子分类'),'frequency':max(x.get('词频') or 0 for x in rr),'sourceRows':[x['序号'] for x in rr],'originalRecords':rr})
audit={'scope':'Entire CETVocabulary cet_full_list.json; all level flags included','sourceRows':len(rows),'targetWords':len(vocab),'totalTargetWords':len(vocab),'totalArticles':len(groups),'lastArticleTargetCount':len(groups[-1]),'duplicateRowsMerged':len(rows)-len(vocab),'mergedHeadwords':{w:[r['序号'] for r in rr] for w,rr in by.items() if len(rr)>1},'spellingVariants':'All distinct source headwords retained; alternate spellings preserved','multiwordTargets':[w for w in words if ' ' in w],'accentedTargets':[w for w in words if not w.isascii()],'sourceCommit':'7f21d0d9ad93c16a17849a24ccc4046e0f64c4af','noExternalTargetWords':True}
dump(vocab,'dist/data/vocabulary.json');dump(groups,'sources/full-groups.json');dump(audit,'sources/data-audit.json');dump(audit,'sources/full-scope-audit.json')
print('Full source rows:',len(rows),'unique targets:',len(vocab),'articles:',len(groups),'last group:',len(groups[-1]))
