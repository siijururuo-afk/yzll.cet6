/* ============================================================
 * CET-6 Learning Workstation - Data Module
 * Vocabulary, Translation Exercises, Speaking Topics,
 * Daily News, Video Clips
 * ============================================================ */

// ========== CET-6 Core Vocabulary ==========
const VOCAB_DATA = [
  { word: "abandon", phonetic: "/əˈbændən/", pos: "v.", meaning: "放弃；遗弃", example: "He abandoned his career to take care of his family.", exampleTr: "他放弃了事业来照顾家人。", level: 6 },
  { word: "abolish", phonetic: "/əˈbɒlɪʃ/", pos: "v.", meaning: "废除；废止", example: "The government decided to abolish the old tax system.", exampleTr: "政府决定废除旧税制。", level: 6 },
  { word: "absurd", phonetic: "/əbˈsɜːd/", pos: "adj.", meaning: "荒谬的；荒唐的", example: "It would be absurd to spend so much money on a single meal.", exampleTr: "花这么多钱吃一顿饭是荒谬的。", level: 6 },
  { word: "accommodate", phonetic: "/əˈkɒmədeɪt/", pos: "v.", meaning: "容纳；提供住宿；适应", example: "The hotel can accommodate up to 500 guests.", exampleTr: "这家酒店最多可容纳500位客人。", level: 6 },
  { word: "accumulate", phonetic: "/əˈkjuːmjəleɪt/", pos: "v.", meaning: "积累；积聚", example: "She had accumulated a large amount of debt by the time she graduated.", exampleTr: "她毕业时已积累了大量债务。", level: 6 },
  { word: "adequate", phonetic: "/ˈædɪkwət/", pos: "adj.", meaning: "充足的；足够的；胜任的", example: "We need to ensure adequate food supplies for the winter.", exampleTr: "我们需要确保冬季充足的食物供应。", level: 6 },
  { word: "adhere", phonetic: "/ədˈhɪə(r)/", pos: "v.", meaning: "坚持；遵守；黏附", example: "All students must adhere to the rules of the school.", exampleTr: "所有学生必须遵守学校规定。", level: 6 },
  { word: "advocate", phonetic: "/ˈædvəkeɪt/", pos: "v./n.", meaning: "提倡；拥护；倡导者", example: "Many experts advocate a balanced approach to education.", exampleTr: "许多专家提倡均衡的教育方式。", level: 6 },
  { word: "agitate", phonetic: "/ˈædʒɪteɪt/", pos: "v.", meaning: "煽动；使不安", example: "The speech agitated the crowd into protest.", exampleTr: "演讲煽动了人群抗议。", level: 6 },
  { word: "alleviate", phonetic: "/əˈliːvieɪt/", pos: "v.", meaning: "减轻；缓和", example: "The new policy aims to alleviate poverty in rural areas.", exampleTr: "新政策旨在减轻农村地区的贫困。", level: 6 },
  { word: "ambiguous", phonetic: "/æmˈbɪɡjuəs/", pos: "adj.", meaning: "模棱两可的；含糊的", example: "His answer was deliberately ambiguous.", exampleTr: "他的回答故意含糊其辞。", level: 6 },
  { word: "anonymous", phonetic: "/əˈnɒnɪməs/", pos: "adj.", meaning: "匿名的；无名的", example: "The donation came from an anonymous benefactor.", exampleTr: "捐款来自一位匿名捐助者。", level: 6 },
  { word: "anticipate", phonetic: "/ænˈtɪsɪpeɪt/", pos: "v.", meaning: "预期；预料；期待", example: "We anticipate a significant increase in sales next quarter.", exampleTr: "我们预计下季度销售额将大幅增长。", level: 6 },
  { word: "apparatus", phonetic: "/ˌæpəˈreɪtəs/", pos: "n.", meaning: "器械；设备；机构", example: "The laboratory is equipped with modern apparatus.", exampleTr: "实验室配备了现代化设备。", level: 6 },
  { word: "arbitrary", phonetic: "/ˈɑːbɪtrəri/", pos: "adj.", meaning: "任意的；武断的", example: "The decision seemed completely arbitrary.", exampleTr: "这个决定看起来完全是武断的。", level: 6 },
  { word: "ascribe", phonetic: "/əˈskraɪb/", pos: "v.", meaning: "归因于；归于", example: "He ascribed his success to hard work and luck.", exampleTr: "他将成功归因于努力和运气。", level: 6 },
  { word: "assault", phonetic: "/əˈsɔːlt/", pos: "n./v.", meaning: "攻击；袭击", example: "The victim reported the assault to the police.", exampleTr: "受害者向警方报告了袭击事件。", level: 6 },
  { word: "assert", phonetic: "/əˈsɜːt/", pos: "v.", meaning: "断言；主张", example: "She asserted that she was innocent of all charges.", exampleTr: "她坚称自己无罪。", level: 6 },
  { word: "authentic", phonetic: "/ɔːˈθentɪk/", pos: "adj.", meaning: "真正的；真实的；真品的", example: "The painting was confirmed to be authentic.", exampleTr: "这幅画被确认是真品。", level: 6 },
  { word: "autonomy", phonetic: "/ɔːˈtɒnəmi/", pos: "n.", meaning: "自治；自主权", example: "The region was granted greater autonomy.", exampleTr: "该地区获得了更大的自治权。", level: 6 },
  { word: "baffle", phonetic: "/ˈbæfl/", pos: "v.", meaning: "使困惑；难住", example: "The puzzle baffled even the most experienced detectives.", exampleTr: "这个谜题连最有经验的侦探也困惑了。", level: 6 },
  { word: "barren", phonetic: "/ˈbærən/", pos: "adj.", meaning: "贫瘠的；荒芜的", example: "The land was too barren to support any crops.", exampleTr: "这片土地太贫瘠，无法种植任何作物。", level: 6 },
  { word: "bewilder", phonetic: "/bɪˈwɪldə(r)/", pos: "v.", meaning: "使迷惑；使不知所措", example: "The complex instructions bewildered the new employee.", exampleTr: "复杂的说明让新员工不知所措。", level: 6 },
  { word: "boost", phonetic: "/buːst/", pos: "v./n.", meaning: "推动；提升；增加", example: "The new policy boosted the economy significantly.", exampleTr: "新政策大幅推动了经济。", level: 6 },
  { word: "boycott", phonetic: "/ˈbɔɪkɒt/", pos: "v./n.", meaning: "抵制；拒绝参加", example: "Consumers boycotted the company's products.", exampleTr: "消费者抵制了该公司的产品。", level: 6 },
  { word: "breach", phonetic: "/briːtʃ/", pos: "n./v.", meaning: "违背；破坏；缺口", example: "The company was sued for breach of contract.", exampleTr: "公司因违约被起诉。", level: 6 },
  { word: "bureaucracy", phonetic: "/bjʊəˈrɒkrəsi/", pos: "n.", meaning: "官僚主义；官僚体制", example: "Reform is needed to reduce unnecessary bureaucracy.", exampleTr: "需要改革以减少不必要的官僚主义。", level: 6 },
  { word: "cater", phonetic: "/ˈkeɪtə(r)/", pos: "v.", meaning: "迎合；提供饮食", example: "The restaurant caters to vegetarians and vegans.", exampleTr: "这家餐厅为素食者和纯素食者提供服务。", level: 6 },
  { word: "chronic", phonetic: "/ˈkrɒnɪk/", pos: "adj.", meaning: "慢性的；长期的", example: "She suffers from chronic back pain.", exampleTr: "她患有慢性背痛。", level: 6 },
  { word: "circulation", phonetic: "/ˌsɜːkjəˈleɪʃn/", pos: "n.", meaning: "循环；流通；发行量", example: "The newspaper has a daily circulation of 200,000.", exampleTr: "这份报纸的日发行量为20万份。", level: 6 },
  { word: "coherent", phonetic: "/kəʊˈhɪərənt/", pos: "adj.", meaning: "连贯的；一致的", example: "She presented a coherent argument in her essay.", exampleTr: "她在文章中提出了连贯的论点。", level: 6 },
  { word: "commemorate", phonetic: "/kəˈmeməreɪt/", pos: "v.", meaning: "纪念；庆祝", example: "A statue was erected to commemorate the hero.", exampleTr: "竖立了一座雕像来纪念这位英雄。", level: 6 },
  { word: "compatible", phonetic: "/kəmˈpætəbl/", pos: "adj.", meaning: "兼容的；能共处的", example: "The software is compatible with all major operating systems.", exampleTr: "该软件与所有主流操作系统兼容。", level: 6 },
  { word: "compile", phonetic: "/kəmˈpaɪl/", pos: "v.", meaning: "编纂；汇编；收集", example: "The team compiled data from multiple sources.", exampleTr: "团队从多个来源收集了数据。", level: 6 },
  { word: "comply", phonetic: "/kəmˈplaɪ/", pos: "v.", meaning: "遵从；依从；服从", example: "All employees must comply with safety regulations.", exampleTr: "所有员工必须遵守安全规定。", level: 6 },
  { word: "conceive", phonetic: "/kənˈsiːv/", pos: "v.", meaning: "构想；设想；怀孕", example: "He conceived a plan to improve efficiency.", exampleTr: "他构想了一个提高效率的计划。", level: 6 },
  { word: "consensus", phonetic: "/kənˈsensəs/", pos: "n.", meaning: "共识；一致意见", example: "The committee reached a consensus on the new policy.", exampleTr: "委员会对新政策达成了一致意见。", level: 6 },
  { word: "contemplate", phonetic: "/ˈkɒntəmpleɪt/", pos: "v.", meaning: "沉思；细想", example: "She contemplated the consequences of her decision.", exampleTr: "她深思了自己决定的后果。", level: 6 },
  { word: "controversy", phonetic: "/ˈkɒntrəvɜːsi/", pos: "n.", meaning: "争议；争论", example: "The new law sparked widespread controversy.", exampleTr: "新法律引发了广泛的争议。", level: 6 },
  { word: "correspondence", phonetic: "/ˌkɒrəˈspɒndəns/", pos: "n.", meaning: "通信；对应；一致", example: "The professor maintained correspondence with his students.", exampleTr: "教授与学生保持通信。", level: 6 },
  { word: "credential", phonetic: "/krəˈdenʃl/", pos: "n.", meaning: "资格证明；证书", example: "Applicants must submit their academic credentials.", exampleTr: "申请人必须提交学历证明。", level: 6 },
  { word: "crucial", phonetic: "/ˈkruːʃl/", pos: "adj.", meaning: "至关重要的；关键的", example: "Sleep plays a crucial role in memory consolidation.", exampleTr: "睡眠在记忆巩固中起着至关重要的作用。", level: 6 },
  { word: "deduce", phonetic: "/dɪˈdjuːs/", pos: "v.", meaning: "推断；演绎", example: "From the evidence, we can deduce that he was lying.", exampleTr: "从证据中我们可以推断他在撒谎。", level: 6 },
  { word: "deficiency", phonetic: "/dɪˈfɪʃnsi/", pos: "n.", meaning: "缺乏；不足；缺陷", example: "Vitamin D deficiency can lead to bone problems.", exampleTr: "维生素D缺乏会导致骨骼问题。", level: 6 },
  { word: "degenerate", phonetic: "/dɪˈdʒenəreɪt/", pos: "v./adj.", meaning: "退化；堕落；退化的", example: "The discussion degenerated into a heated argument.", exampleTr: "讨论退变成激烈的争吵。", level: 6 },
  { word: "deliberate", phonetic: "/dɪˈlɪbərət/", pos: "adj./v.", meaning: "故意的；深思熟虑的", example: "His remarks were a deliberate attempt to provoke her.", exampleTr: "他的话是故意激怒她的。", level: 6 },
  { word: "deprive", phonetic: "/dɪˈpraɪv/", pos: "v.", meaning: "剥夺；使丧失", example: "The war deprived many children of their education.", exampleTr: "战争剥夺了许多儿童受教育的权利。", level: 6 },
  { word: "deteriorate", phonetic: "/dɪˈtɪəriəreɪt/", pos: "v.", meaning: "恶化；变坏", example: "His health deteriorated rapidly after the surgery.", exampleTr: "手术后他的健康状况迅速恶化。", level: 6 },
  { word: "dilemma", phonetic: "/dɪˈlemə/", pos: "n.", meaning: "困境；进退两难", example: "She faced the dilemma of choosing between career and family.", exampleTr: "她面临着事业和家庭之间的两难选择。", level: 6 },
  { word: "discrimination", phonetic: "/dɪˌskrɪmɪˈneɪʃn/", pos: "n.", meaning: "歧视；区别", example: "Workplace discrimination based on gender is illegal.", exampleTr: "基于性别的职场歧视是违法的。", level: 6 },
  { word: "dispose", phonetic: "/dɪˈspəʊz/", pos: "v.", meaning: "处理；处置；布置", example: "The factory must dispose of its waste properly.", exampleTr: "工厂必须妥善处理其废物。", level: 6 },
  { word: "distinct", phonetic: "/dɪˈstɪŋkt/", pos: "adj.", meaning: "明显的；不同的；明确的", example: "There is a distinct difference between the two approaches.", exampleTr: "这两种方法之间有明显的区别。", level: 6 },
  { word: "divert", phonetic: "/daɪˈvɜːt/", pos: "v.", meaning: "转移；使转向；娱乐", example: "Traffic was diverted to a side road.", exampleTr: "交通被引向一条侧路。", level: 6 },
  { word: "donate", phonetic: "/dəʊˈneɪt/", pos: "v.", meaning: "捐赠；捐献", example: "He donated a large sum of money to the charity.", exampleTr: "他向慈善机构捐赠了一大笔钱。", level: 6 },
  { word: "dwell", phonetic: "/dwel/", pos: "v.", meaning: "居住；细想", example: "Don't dwell on past mistakes; look forward.", exampleTr: "不要纠结于过去的错误，向前看。", level: 6 },
  { word: "eligible", phonetic: "/ˈelɪdʒəbl/", pos: "adj.", meaning: "有资格的；符合条件的", example: "Only senior students are eligible to apply for the scholarship.", exampleTr: "只有高年级学生才有资格申请奖学金。", level: 6 },
  { word: "eliminate", phonetic: "/ɪˈlɪmɪneɪt/", pos: "v.", meaning: "消除；淘汰；排除", example: "The new filter can eliminate harmful bacteria from water.", exampleTr: "新过滤器可以消除水中的有害细菌。", level: 6 },
  { word: "endeavor", phonetic: "/ɪnˈdevə(r)/", pos: "n./v.", meaning: "努力；尽力；尝试", example: "We should endeavor to maintain a healthy lifestyle.", exampleTr: "我们应该努力保持健康的生活方式。", level: 6 },
  { word: "endure", phonetic: "/ɪnˈdjʊə(r)/", pos: "v.", meaning: "忍受；持久；持续", example: "She endured years of hardship before achieving success.", exampleTr: "她忍受了多年的艰苦才取得成功。", level: 6 },
  { word: "enhance", phonetic: "/ɪnˈhɑːns/", pos: "v.", meaning: "提高；增强；改善", example: "Technology has enhanced our ability to communicate globally.", exampleTr: "技术增强了我们全球沟通的能力。", level: 6 },
  { word: "essence", phonetic: "/ˈesns/", pos: "n.", meaning: "本质；精髓；精华", example: "Time management is of the essence in exam preparation.", exampleTr: "时间管理在考试准备中至关重要。", level: 6 },
  { word: "excerpt", phonetic: "/ˈeksɜːpt/", pos: "n.", meaning: "摘录；节选", example: "The teacher read an excerpt from the novel.", exampleTr: "老师读了小说的一个节选。", level: 6 },
  { word: "exclusive", phonetic: "/ɪkˈskluːsɪv/", pos: "adj.", meaning: "独有的；排外的；独家的", example: "The magazine obtained an exclusive interview with the star.", exampleTr: "该杂志获得了这位明星的独家采访。", level: 6 },
  { word: "exploit", phonetic: "/ɪkˈsplɔɪt/", pos: "v./n.", meaning: "利用；开发；剥削", example: "Companies must not exploit their workers.", exampleTr: "公司不得剥削其员工。", level: 6 },
  { word: "feasible", phonetic: "/ˈfiːzəbl/", pos: "adj.", meaning: "可行的；可能的", example: "The committee concluded that the plan was feasible.", exampleTr: "委员会得出结论认为该计划可行。", level: 6 },
  { word: "fluctuate", phonetic: "/ˈflʌktʃueɪt/", pos: "v.", meaning: "波动；起伏", example: "Oil prices fluctuate with global demand.", exampleTr: "石油价格随全球需求波动。", level: 6 },
  { word: "formulate", phonetic: "/ˈfɔːmjuleɪt/", pos: "v.", meaning: "制定；构想；系统阐述", example: "The team formulated a new marketing strategy.", exampleTr: "团队制定了新的营销策略。", level: 6 },
  { word: "fragile", phonetic: "/ˈfrædʒaɪl/", pos: "adj.", meaning: "脆弱的；易碎的", example: "The ceasefire remains fragile after weeks of tension.", exampleTr: "经过数周的紧张局势，停火仍然脆弱。", level: 6 },
  { word: "generate", phonetic: "/ˈdʒenəreɪt/", pos: "v.", meaning: "产生；发电；引起", example: "Solar panels generate electricity from sunlight.", exampleTr: "太阳能板利用阳光发电。", level: 6 },
  { word: "genuine", phonetic: "/ˈdʒenjuɪn/", pos: "adj.", meaning: "真正的；真诚的", example: "She showed genuine concern for the victims.", exampleTr: "她对受害者表现出真诚的关心。", level: 6 },
  { word: "harness", phonetic: "/ˈhɑːnɪs/", pos: "v./n.", meaning: "利用；驾驭；马具", example: "We must harness renewable energy sources.", exampleTr: "我们必须利用可再生能源。", level: 6 },
  { word: "heritage", phonetic: "/ˈherɪtɪdʒ/", pos: "n.", meaning: "遗产；传统", example: "The Great Wall is a part of China's cultural heritage.", exampleTr: "长城是中国文化遗产的一部分。", level: 6 },
  { word: "hypothesis", phonetic: "/haɪˈpɒθəsɪs/", pos: "n.", meaning: "假设；假说", example: "The experiment confirmed the initial hypothesis.", exampleTr: "实验证实了最初的假设。", level: 6 },
  { word: "imitate", phonetic: "/ˈɪmɪteɪt/", pos: "v.", meaning: "模仿；仿造", example: "Children often imitate their parents' behavior.", exampleTr: "孩子们经常模仿父母的行为。", level: 6 },
  { word: "impose", phonetic: "/ɪmˈpəʊz/", pos: "v.", meaning: "强加；征收；施加", example: "The government imposed new restrictions on imports.", exampleTr: "政府对进口征收了新限制。", level: 6 },
  { word: "incentive", phonetic: "/ɪnˈsentɪv/", pos: "n.", meaning: "激励；刺激；动机", example: "Tax cuts served as an incentive for small businesses.", exampleTr: "减税对小企业起到了激励作用。", level: 6 },
  { word: "incorporate", phonetic: "/ɪnˈkɔːpəreɪt/", pos: "v.", meaning: "合并；包含；纳入", example: "The new design incorporates elements of traditional architecture.", exampleTr: "新设计融入了传统建筑元素。", level: 6 },
  { word: "indispensable", phonetic: "/ˌɪndɪˈspensəbl/", pos: "adj.", meaning: "不可或缺的；必需的", example: "Water is indispensable for all forms of life.", exampleTr: "水对所有生命形式都是不可或缺的。", level: 6 },
  { word: "induce", phonetic: "/ɪnˈdjuːs/", pos: "v.", meaning: "诱导；引起；引诱", example: "Stress can induce various health problems.", exampleTr: "压力会引发各种健康问题。", level: 6 },
  { word: "inflict", phonetic: "/ɪnˈflɪkt/", pos: "v.", meaning: "施加；使遭受", example: "The storm inflicted heavy damage on the coastal town.", exampleTr: "暴风雨给沿海城镇造成了严重破坏。", level: 6 },
  { word: "inherent", phonetic: "/ɪnˈhɪərənt/", pos: "adj.", meaning: "固有的；内在的", example: "There are inherent risks in any investment.", exampleTr: "任何投资都有固有风险。", level: 6 },
  { word: "initiate", phonetic: "/ɪˈnɪʃieɪt/", pos: "v.", meaning: "发起；开始；创始", example: "The company initiated a new training program.", exampleTr: "公司启动了新的培训项目。", level: 6 },
  { word: "innovate", phonetic: "/ˈɪnəveɪt/", pos: "v.", meaning: "创新；改革", example: "Companies must innovate to stay competitive.", exampleTr: "公司必须创新以保持竞争力。", level: 6 },
  { word: "integrate", phonetic: "/ˈɪntɪɡreɪt/", pos: "v.", meaning: "整合；融入；使一体化", example: "The school integrated technology into every classroom.", exampleTr: "学校将技术融入了每个教室。", level: 6 },
  { word: "intervene", phonetic: "/ˌɪntəˈviːn/", pos: "v.", meaning: "干预；介入；调停", example: "The UN intervened to restore peace in the region.", exampleTr: "联合国介入以恢复该地区的和平。", level: 6 },
  { word: "intricate", phonetic: "/ˈɪntrɪkət/", pos: "adj.", meaning: "复杂的；精细的", example: "The watch has an intricate mechanism with hundreds of parts.", exampleTr: "这只手表有由数百个零件组成的复杂机械结构。", level: 6 },
  { word: "intuition", phonetic: "/ˌɪntjuˈɪʃn/", pos: "n.", meaning: "直觉；直觉力", example: "She relied on her intuition when making the decision.", exampleTr: "她在做决定时依靠直觉。", level: 6 },
  { word: "invalid", phonetic: "/ɪnˈvælɪd/", pos: "adj.", meaning: "无效的；无根据的", example: "Your ticket is invalid after the expiration date.", exampleTr: "您的票在到期后无效。", level: 6 },
  { word: "investigate", phonetic: "/ɪnˈvestɪɡeɪt/", pos: "v.", meaning: "调查；研究", example: "The police are investigating the cause of the fire.", exampleTr: "警方正在调查火灾原因。", level: 6 },
  { word: "irritate", phonetic: "/ˈɪrɪteɪt/", pos: "v.", meaning: "激怒；刺激；使发炎", example: "His constant complaints irritated everyone around him.", exampleTr: "他不断的抱怨激怒了周围所有人。", level: 6 },
  { word: "justify", phonetic: "/ˈdʒʌstɪfaɪ/", pos: "v.", meaning: "证明正当；辩解", example: "How can you justify spending so much on a single project?", exampleTr: "你如何证明在一个项目上花这么多是合理的？", level: 6 },
  { word: "linger", phonetic: "/ˈlɪŋɡə(r)/", pos: "v.", meaning: "逗留；徘徊；拖延", example: "The smell of perfume lingered in the room.", exampleTr: "香水味在房间里久久不散。", level: 6 },
  { word: "litter", phonetic: "/ˈlɪtə(r)/", pos: "n./v.", meaning: "垃圾；杂物；乱丢", example: "Please do not litter in the park.", exampleTr: "请不要在公园里乱扔垃圾。", level: 6 },
  { word: "manifest", phonetic: "/ˈmænɪfest/", pos: "v./adj.", meaning: "表明；显现；明显的", example: "The disease manifests itself in various symptoms.", exampleTr: "这种疾病以各种症状表现出来。", level: 6 },
  { word: "manipulate", phonetic: "/məˈnɪpjuleɪt/", pos: "v.", meaning: "操纵；操作；利用", example: "He manipulated the data to support his theory.", exampleTr: "他操纵数据来支持自己的理论。", level: 6 },
  { word: "meditate", phonetic: "/ˈmedɪteɪt/", pos: "v.", meaning: "冥想；沉思", example: "She meditates every morning to reduce stress.", exampleTr: "她每天早上冥想来减压。", level: 6 },
  { word: "modify", phonetic: "/ˈmɒdɪfaɪ/", pos: "v.", meaning: "修改；调整；修饰", example: "The engineer modified the design to improve efficiency.", exampleTr: "工程师修改了设计以提高效率。", level: 6 },
  { word: "monopoly", phonetic: "/məˈnɒpəli/", pos: "n.", meaning: "垄断；专卖", example: "The company holds a monopoly on the technology.", exampleTr: "该公司对该技术拥有垄断权。", level: 6 },
  { word: "negotiate", phonetic: "/nɪˈɡəʊʃieɪt/", pos: "v.", meaning: "谈判；协商", example: "The two sides are negotiating a peace agreement.", exampleTr: "双方正在谈判和平协议。", level: 6 },
  { word: "notable", phonetic: "/ˈnəʊtəbl/", pos: "adj.", meaning: "显著的；著名的", example: "There has been a notable improvement in air quality.", exampleTr: "空气质量有了显著改善。", level: 6 },
  { word: "notion", phonetic: "/ˈnəʊʃn/", pos: "n.", meaning: "概念；观念；想法", example: "He has no notion of how difficult the task is.", exampleTr: "他不知道这个任务有多难。", level: 6 },
  { word: "obscure", phonetic: "/əbˈskjʊə(r)/", pos: "adj./v.", meaning: "模糊的；晦涩的；掩盖", example: "The meaning of the poem remains obscure.", exampleTr: "这首诗的含义仍然晦涩难懂。", level: 6 },
  { word: "obstacle", phonetic: "/ˈɒbstəkl/", pos: "n.", meaning: "障碍；阻碍", example: "Lack of funding was the main obstacle to the project.", exampleTr: "资金不足是该项目的主要障碍。", level: 6 },
  { word: "originate", phonetic: "/əˈrɪdʒɪneɪt/", pos: "v.", meaning: "起源于；发起；创造", example: "The tradition originated in ancient China.", exampleTr: "这一传统起源于古代中国。", level: 6 },
  { word: "overwhelm", phonetic: "/ˌəʊvəˈwelm/", pos: "v.", meaning: "压倒；淹没；使不知所措", example: "She was overwhelmed by the amount of work.", exampleTr: "她被大量的工作压垮了。", level: 6 },
  { word: "penalty", phonetic: "/ˈpenəlti/", pos: "n.", meaning: "惩罚；罚款；罚金", example: "The penalty for late submission is a 10% deduction.", exampleTr: "逾期提交的惩罚是扣减10%。", level: 6 },
  { word: "perceive", phonetic: "/pəˈsiːv/", pos: "v.", meaning: "察觉；感知；理解", example: "She perceived a change in his attitude.", exampleTr: "她察觉到了他态度的变化。", level: 6 },
  { word: "persist", phonetic: "/pəˈsɪst/", pos: "v.", meaning: "坚持；持续；存留", example: "The rain persisted throughout the night.", exampleTr: "雨持续了一整夜。", level: 6 },
  { word: "plausible", phonetic: "/ˈplɔːzəbl/", pos: "adj.", meaning: "貌似合理的；可信的", example: "His excuse sounded plausible but was actually false.", exampleTr: "他的借口听起来可信但实际是假的。", level: 6 },
  { word: "predominant", phonetic: "/prɪˈdɒmɪnənt/", pos: "adj.", meaning: "主要的；占主导的", example: "English is the predominant language in international business.", exampleTr: "英语是国际商务中的主要语言。", level: 6 },
  { word: "preliminary", phonetic: "/prɪˈlɪmɪnəri/", pos: "adj./n.", meaning: "初步的；预备的", example: "The preliminary results look promising.", exampleTr: "初步结果看起来很有希望。", level: 6 },
  { word: "preside", phonetic: "/prɪˈzaɪd/", pos: "v.", meaning: "主持；主导", example: "The judge presided over the trial.", exampleTr: "法官主持了审判。", level: 6 },
  { word: "prestige", phonetic: "/preˈstiːʒ/", pos: "n.", meaning: "威望；声望", example: "The university enjoys great prestige worldwide.", exampleTr: "该大学在世界范围内享有很高的声望。", level: 6 },
  { word: "prevalent", phonetic: "/ˈprevələnt/", pos: "adj.", meaning: "普遍的；流行的", example: "The flu is prevalent during winter months.", exampleTr: "流感在冬季很普遍。", level: 6 },
  { word: "primitive", phonetic: "/ˈprɪmətɪv/", pos: "adj.", meaning: "原始的；远古的", example: "Primitive humans used stone tools for hunting.", exampleTr: "原始人类使用石器狩猎。", level: 6 },
  { word: "profound", phonetic: "/prəˈfaʊnd/", pos: "adj.", meaning: "深刻的；深远的", example: "The discovery had a profound impact on science.", exampleTr: "这一发现对科学产生了深远的影响。", level: 6 },
  { word: "prolong", phonetic: "/prəˈlɒŋ/", pos: "v.", meaning: "延长；拖延", example: "Good sleep can prolong your lifespan.", exampleTr: "良好的睡眠可以延长寿命。", level: 6 },
  { word: "prosper", phonetic: "/ˈprɒspə(r)/", pos: "v.", meaning: "繁荣；兴旺；成功", example: "The small town prospered after the highway was built.", exampleTr: "高速公路建成后，小镇繁荣起来了。", level: 6 },
  { word: "pursue", phonetic: "/pəˈsjuː/", pos: "v.", meaning: "追求；继续；追赶", example: "She decided to pursue a career in medicine.", exampleTr: "她决定追求医学事业。", level: 6 },
  { word: "quote", phonetic: "/kwəʊt/", pos: "v./n.", meaning: "引用；报价", example: "The professor quoted a famous philosopher in his lecture.", exampleTr: "教授在讲座中引用了一位著名哲学家的话。", level: 6 },
  { word: "rectify", phonetic: "/ˈrektɪfaɪ/", pos: "v.", meaning: "纠正；矫正；修复", example: "We need to rectify the errors in the report immediately.", exampleTr: "我们需要立即纠正报告中的错误。", level: 6 },
  { word: "reluctant", phonetic: "/rɪˈlʌktənt/", pos: "adj.", meaning: "不情愿的；勉强的", example: "He was reluctant to admit his mistake.", exampleTr: "他不情愿承认自己的错误。", level: 6 },
  { word: "remedy", phonetic: "/ˈremədi/", pos: "n./v.", meaning: "补救；治疗；纠正", example: "A good remedy for insomnia is regular exercise.", exampleTr: "治疗失眠的好方法是经常锻炼。", level: 6 },
  { word: "render", phonetic: "/ˈrendə(r)/", pos: "v.", meaning: "致使；提供；渲染", example: "The explosion rendered the building unsafe.", exampleTr: "爆炸使大楼变得不安全。", level: 6 },
  { word: "reproduce", phonetic: "/ˌriːprəˈdjuːs/", pos: "v.", meaning: "繁殖；复制；再现", example: "The artist reproduced the landscape in stunning detail.", exampleTr: "艺术家以惊人的细节再现了这一景观。", level: 6 },
  { word: "resemble", phonetic: "/rɪˈzembl/", pos: "v.", meaning: "相似；类似于", example: "She closely resembles her mother in appearance.", exampleTr: "她在外貌上很像她的母亲。", level: 6 },
  { word: "resort", phonetic: "/rɪˈzɔːt/", pos: "n./v.", meaning: "求助；凭借；度假胜地", example: "As a last resort, they contacted a lawyer.", exampleTr: "作为最后的手段，他们联系了律师。", level: 6 },
  { word: "retrieve", phonetic: "/rɪˈtriːv/", pos: "v.", meaning: "取回；恢复；检索", example: "The system can retrieve data in seconds.", exampleTr: "该系统可以在几秒内检索数据。", level: 6 },
  { word: "scrutinize", phonetic: "/ˈskruːtənaɪz/", pos: "v.", meaning: "仔细检查；细阅", example: "The committee scrutinized every detail of the proposal.", exampleTr: "委员会仔细审查了提案的每个细节。", level: 6 },
  { word: "skeptical", phonetic: "/ˈskeptɪkl/", pos: "adj.", meaning: "怀疑的；多疑的", example: "Many people remain skeptical about the new technology.", exampleTr: "许多人对这项新技术仍持怀疑态度。", level: 6 },
  { word: "sovereign", phonetic: "/ˈsɒvrɪn/", pos: "adj./n.", meaning: "主权的；至高的；君主", example: "Every sovereign nation has the right to self-defense.", exampleTr: "每个主权国家都有自卫权。", level: 6 },
  { word: "speculate", phonetic: "/ˈspekjuleɪt/", pos: "v.", meaning: "推测；投机", example: "Analysts speculate that the market will recover next year.", exampleTr: "分析师推测市场将在明年复苏。", level: 6 },
  { word: "stimulate", phonetic: "/ˈstɪmjuleɪt/", pos: "v.", meaning: "刺激；激励；促进", example: "Coffee can stimulate the nervous system.", exampleTr: "咖啡可以刺激神经系统。", level: 6 },
  { word: "submit", phonetic: "/səbˈmɪt/", pos: "v.", meaning: "提交；屈服；递交", example: "All applications must be submitted by Friday.", exampleTr: "所有申请必须在周五前提交。", level: 6 },
  { word: "subsequent", phonetic: "/ˈsʌbsɪkwənt/", pos: "adj.", meaning: "随后的；后来的", example: "Subsequent events proved his theory correct.", exampleTr: "随后的事件证明了他的理论是正确的。", level: 6 },
  { word: "suppress", phonetic: "/səˈpres/", pos: "v.", meaning: "压制；抑制；镇压", example: "The government suppressed the rebellion quickly.", exampleTr: "政府迅速镇压了叛乱。", level: 6 },
  { word: "sustain", phonetic: "/səˈsteɪn/", pos: "v.", meaning: "维持；持续；承受", example: "The economy cannot sustain such rapid growth indefinitely.", exampleTr: "经济无法无限期维持如此快速的增长。", level: 6 },
  { word: "tackle", phonetic: "/ˈtækl/", pos: "v./n.", meaning: "处理；对付；解决", example: "We must tackle the problem of pollution urgently.", exampleTr: "我们必须紧急处理污染问题。", level: 6 },
  { word: "tedious", phonetic: "/ˈtiːdiəs/", pos: "adj.", meaning: "乏味的；单调的", example: "The data entry task was long and tedious.", exampleTr: "数据录入任务又长又乏味。", level: 6 },
  { word: "tempt", phonetic: "/tempt/", pos: "v.", meaning: "引诱；诱惑", example: "The warm weather tempted us to go outside.", exampleTr: "温暖的天气引诱我们外出。", level: 6 },
  { word: "terminate", phonetic: "/ˈtɜːmɪneɪt/", pos: "v.", meaning: "终止；结束", example: "The company terminated his employment contract.", exampleTr: "公司终止了他的雇佣合同。", level: 6 },
  { word: "threshold", phonetic: "/ˈθreʃhəʊld/", pos: "n.", meaning: "门槛；临界点；起点", example: "The nation has crossed the threshold of economic development.", exampleTr: "该国已跨越经济发展的门槛。", level: 6 },
  { word: "tolerate", phonetic: "/ˈtɒləreɪt/", pos: "v.", meaning: "容忍；忍受", example: "The teacher will not tolerate cheating in the exam.", exampleTr: "老师不会容忍考试中的作弊行为。", level: 6 },
  { word: "transit", phonetic: "/ˈtrænsɪt/", pos: "n.", meaning: "运输；过境； transit", example: "The city is improving its public transit system.", exampleTr: "该市正在改善其公共交通系统。", level: 6 },
  { word: "trigger", phonetic: "/ˈtrɪɡə(r)/", pos: "v./n.", meaning: "触发；引起；扳机", example: "Certain foods can trigger allergic reactions.", exampleTr: "某些食物会引发过敏反应。", level: 6 },
  { word: "underlying", phonetic: "/ˌʌndəˈlaɪɪŋ/", pos: "adj.", meaning: "潜在的；根本的", example: "The underlying cause of the problem was poor management.", exampleTr: "问题的根本原因是管理不善。", level: 6 },
  { word: "undermine", phonetic: "/ˌʌndəˈmaɪn/", pos: "v.", meaning: "破坏；削弱；损害", example: "His constant criticism undermined her confidence.", exampleTr: "他不断的批评削弱了她的信心。", level: 6 },
  { word: "utilize", phonetic: "/ˈjuːtəlaɪz/", pos: "v.", meaning: "利用；使用", example: "The factory utilizes solar energy for power.", exampleTr: "该工厂利用太阳能供电。", level: 6 },
  { word: "vanish", phonetic: "/ˈvænɪʃ/", pos: "v.", meaning: "消失；突然不见", example: "The traditional custom is vanishing in modern times.", exampleTr: "这一传统习俗在现代社会正在消失。", level: 6 },
  { word: "verdict", phonetic: "/ˈvɜːdɪkt/", pos: "n.", meaning: "裁决；判决；判断", example: "The jury reached a unanimous verdict of guilty.", exampleTr: "陪审团一致裁定有罪。", level: 6 },
  { word: "violate", phonetic: "/ˈvaɪəleɪt/", pos: "v.", meaning: "违反；违背；侵犯", example: "The company violated environmental regulations.", exampleTr: "该公司违反了环境法规。", level: 6 },
  { word: "vulnerable", phonetic: "/ˈvʌlnərəbl/", pos: "adj.", meaning: "脆弱的；易受伤害的", example: "Elderly people are particularly vulnerable to the virus.", exampleTr: "老年人尤其容易感染该病毒。", level: 6 },
  { word: "warrant", phonetic: "/ˈwɒrənt/", pos: "n./v.", meaning: "保证；逮捕令；证明正当", example: "The situation warrants immediate attention.", exampleTr: "这种情况需要立即关注。", level: 6 },
  { word: "yield", phonetic: "/jiːld/", pos: "v./n.", meaning: "产出；屈服；产量", example: "The research yielded unexpected results.", exampleTr: "研究产生了意想不到的结果。", level: 6 }
];

