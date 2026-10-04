# CET-6 全词库文章阅读与批注

完整处理 exam-data/CETVocabulary 的 `cet_full_list.json`，不按“六级新增”标记筛选。原文件 5,278 条记录，统一大小写、合并同名条目后为 **5,276 个目标词**。全部安排进 **106 篇原创双语文章**：前 105 篇各 50 个目标词，第 106 篇 26 个。原先指定的 Day 1 词表已取消；第一篇与其余文章均从源词库分组。

网站入口： https://siijururuo-afk.github.io/yzll.cet6/cet6-reading/dist/?v=full-v1

## 阅读与查词

每个英文段落后紧跟完整中文译文。本文目标词黑色粗体，词后直接显示简短中文本文义。正文英文词均可点击，打开词典立即朗读原形；扬声器按钮可再次朗读。词典显示音标、词性、中文释义、可识别的变形说明及目标词本文语境。语音由设备的 `speechSynthesis` 提供，是否离线可听取决于英语语音是否可用。核心阅读、查词和下一篇均不调用 AI。

章节显示“第一篇、第二篇……”；“全部文章”可以跳转任意一篇。自动保存当前文章和阅读位置，无测试、解锁或打卡。

## iPad 批注

工具栏提供：阅读、手写笔、半透明标记笔、橡皮、文字批注、撤销。

- 手写笔与标记笔：用 Apple Pencil、触控笔、手指或鼠标在正文段落上书写、划线或圈注。
- 书写模式会接管正文触控；需要滚动页面或点词查义时，切换“阅读”。
- 橡皮：点击笔画删除整个笔画，支持撤销。
- 文字批注：点击英文词或段落后输入笔记，保存后显示在段落下方；点击笔记可编辑或删除。
- 批注按文章自动保存在当前浏览器。重新打开会恢复；不同浏览器和设备之间不自动同步。清除浏览器网站数据会清除批注及阅读记录。
- 手写笔画使用矢量数据并跟随对应段落缩放。换方向或改变字号导致正文重新换行时，笔画与具体词的相对位置可能发生变化；文字批注仍锚定原段落。

采用 Safari 的 WebKit 引擎进行了模拟检查；没有声称在真实 iPad 或 Apple Pencil 硬件上测试。

## 直接打开及本地服务器

解压完整项目后，在电脑浏览器打开 `dist/index.html` 即可。保留 assets、data 文件夹；离线 JavaScript 数据副本按需加载当前文章，不需要网络。

iPad 优先使用 Safari 打开部署链接。iOS“文件”App 的 HTML 快速预览可能不执行 JavaScript；它并不等同于 Safari。网络版本首次完整加载会缓存文章和词典，缓存是否长期保留由浏览器决定。

可选服务器：

```bash
python3 serve.py
```

打开 http://127.0.0.1:8000/ 。同一局域网手机可使用 `python3 serve.py --host 0.0.0.0 --port 8000`。

## 数据范围与来源

主词库：[exam-data/CETVocabulary](https://github.com/exam-data/CETVocabulary)，实际源快照提交 `7f21d0d9ad93c16a17849a24ccc4046e0f64c4af`。原 JSON 顶层 `四六级词汇词频排序表`，字段包含序号、词频、六级、单词、释义、其他拼写、分类、子分类。

所有行均纳入，不过滤六级 `★`。`may / May` 与 `march / March` 归一为同名词条，保留原记录与不同词义；没有删除其月份义。源中独立的拼写变体仍保留为独立目标词，其他拼写作为元数据。完整保留 `according to`、`baby boom`、`ought to` 三个词组及带重音的 `résumé`，并支持其点击。源词库之外的词可自然出现在文章中，但不计入目标数。

分组按分类、子分类和原始序号排序，每 50 词一组。仅按主题帮助组织文章，不声称严格高频排序。所有文章均在交付前原创完成，未复制考试原文。

参考：[AayuBal/cet-exams](https://github.com/AayuBal/cet-exams)，实际读取提交 `fcec49b83372539c92831989acbc2bd1b06aaac0`，用于阅读难度、语境及词典数据参考。补充词典来自 [ECDICT](https://github.com/skywind3000/ECDICT)。主词库没有音标和词性，相关信息来自补充词典；缺失条目由编辑补充并标注来源。正文义由写作者按语境选择。ECDICT 的部分旧式音标作显示标准化。

## 验证与重建

```bash
python3 scripts/prepare.py
python3 scripts/refresh-dictionary.py
python3 scripts/build-data.py
python3 scripts/package-offline.py
node scripts/validate.js
```

资料已经全部内置，日常使用不需要运行这些命令。`refresh-dictionary.py` 可在提供完整 ECDICT CSV 时扩展正文词典；交付包含已经挑选好的词典快照，完全离线重建时可跳过此命令。

`validate.js` 从原始词库重新计算期望范围，检查全部目标数、篇数、每组数量、重复、遗漏、词正文出现、中文义、音标词性、正文词典覆盖、逐段翻译、JSON、manifest、连续编号、上一下一与第一篇来源一致性。真实运行结果保存到 `VALIDATION.json`。浏览器检查保存到 `BROWSER-QA.json` 与 `ANNOTATION-QA.json`。

## GitHub Pages / Vercel

当前完整项目位于你的 `siijururuo-afk/yzll.cet6` 仓库的 `cet6-reading/`，该仓库已有 GitHub Pages 从 main 根目录发布，入口位于 `cet6-reading/dist/`。

新仓库：把 dist 里的全部文件复制到仓库根目录，在 Settings → Pages 选择相应分支根目录；或把整个项目放在仓库子目录，访问该子目录下 dist 的入口。不需要后端和 API Key。

Vercel：导入项目，Framework Preset 选 Other，Build Command 留空，Output Directory 设 dist。

## 项目结构

- dist/index.html：入口；assets：样式、词典交互、批注工具。
- dist/data/vocabulary.json：完整目标词及全部原始记录。
- dist/data/dictionary.json：词典及正文词形映射。
- dist/data/manifest.json：真实目录、数量和导航。
- dist/data/articles/day-001.json … day-106.json：文章数据；文件名为内部编号，页面显示中文篇次。
- data 下同名 .js：直接打开时使用的离线数据副本。
- sources/full-articles：106 篇原创源稿；full-groups.json：固定分组。
- sources/cet_full_list.json：完整源快照；data-audit.json：范围审计。
- scripts：重建、验证和浏览器检查脚本；serve.py：可选本地服务器。

## 许可

CETVocabulary 词库依 CC BY-NC-SA 4.0 使用，需署名、非商业使用、相同方式共享。捆绑学习数据和原创文章按 CC BY-NC-SA 4.0 提供，网站代码 MIT。ECDICT 按其 MIT 许可提供。原许可说明保留在 sources 内；未复制参考仓库的考试原文或应用代码。
