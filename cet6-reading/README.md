# CET-6 文章背词网站

已一次性内置全部 26 篇原创双语文章；每个英文段落下面紧跟中文。Day 1–25 各 50 个目标词，Day 26 为 39 个，共 **1,289 个不同目标词**。章节编号不代表更新日期。阅读、查词均不调用 AI，不需要 API Key、数据库或付费服务。

## 打开

电脑：完整解压后，直接用浏览器打开 **dist/index.html**。保留 assets 和 data 文件夹，不要单独移动 HTML。网站会按需读取同目录的离线 JavaScript 数据副本，无需网络或本地服务器。

iPhone：优先在 Safari 打开已经部署的网站链接。iOS“文件”App 的 HTML 快速预览不等同于 Safari，可能不执行 JavaScript；若无法直接打开，请使用部署链接。网络版首次完整加载后会缓存文章和词典，支持离线阅读；缓存保留时间由浏览器决定。阅读记录保存在当前浏览器，换浏览器或清理数据不会保留。

也可以在项目目录运行：

```bash
python3 serve.py
```

然后打开 http://127.0.0.1:8000/ 。可用 `--host 0.0.0.0 --port 8000` 供同一局域网内手机访问。

## 使用

- 页面直接进入文章。目标词以黑色粗体显示，紧跟本文中文义。
- 每一个英文正文单词都可以点击。词典显示原形、音标、词性、中文释义和变形说明。
- 目标词额外显示本文句子和所在段落译文。Day 1 提供经人工整理的常见搭配及中文译义。
- 点击单词打开词典时自动调用浏览器 `speechSynthesis` 朗读原形；扬声器按钮可再次朗读，优先选择本机英语语音。是否能离线发声取决于设备是否安装英语语音，以及浏览器是否提供该功能；资料阅读和查词始终不需要外部接口。
- “全部文章”可跳转任何一篇，无锁定、测试或打卡要求。
- 自动保存上次章节和每篇滚动位置。

## 范围与来源

主数据：[exam-data/CETVocabulary](https://github.com/exam-data/CETVocabulary)，实际读取 `cet_full_list.json`，提交 `7f21d0d9ad93c16a17849a24ccc4046e0f64c4af`。

原文件是包含 `四六级词汇词频排序表` 数组的 JSON 对象。数组共 5,278 条；字段为 `序号、词频、六级、单词、释义、其他拼写、分类、子分类`，**没有音标和词性**。`六级: "★"` 是仓库标记的六级新增词，共 1,253 条；空值表示其他基础词，而不是新增六级词。

目标范围是“仓库六级标记词 + 用户指定 Day 1 的 50 词”。将 `esthetic` 与 `aesthetic` 合并为一个目标词后，六级标记词为 1,252 个；Day 1 另外补充 37 个不在标记范围内的词，故总数为 **1,289**。其中 12 个 Day 1 词在主文件没有原形词条，另 25 个有词条但无六级标记。这些补充词明确记录来源，没有伪称来自主词库。

完整主文件的基础词保留在即时词典，未被误计为六级新增目标词。拼写变体保留为元数据；源文件存在个别不标准或可疑的其他拼写，未自动把它们视为等价词。大小写、首尾空白已标准化，词形变化不另计目标词。

参考仓库：[AayuBal/cet-exams](https://github.com/AayuBal/cet-exams)，提交 `fcec49b83372539c92831989acbc2bd1b06aaac0`。实际阅读了 `public/cet/papers/cet6/2024-12-1.pdf` 的阅读部分，以及 `src/data/writing/cet6-writing.js` 等材料。新文章为原创，没有复制真题正文。

离线词典补充来自 [skywind3000/ECDICT](https://github.com/skywind3000/ECDICT) 和参考仓库的 CET 词汇文件。保存了生成所需的词典子集与字段。少量缺项在 `sources/dictionary-supplements.json` 中补充，`mindset` 与 `barracks` 的读音核对了 Cambridge Dictionary。ECDICT 的旧式音标符号做了显示标准化，部分条目仍保留其原有音标体系。简短本文义为人工按文章语境修订。

最终词典包含 **5,760 个词条**，正文及示例的 **3,486 种表面形式**有预计算映射。所有正文形式都有音标、词性和中文释义。规则与词典变形表共同覆盖复数、三单、过去式、过去分词、现在分词、比较级、最高级、常见不规则形式与所有格；同形多义词不能仅靠词形解决全部语境歧义。

## 完整性检查

安装 Node.js 后，在项目根目录运行：

```bash
node scripts/validate.js
```

检查从捆绑的原始词库重新计算目标范围，而非只相信 manifest。结果写入 `VALIDATION.json`，包括全部 14 项验收检查、词典覆盖和最后一组数量。静态阅读不需要 Node.js。

需重建同一数据时，Python 3 即可运行，不使用网络：

```bash
python3 scripts/prepare.py
python3 scripts/build-data.py
python3 scripts/package-offline.py
node scripts/validate.js
```

文章源稿位于 `sources/articles.txt`；项目运行时直接读取预先生成的 JSON。离线 `.js` 文件是同一份 JSON 的脚本副本，为直接打开 HTML 提供支持，并非 AI 生成器。只加载当前章节并插入 DOM，词典在初始化时加载一次。

## GitHub Pages

把 **dist 内的全部文件**放到 GitHub 仓库根目录，并在 Settings → Pages 选择对应分支的根目录。保留 assets、data 和 sw.js 相对路径即可。也可将 dist 发布到 gh-pages 分支。无需构建命令或后端。

## Vercel

导入整个项目，Framework Preset 选 Other，Build Command 留空，Output Directory 设置为 **dist**。不设置环境变量即可部署。也可直接上传 dist 的静态内容。

## 文件结构

- `dist/index.html`：网站入口
- `dist/assets/style.css`、`app.js`：样式与交互
- `dist/data/vocabulary.json`：全部唯一目标词及来源字段
- `dist/data/dictionary.json`：词典与原形映射
- `dist/data/manifest.json`：真实总数、文章目录与导航
- `dist/data/articles/day-001.json` 至 `day-026.json`：26 篇完整双语文章
- `dist/data/**/*.js`：与 JSON 对应的直接打开兼容副本
- `dist/sw.js`：网络版离线缓存
- `sources/`：词库快照、原稿、补充资料与来源审计
- `scripts/validate.js`：完整性校验
- `serve.py`：可选的零依赖本地服务器
- `VALIDATION.json`：实际运行校验报告
- `BROWSER-QA.json`：浏览器检查报告

## 许可

CETVocabulary 数据依 CC BY-NC-SA 4.0 使用，必须署名、非商业使用、相同方式共享。捆绑数据与原创学习文章按 CC BY-NC-SA 4.0 提供；网站代码按 MIT 提供。ECDICT 按其 MIT 许可提供，许可证原文位于 sources。请保留来源和许可说明。参考仓库只借鉴语言难度并使用其词汇字段，未复制试卷或其应用代码到本网站。