// ========== CET-6 Translation Exercises ==========
const TRANSLATION_DATA = [
  {
    id: "trans-1",
    year: "2023年6月",
    title: "中国航天事业",
    passage: "中国航天事业自创立以来，取得了举世瞩目的成就。从第一颗人造卫星发射成功，到载人航天飞行圆满完成，再到月球探测工程的顺利实施，中国航天人不断突破技术壁垒。近年来，中国空间站正式投入使用，标志着中国成为世界上少数几个能够独立建造和运营空间站的国家之一。航天事业的发展不仅推动了科技进步，也激发了全民的科学热情，为人类探索宇宙奥秘作出了重要贡献。",
    reference: "Since its inception, China's aerospace industry has achieved remarkable successes that have attracted worldwide attention. From the successful launch of the first artificial satellite, to the successful completion of manned spaceflight, and the smooth implementation of the lunar exploration project, Chinese aerospace engineers have continuously broken through technological barriers. In recent years, the official completion and operation of China's space station marks that China has become one of the few countries in the world capable of independently building and operating a space station. The development of the aerospace industry has not only promoted technological progress but also sparked nationwide enthusiasm for science, making an important contribution to humanity's exploration of the mysteries of the universe.",
    keyPoints: [
      "举世瞩目的成就 -> remarkable successes that have attracted worldwide attention",
      "载人航天飞行 -> manned spaceflight",
      "技术壁垒 -> technological barriers",
      "正式投入使用 -> official completion and operation",
      "少数几个 -> one of the few",
      "科学热情 -> enthusiasm for science"
    ]
  },
  {
    id: "trans-2",
    year: "2022年12月",
    title: "中国茶文化",
    passage: "中国是茶的故乡，茶文化源远流长。据史料记载，中国人种茶、饮茶的历史已有数千年。茶不仅是一种饮品，更是一种文化载体。从古代丝绸之路上的茶叶贸易，到今天遍布全球的茶馆，茶文化已成为中华文化的重要组成部分。中国人讲究茶道，注重泡茶的水温、茶具的选择以及饮茶的礼仪。在快节奏的现代生活中，品茶成为人们放松身心、品味生活的一种方式。",
    reference: "China is the homeland of tea, and its tea culture has a long and profound history. According to historical records, the history of tea cultivation and consumption in China dates back thousands of years. Tea is not merely a beverage but also a cultural carrier. From the tea trade along the ancient Silk Road to the tea houses scattered across the globe today, tea culture has become an important component of Chinese culture. The Chinese pay great attention to the way of tea, focusing on the water temperature for brewing, the selection of tea utensils, and the etiquette of tea drinking. In the fast-paced modern life, enjoying tea has become a way for people to relax and savor life.",
    keyPoints: [
      "茶的故乡 -> the homeland of tea",
      "源远流长 -> has a long and profound history",
      "文化载体 -> cultural carrier",
      "丝绸之路 -> the Silk Road",
      "讲究茶道 -> pay great attention to the way of tea",
      "放松身心 -> relax (body and mind)"
    ]
  },
  {
    id: "trans-3",
    year: "2022年6月",
    title: "中国的高铁发展",
    passage: "中国高铁建设始于二十一世纪初，经过二十多年的发展，已成为世界上高铁运营里程最长的国家。中国高铁以其速度快、安全性高、服务优质而闻名。高铁网络的不断完善，极大地缩短了城市之间的时空距离，促进了区域经济一体化。如今，乘坐高铁出行已成为中国人的首选交通方式之一。中国高铁技术也在走向世界，为多个国家提供了铁路建设方案。",
    reference: "China's high-speed rail construction began in the early 21st century. After more than two decades of development, China has become the country with the longest high-speed rail operating mileage in the world. China's high-speed rail is renowned for its high speed, safety, and quality service. The continuous improvement of the high-speed rail network has greatly shortened the spatial and temporal distances between cities and promoted regional economic integration. Today, traveling by high-speed rail has become one of the preferred transportation methods for Chinese people. China's high-speed rail technology is also going global, providing railway construction solutions for multiple countries.",
    keyPoints: [
      "运营里程最长 -> the longest operating mileage",
      "速度快、安全性高 -> high speed, safety",
      "时空距离 -> spatial and temporal distances",
      "区域经济一体化 -> regional economic integration",
      "首选交通方式 -> preferred transportation method",
      "走向世界 -> going global"
    ]
  },
  {
    id: "trans-4",
    year: "2021年12月",
    title: "中国传统医学",
    passage: "中国传统医学有着数千年的历史，是中华民族宝贵的文化遗产。中医强调整体观念，认为人体是一个有机整体，疾病是人体阴阳失衡的表现。中医的诊断方法包括望、闻、问、切四种，通过观察患者的面色、舌苔、脉象等来判断病情。针灸、推拿、中药是中医的主要治疗手段。近年来，中医药在国际上的影响力不断扩大，越来越多的国家开始认可并研究中医药的独特价值。",
    reference: "Traditional Chinese Medicine (TCM) has a history of thousands of years and is a precious cultural heritage of the Chinese nation. TCM emphasizes the holistic concept, holding that the human body is an organic whole and that diseases are manifestations of the imbalance between yin and yang in the body. The diagnostic methods of TCM include four approaches: observation, auscultation and olfaction, inquiry, and pulse-taking, through which practitioners assess a patient's condition by observing their complexion, tongue coating, and pulse. Acupuncture, massage, and herbal medicine are the primary therapeutic methods of TCM. In recent years, the international influence of TCM has been expanding, with an increasing number of countries beginning to recognize and study the unique value of traditional Chinese medicine.",
    keyPoints: [
      "整体观念 -> holistic concept",
      "有机整体 -> organic whole",
      "阴阳失衡 -> imbalance between yin and yang",
      "望闻问切 -> observation, auscultation and olfaction, inquiry, and pulse-taking",
      "面色、舌苔、脉象 -> complexion, tongue coating, and pulse",
      "针灸、推拿、中药 -> acupuncture, massage, and herbal medicine"
    ]
  },
  {
    id: "trans-5",
    year: "2021年6月",
    title: "中国脱贫攻坚",
    passage: "中国脱贫攻坚战取得了全面胜利，这是人类减贫史上的伟大壮举。在过去几十年里，中国使数亿农村贫困人口成功脱贫，提前十年实现了联合国2030年可持续发展议程中的减贫目标。中国的脱贫攻坚不仅注重经济扶持，更强调教育扶贫、健康扶贫和生态扶贫。通过发展特色产业、改善基础设施、提供医疗保障等多种措施，贫困地区的人民生活水平得到了显著提高。",
    reference: "China has achieved a comprehensive victory in its battle against poverty, which is a great feat in the history of human poverty reduction. Over the past few decades, China has successfully lifted hundreds of millions of rural poor people out of poverty, achieving the poverty reduction target in the United Nations 2030 Agenda for Sustainable Development ten years ahead of schedule. China's poverty alleviation efforts focus not only on economic support but also on poverty reduction through education, healthcare, and ecological initiatives. Through various measures such as developing distinctive industries, improving infrastructure, and providing medical guarantees, the living standards of people in impoverished areas have been significantly improved.",
    keyPoints: [
      "全面胜利 -> comprehensive victory",
      "人类减贫史 -> history of human poverty reduction",
      "脱贫 -> lift out of poverty",
      "提前十年 -> ten years ahead of schedule",
      "可持续发展议程 -> Agenda for Sustainable Development",
      "教育扶贫、健康扶贫 -> poverty reduction through education, healthcare",
      "特色产业 -> distinctive industries"
    ]
  }
];

// ========== CET-SET6 Speaking Topics ==========
const SPEAKING_DATA = {
  part1_selfIntro: {
    title: "Part 1 - Self Introduction",
    description: "自我介绍 (约1.5分钟)",
    topics: [
      { id: "si-1", prompt: "Please introduce yourself, including your name, major, university, hobbies, and why you want to take CET-6.", sampleAnswer: "Good morning. My name is Li Ming. I am a junior student majoring in Computer Science at Tsinghua University. I enjoy reading science fiction and playing basketball in my spare time. I am taking the CET-6 exam because I believe a high level of English proficiency is essential for my future career in technology, especially since many cutting-edge research papers are published in English." },
      { id: "si-2", prompt: "Introduce yourself and talk about a challenge you have overcome in your university life.", sampleAnswer: "Hello, my name is Wang Fang. I am a third-year student studying International Trade at Fudan University. One of the biggest challenges I faced was overcoming my fear of public speaking. During my freshman year, I could barely present in front of the class. By joining the debate club and practicing regularly, I gradually became more confident. Now, I can comfortably deliver presentations and even mentor younger students." },
      { id: "si-3", prompt: "Introduce yourself and describe your hometown to the examiner.", sampleAnswer: "Good afternoon. I am Zhang Wei, a senior studying Environmental Engineering at Zhejiang University. I come from Chengdu, a vibrant city in southwestern China known for its spicy cuisine, giant pandas, and relaxed lifestyle. Growing up there has shaped my interest in environmental protection, as I witnessed the rapid urbanization and its impact on local ecosystems. This motivated me to pursue a career in environmental sustainability." }
    ]
  },
  part2_reading: {
    title: "Part 2 - Reading Aloud",
    description: "短文朗读 (约1.5分钟)",
    topics: [
      { id: "rd-1", prompt: "Read the following passage aloud:", passage: "In today's rapidly changing world, the ability to adapt has become more important than ever. Technology is reshaping every aspect of our lives, from the way we communicate to the way we work and learn. Those who embrace change and continuously update their skills are more likely to thrive in this dynamic environment. However, adaptation does not mean abandoning one's principles. Rather, it means finding new ways to apply timeless values in modern contexts." },
      { id: "rd-2", prompt: "Read the following passage aloud:", passage: "Education is not merely about acquiring knowledge; it is about developing the capacity to think critically and creatively. A well-rounded education equips individuals with the tools they need to navigate an increasingly complex world. It fosters curiosity, encourages innovation, and builds character. The most successful educational systems are those that balance academic rigor with personal development, preparing students not just for careers, but for meaningful lives." },
      { id: "rd-3", prompt: "Read the following passage aloud:", passage: "The concept of sustainable development has gained significant traction in recent years. It emphasizes meeting the needs of the present without compromising the ability of future generations to meet their own needs. This principle applies not only to environmental conservation but also to economic and social practices. Achieving sustainability requires collective effort from governments, businesses, and individuals alike, as the choices we make today will shape the world of tomorrow." }
    ]
  },
  part3_discussion: {
    title: "Part 3 - Personal Statement & Discussion",
    description: "个人陈述与互动讨论",
    topics: [
      { id: "dp-1", prompt: "Some people believe that artificial intelligence will eventually replace human workers in many industries. What is your opinion on this issue?", keywords: ["automation", "job displacement", "retraining", "human creativity", "collaboration"] },
      { id: "dp-2", prompt: "Do you think social media has a positive or negative impact on interpersonal relationships? Please explain your views.", keywords: ["connection", "isolation", "authenticity", "communication skills", "privacy"] },
      { id: "dp-3", prompt: "With the increasing popularity of online education, do you think traditional classrooms will eventually disappear? Why or why not?", keywords: ["face-to-face interaction", "flexibility", "engagement", "social skills", "blended learning"] },
      { id: "dp-4", prompt: "Many young people today experience anxiety and stress. What do you think are the main causes, and what can be done to address this issue?", keywords: ["academic pressure", "social media comparison", "mental health awareness", "work-life balance", "support systems"] },
      { id: "dp-5", prompt: "Some argue that globalization threatens local cultures. Do you agree or disagree? Please elaborate on your position.", keywords: ["cultural diversity", "cultural homogenization", "cultural exchange", "identity", "preservation"] },
      { id: "dp-6", prompt: "Should universities prioritize practical skills training or theoretical knowledge? Discuss both sides and give your opinion.", keywords: ["employability", "critical thinking", "real-world application", "foundational knowledge", "curriculum design"] }
    ]
  }
};

// ========== Daily News Data ==========
const NEWS_DATA = [
  {
    id: "news-1",
    title: "Scientists Discover New Method to Capture Carbon Dioxide from Atmosphere",
    summary: "A team of researchers has developed a novel material capable of capturing carbon dioxide directly from the air at significantly lower costs than existing technologies. The material, a modified metal-organic framework, can selectively trap CO2 molecules while allowing other gases to pass through. This breakthrough could play a crucial role in combating climate change, as removing existing carbon from the atmosphere is considered essential to meeting global temperature targets. The team is now working on scaling up the technology for industrial applications.",
    keywords: [
      { word: "novel", meaning: "adj. 新颖的；新奇的" },
      { word: "capture", meaning: "v. 捕获；捕捉" },
      { word: "framework", meaning: "n. 框架；结构" },
      { word: "selectively", meaning: "adv. 选择性地" },
      { word: "breakthrough", meaning: "n. 突破；重大发现" }
    ]
  },
  {
    id: "news-2",
    title: "Global Study Shows Reading Habits Improve Cognitive Function in Adults",
    summary: "A comprehensive international study has revealed that adults who read regularly demonstrate significantly better cognitive function compared to non-readers. The research, spanning twelve countries and tracking participants over a decade, found that even thirty minutes of daily reading can slow cognitive decline. Interestingly, both fiction and nonfiction yielded benefits, though fiction readers showed slightly stronger improvements in empathy and social cognition. Experts recommend incorporating reading into daily routines as a practical strategy for maintaining brain health.",
    keywords: [
      { word: "comprehensive", meaning: "adj. 全面的；综合的" },
      { word: "cognitive", meaning: "adj. 认知的" },
      { word: "span", meaning: "v. 横跨；涵盖" },
      { word: "decline", meaning: "n. 衰退；下降" },
      { word: "empathy", meaning: "n. 共情；同理心" }
    ]
  },
  {
    id: "news-3",
    title: "Renewable Energy Surpasses Fossil Fuels in Global Electricity Generation",
    summary: "For the first time in history, renewable energy sources have surpassed fossil fuels in global electricity generation, according to a report released by an international energy agency. Solar and wind power accounted for the majority of the increase, driven by declining costs and supportive government policies. The milestone was achieved earlier than many analysts had predicted. However, experts caution that significant challenges remain, including energy storage limitations and the need to upgrade power grids to handle intermittent renewable sources.",
    keywords: [
      { word: "surpass", meaning: "v. 超过；超越" },
      { word: "account for", meaning: "占据；占比例" },
      { word: "milestone", meaning: "n. 里程碑" },
      { word: "intermittent", meaning: "adj. 间歇的；断断续续的" },
      { word: "upgrade", meaning: "v. 升级；提升" }
    ]
  },
  {
    id: "news-4",
    title: "Research Links Urban Green Spaces to Reduced Mental Health Issues",
    summary: "New research from a leading public health institute has established a strong link between access to urban green spaces and reduced rates of anxiety and depression. The study surveyed over fifty thousand residents across twenty major cities worldwide. Findings indicate that individuals living within a ten-minute walk of a park or garden reported significantly lower stress levels. Urban planners are now incorporating these findings into city development strategies, prioritizing the creation and preservation of accessible green areas as a public health measure.",
    keywords: [
      { word: "establish", meaning: "v. 确立；证实" },
      { word: "access", meaning: "n. 接近；使用机会" },
      { word: "resident", meaning: "n. 居民" },
      { word: "incorporate", meaning: "v. 纳入；包含" },
      { word: "preservation", meaning: "n. 保存；保护" }
    ]
  },
  {
    id: "news-5",
    title: "Archaeologists Uncover Ancient Library Revealing Lost Knowledge",
    summary: "Archaeologists have unearthed an ancient library in the Mediterranean region containing well-preserved scrolls that date back over two thousand years. Early analysis suggests the texts cover a wide range of subjects, including philosophy, medicine, and astronomy, some of which appear to contain knowledge previously thought lost to history. Researchers are using advanced imaging techniques to read the fragile scrolls without unrolling them, a process that could take several years to complete. The discovery has generated considerable excitement in the academic community.",
    keywords: [
      { word: "unearth", meaning: "v. 发掘；出土" },
      { word: "preserve", meaning: "v. 保存；保护" },
      { word: "astronomy", meaning: "n. 天文学" },
      { word: "fragile", meaning: "adj. 脆弱的；易碎的" },
      { word: "considerable", meaning: "adj. 相当大的；可观的" }
    ]
  },
  {
    id: "news-6",
    title: "Study Finds Bilingual Speakers Show Greater Cognitive Flexibility",
    summary: "A longitudinal study has found that individuals who speak two or more languages demonstrate greater cognitive flexibility and enhanced problem-solving abilities compared to monolingual speakers. The research tracked participants from childhood through adulthood and found that bilingual individuals were better at switching between tasks and adapting to new situations. Furthermore, the benefits extended beyond language itself, suggesting that bilingualism may serve as a form of cognitive training that strengthens the brain's executive functions throughout life.",
    keywords: [
      { word: "longitudinal", meaning: "adj. 纵向的；长期的" },
      { word: "bilingual", meaning: "adj. 双语的" },
      { word: "flexibility", meaning: "n. 灵活性" },
      { word: "executive", meaning: "adj. 执行的" },
      { word: "monolingual", meaning: "adj. 单语的" }
    ]
  },
  {
    id: "news-7",
    title: "Artificial Intelligence System Achieves Breakthrough in Drug Discovery",
    summary: "An artificial intelligence system has successfully identified potential treatments for a rare disease in a fraction of the time typically required by traditional methods. The AI platform analyzed millions of molecular combinations and predicted which compounds would be most effective, a task that would have taken researchers years to accomplish manually. Several of the identified compounds have already entered preliminary clinical trials. This achievement represents a significant step forward in applying machine learning to pharmaceutical research, potentially accelerating the development of treatments for numerous conditions.",
    keywords: [
      { word: "identify", meaning: "v. 识别；鉴定" },
      { word: "fraction", meaning: "n. 小部分；分数" },
      { word: "molecular", meaning: "adj. 分子的" },
      { word: "compound", meaning: "n. 化合物" },
      { word: "preliminary", meaning: "adj. 初步的" }
    ]
  }
];

// ========== Daily Video Clips Data ==========
const VIDEO_DATA = [
  {
    id: "video-1",
    title: "The Big Bang Theory - Sheldon's Roommate Agreement",
    description: "Sheldon explains the detailed roommate agreement to Leonard, showcasing Sheldon's unique personality and communication style.",
    expressions: [
      { english: "I think you'll find that everything is in order.", chinese: "我想你会发现一切都很妥当。", note: "in order - 妥当；井然有序" },
      { english: "That's not how we do things around here.", chinese: "我们这儿不是这么做事的。", note: "around here - 在这里（表示习惯/规矩）" },
      { english: "I'm not saying I'm right, I'm just saying I'm not wrong.", chinese: "我不是说我对了，我只是说我没错。", note: "用于表达自己观点时的委婉坚持" }
    ]
  },
  {
    id: "video-2",
    title: "Friends - Ross's Sandwich",
    description: "Ross is upset because someone ate his Thanksgiving leftover sandwich at work, leading to one of the show's most memorable moments.",
    expressions: [
      { english: "Someone at work ate my sandwich.", chinese: "公司有人吃了我的三明治。", note: "简单直接地陈述事实，口语中常用简单句" },
      { english: "I put a note on it and someone still ate it.", chinese: "我在上面贴了便签，还是有人吃了它。", note: "still - 表示出乎意料的转折" },
      { english: "It's not just a sandwich, it's a turkey sandwich with a moistmaker.", chinese: "这不只是一个三明治，这是个有'保湿层'的火鸡三明治。", note: "moistmaker - Ross自创的词，幽默表达" }
    ]
  },
  {
    id: "video-3",
    title: "Sherlock - The Art of Deduction",
    description: "Sherlock Holmes demonstrates his remarkable deductive reasoning skills, explaining how he reads people and situations.",
    expressions: [
      { english: "You see, but you do not observe.", chinese: "你是在看，但你没有观察。", note: "see vs observe - 被动看见 vs 主动观察" },
      { english: "The distinction is clear.", chinese: "区别很明显。", note: "distinction - 区别；区分" },
      { english: "There's always something to be learned from every interaction.", chinese: "每次互动都能学到东西。", note: "interaction - 互动；交流" }
    ]
  },
  {
    id: "video-4",
    title: "The Crown - Leadership and Duty",
    description: "A scene exploring the tension between personal desires and public duty, as the monarch navigates a difficult decision.",
    expressions: [
      { english: "Duty must come before personal inclination.", chinese: "责任必须优先于个人意愿。", note: "inclination - 意愿；倾向" },
      { english: "I'm afraid that's not how it works.", chinese: "恐怕事情不是这样运作的。", note: "That's not how it works - 口语常用句型" },
      { english: "We do what is required of us, not what we wish to do.", chinese: "我们做的是被要求的事，而非我们想做的事。", note: "required of us - 被要求的" }
    ]
  },
  {
    id: "video-5",
    title: "Modern Family - Phil's Wisdom",
    description: "Phil Dunphy shares his uniquely positive outlook on life with his family, turning a challenge into an opportunity.",
    expressions: [
      { english: "When life gives you lemons, make lemonade.", chinese: "当生活给你柠檬时，就做柠檬水。", note: "经典英语谚语，意为化逆境为机遇" },
      { english: "I'm not saying it's going to be easy, but it's going to be worth it.", chinese: "我不是说这会很容易，但会是值得的。", note: "worth it - 值得的" },
      { english: "Every problem is an opportunity in disguise.", chinese: "每个问题都是伪装的机会。", note: "in disguise - 伪装的" }
    ]
  }
];

// ========== Ebbinghaus Review Intervals (in days) ==========
const REVIEW_INTERVALS = [0, 1, 2, 4, 7, 15, 30];

// ========== Export for use in app ==========
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { VOCAB_DATA, TRANSLATION_DATA, SPEAKING_DATA, NEWS_DATA, VIDEO_DATA, REVIEW_INTERVALS };
}
