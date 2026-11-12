// ============================================================
//  課程內容：《Neo4j 入門：一步一步做出你的第一張知識圖譜》EP1–EP6
//  欄位說明見 ~/.claude/skills/learning-series-pipeline/references/site_build.md
//  本系列額外欄位：
//    code      ：單元頂端的 Cypher 核心寫法（取代 formula 的 KaTeX 方塊）
//    terms[].c ：術語的 Cypher 寫法（取代 m 的數學符號）
//    筆記裡的程式碼：<pre class="cy" data-raw>…</pre> 會自動上色並加「複製」；加 class="plain" 不上色
//  Cypher 參數 $name 一律放在 <code> 或 <pre> 裡，避免被 KaTeX 當成數學式。
//  練習題答案都在 neo4j:2026.10.1-community（含 GDS 2026.10.1）實跑過。
// ============================================================
const R = String.raw;
const C = s => `<code class="ic">${s}</code>`;
const PRE = s => `<pre class="cy" data-raw>${s}</pre>`;
const PLAIN = s => `<pre class="cy plain" data-raw>${s}</pre>`;

window.SERIES = {
  title: "Neo4j 入門：一步一步做出你的第一張知識圖譜",
  short: "Neo4j 入門",
  brand: `Neo4j<b>→</b>入門<span class="long"> 學習網頁</span>`,
  storeKey: "progress-neo4j-intro-2026",
  eyebrow: "AI 架構師系列 · Graph Database · EP1–EP6",
  heroTitle: `用<span class="hl">圖</span>來想資料，<br>從朋友圈走到 GraphRAG`,
  lead: "6 集、每集約 15 分鐘。全程在自己電腦用 Docker 跑 Neo4j，每一行 Cypher 都能照打出和影片一樣的結果。從手打 5 個節點開始，最後把文件抽成知識圖譜，讓大型語言模型沿著圖找答案。",
  tagline: "從朋友圈走到 GraphRAG",
  heroLabel: "EP1 朋友圈的互動圖：選一段 Cypher，看它沿著哪些關係走",
  description: "《Neo4j 入門》學習網頁：先答三題、看影片、在自己的 Neo4j 實際跑一次、再答一次。6 集從 Cypher 基礎到 GraphRAG。",
  footer: "《Neo4j 入門：一步一步做出你的第一張知識圖譜》學習網頁 · AI 架構師系列 · 學習進度只存在這台裝置的瀏覽器裡",
  symLabel: "Cypher 寫法",
  beforeTitle: "開始之前：把 Neo4j 跑起來",
  before: [
    { h: "1. 安裝 Docker", b: `<p>Mac／Windows 裝 Docker Desktop，Linux 裝 Docker Engine。終端機輸入 ${C("docker --version")} 看到版本號就對了。需要約 1.5 GB 硬碟空間。</p>` },
    { h: "2. 存下 docker-compose.yml", b: `<p>新增一個資料夾（例如 ${C("~/neo4j-course")}），把下面內容存成 ${C("docker-compose.yml")}，旁邊再建一個空的 ${C("import")} 資料夾。6 集都用這一份。</p>` + PLAIN(`services:
  neo4j:
    image: neo4j:2026.10.1-community
    container_name: neo4j-course
    ports:
      - "7474:7474"   # Neo4j Browser
      - "7687:7687"   # Bolt：Python driver 連線用
    environment:
      NEO4J_AUTH: neo4j/\${NEO4J_PASSWORD:-neo4j-course}
      NEO4J_PLUGINS: '["apoc", "graph-data-science"]'
      NEO4J_server_memory_heap_max__size: 1G
      NEO4J_dbms_security_procedures_unrestricted: apoc.*,gds.*
    volumes:
      - neo4j-data:/data
      - ./import:/import   # 第 3 集 LOAD CSV 讀這個資料夾
volumes:
  neo4j-data:`) },
    { h: "3. 啟動並登入", b: `<p>在那個資料夾打開終端機：</p>` + PLAIN(`docker compose up -d
docker compose ps        # 等 STATUS 出現 healthy`) + `<p>瀏覽器開 ${C("http://localhost:7474")}，使用者 ${C("neo4j")}、密碼 ${C("neo4j-course")}，按 Connect。用完 ${C("docker compose down")}（資料會留著）；想全部重來用 ${C("docker compose down -v")}。</p>` }
  ],
  phases: [
    { id: 1, name: "第一階段｜認識圖與 Cypher", range: "EP1–EP2", desc: "把 Neo4j 跑起來，用畫圖的方式新增、查詢、修改、刪除資料。" },
    { id: 2, name: "第二階段｜建模、匯入與查詢", range: "EP3–EP4", desc: "把表格資料設計成圖、冪等匯入，再用路徑與聚合回答真正的問題。" },
    { id: 3, name: "第三階段｜演算法與 GraphRAG", range: "EP5–EP6", desc: "用圖演算法找出重要節點與社群，最後讓大型語言模型沿著知識圖譜回答。" }
  ]
};

window.UNITS = [
  // ---------------------------------------------------------- EP1
  {
    no: 1, id: "u01", phase: 1, tier: "Tier 1｜直覺與環境",
    title: "為什麼是圖？用 Docker 跑起第一個 Neo4j",
    hook: "問「朋友的朋友」，表格要 JOIN 兩次，圖只要沿著箭頭走兩步。差別在哪裡？",
    tags: "節點、關係、標籤、屬性、Docker、CREATE、MATCH",
    status: "done", estDur: "12:49", segWord: "步驟",
    sections: [
      { t: 0, title: "為什麼要用圖來存資料" },
      { t: 110, title: "圖的四個積木" },
      { t: 184, title: "用 Docker 啟動 Neo4j" },
      { t: 314, title: "登入 Neo4j Browser" },
      { t: 370, title: "用 CREATE 畫出節點與關係" },
      { t: 519, title: "用 MATCH 把圖找回來" },
      { t: 662, title: "故意踩坑，再清空" }
    ],
    formula: "",
    code: `MATCH (:Person {name: '小安'})-[:KNOWS]->()-[:KNOWS]->(fof)
RETURN fof.name AS 朋友的朋友     // → 美玲`,
    pre: [
      { q: "同一份「誰認識誰」的資料，用表格存和用圖存，問「小安的朋友的朋友是誰」時，做法有什麼不同？", a: "表格要把「認識表」和自己 JOIN 兩次：先查小安認識誰，再拿結果回同一張表查一次。圖把關係直接存成箭頭，從小安出發沿 KNOWS 走兩步就到了（美玲），不必回頭查表。要追的層數越多，差距越明顯。" },
      { q: "一張圖由哪幾種「積木」組成？各舉一個朋友圈裡的例子。", a: "四種：節點（小安這個人）、標籤（Person、Company，替節點分類）、關係（KNOWS、WORKS_AT，一定有方向與型別）、屬性（name: '小安'、age: 28，節點和關係都可以有）。" },
      { q: "同一段 CREATE (:Person {name: '小安'}) 執行兩次，資料庫裡會有幾個小安？為什麼？", a: "兩個。CREATE 只負責「建立」，不會先檢查是否已經存在，所以會出現兩顆一模一樣的節點。要「有就用、沒有才建」得用第 2 集的 MERGE。" }
    ],
    terms: [
      { zh: "圖資料庫", en: "graph database", c: "", d: "把資料存成節點與關係的資料庫；關係本身被存下來，查詢時可以直接沿著走。" },
      { zh: "節點", en: "node", c: "( )", d: "圖上的一個圓圈，代表一件事物，例如一個人或一家公司。" },
      { zh: "標籤", en: "label", c: ":Person", d: "替節點分類的名字，一個節點可以有零到多個標籤。" },
      { zh: "關係", en: "relationship", c: "-[:KNOWS]->", d: "連接兩個節點的箭頭，一定有方向，也一定有一個型別。" },
      { zh: "屬性", en: "property", c: "{name: '小安'}", d: "存在節點或關係上的鍵值資料，例如 age: 28、since: 2020。" },
      { zh: "Cypher", en: "Cypher", c: "MATCH … RETURN", d: "Neo4j 的查詢語言，用 ASCII 符號「畫出」要找的圖樣。" },
      { zh: "容器", en: "container", c: "docker compose up -d", d: "由映像檔啟動、正在執行的隔離環境；資料放在 volume 才不會隨容器消失。" },
      { zh: "Neo4j Browser", en: "Neo4j Browser", c: "localhost:7474", d: "瀏覽器裡的操作介面：輸入 Cypher、看圖、看表格。" }
    ],
    practice: {
      intro: `先照 ${C("cypher/ep01.cypher")} 步驟 5 的三段 CREATE 把朋友圈建好（或貼上「筆記」分頁的程式碼），再在 Browser 實際執行每題的查詢，把數字填進來。`,
      items: [
        { q: `${C("MATCH (n) RETURN count(n)")}：資料庫裡總共有幾個節點？`, a: 5, tol: 0, hint: "4 個 Person，加上 1 個 Company。" },
        { q: `${C("MATCH ()-[r]->() RETURN count(r)")}：總共有幾條關係？`, a: 5, tol: 0, hint: "KNOWS 有 3 條（小安→阿哲→美玲→志豪），WORKS_AT 有 2 條。" },
        { q: `${C("MATCH (p:Person) WHERE p.age > 27 RETURN count(p)")}：年齡大於 27 的有幾人？`, a: 3, tol: 0, hint: "年齡分別是 小安 28、阿哲 31、美玲 26、志豪 35。" },
        { q: `再跑一次 ${C("CREATE (:Person {name: '小安', age: 28})")}，然後 ${C("MATCH (p:Person {name: '小安'}) RETURN count(p)")} 會得到多少？`, a: 2, tol: 0, hint: "CREATE 不會檢查是否已存在。" }
      ]
    },
    notes: [
      { h: "一句話記住", b: "圖資料庫把「關係」當成資料直接存下來；問題需要一層一層追關係時（社群、推薦、詐騙偵測、知識圖譜），圖特別好用。" },
      { h: "表格 JOIN 與沿著箭頭走", b: `<p>表格要回答「朋友的朋友」，得把認識表 JOIN 自己兩次；問五步遠就 JOIN 五次。圖則從起點出發，每走一步只看眼前這個節點連出去的線，不必掃整張表。</p>` },
      { h: "建出今天的朋友圈", b: `<p>依序貼上三段，每段單獨執行：</p>` + PRE(`CREATE (:Person {name: '小安', age: 28});

MATCH (a:Person {name: '小安'})
CREATE (a)-[:KNOWS {since: 2020}]->(:Person {name: '阿哲', age: 31});

MATCH (z:Person {name: '阿哲'})
CREATE (z)-[:KNOWS {since: 2022}]->(m:Person {name: '美玲', age: 26}),
       (m)-[:KNOWS {since: 2023}]->(:Person {name: '志豪', age: 35}),
       (c:Company {name: '圖靈科技'}),
       (z)-[:WORKS_AT]->(c),
       (m)-[:WORKS_AT]->(c);`) + `<p>完成後應該是 5 個節點、5 條關係。</p>` },
      { h: "怎麼讀 ()-[:KNOWS]->()", b: `<ul><li>${C("( )")} 是節點，裡面可以放變數、標籤、屬性：${C("(a:Person {name: '小安'})")}。</li><li>${C("-[ ]->")} 是關係，箭頭表示方向，${C(":KNOWS")} 是型別。</li><li>變數（a、z、m）只在這一段查詢裡有效，下一段要重新用 MATCH 找回來。</li></ul>` },
      { h: "MATCH 像描圖紙", b: `<p>MATCH 拿你畫的樣式去整張圖上比對，所有對得上的位置都會回傳。想在 Browser 看到連線，要把關係變數也 RETURN：</p>` + PRE(`MATCH (a)-[r]->(b)
RETURN a, r, b;

MATCH (p:Person)
RETURN p.name AS 名字, p.age AS 年齡
ORDER BY p.age;`) },
      { h: "踩坑與清空", b: `<p>CREATE 不檢查重複，重跑就會多出同名節點。清空整個資料庫（連同關係）：</p>` + PRE(`MATCH (n) DETACH DELETE n;`) + `<p>常見問題：結果只有圓圈沒有連線，是因為沒有 RETURN 關係；打不開 localhost:7474 多半是還在暖身，${C("docker compose ps")} 看到 healthy 再重新整理。</p>` }
    ],
    quiz: [
      { q: "下列哪一種問題最適合用圖資料庫？", o: ["計算每個月的營業額總和", "找出某位使用者「朋友的朋友」中還沒互加的人", "存一份固定欄位的員工薪資表", "依日期排序一萬筆訂單"], a: 1, w: "需要一層一層沿著關係追的問題最能發揮圖的長處；單純彙總或排序，表格就很好用。" },
      { q: `${C("(a)-[:KNOWS]->(b)")} 裡的 ${C(":KNOWS")} 是什麼？`, o: ["節點的標籤", "關係的型別", "屬性名稱", "變數名稱"], a: 1, w: "方括號裡冒號後面是關係型別；圓括號裡冒號後面才是節點標籤。" },
      { q: "執行 MATCH (n) RETURN n 後，畫面只有圓圈、看不到箭頭，最可能的原因是？", o: ["資料庫壞了", "關係沒有建立成功", "沒有把關係一起 RETURN", "Docker 沒有開"], a: 2, w: "新版 Browser 不會自動補畫關係，改成 MATCH (a)-[r]->(b) RETURN a, r, b 就看得到。" },
      { q: "把同一段 CREATE 執行兩次，會發生什麼事？", o: ["第二次自動略過", "報錯並停止", "多出一模一樣的節點", "覆蓋原本的節點"], a: 2, w: "CREATE 一律新建，不會先找。避免重複要用 MERGE（第 2 集）。" },
      { q: "要刪掉一個還連著關係的節點，該用哪個指令？", o: ["DELETE", "DETACH DELETE", "REMOVE", "DROP"], a: 1, w: "DELETE 遇到還有關係的節點會報錯；DETACH DELETE 會先刪掉它的關係再刪節點。REMOVE 是拿掉屬性或標籤。" }
    ],
    next: "EP2：載入 Movies 資料集，學會 WHERE、ORDER BY、MERGE、SET、DELETE 與參數，把第 1 集的「兩個小安」問題徹底解決。"
  },
  // ---------------------------------------------------------- EP2
  {
    no: 2, id: "u02", phase: 1, tier: "Tier 1｜Cypher 讀寫",
    title: "Cypher 基礎：用畫圖的方式查資料",
    hook: "同一個人怎樣才不會被建兩次？改資料、刪資料時，Neo4j 又在保護你什麼？",
    tags: "Movies 資料集、WHERE、ORDER BY、MERGE、SET、DETACH DELETE、參數",
    status: "planned", estDur: "約 15 分", segWord: "步驟",
    sections: [
      { t: 0, title: "載入 Movies 資料集" },
      { t: 120, title: "WHERE 篩選" },
      { t: 250, title: "RETURN 的整理" },
      { t: 370, title: "MERGE：有就用、沒有才建" },
      { t: 510, title: "SET 與 REMOVE" },
      { t: 630, title: "DELETE 與 DETACH DELETE" },
      { t: 750, title: "參數" }
    ],
    formula: "",
    code: `MERGE (p:Person {name: $name})
ON CREATE SET p.created = date()
ON MATCH  SET p.seen = coalesce(p.seen, 0) + 1`,
    pre: [
      { q: "MERGE 和 CREATE 差在哪裡？什麼時候該用 MERGE？", a: "CREATE 一律新建；MERGE 先找整個樣式，找到就用，找不到才整個建立。重跑也不想重複（例如匯入、補資料）時用 MERGE，並且只拿能唯一識別的屬性（如 name）去比對。" },
      { q: "為什麼對一個還有關係的節點直接 DELETE 會報錯？", a: "Neo4j 不允許關係懸空：關係兩端一定要有節點。直接刪節點會留下沒有端點的關係，所以被擋下。要先刪關係，或用 DETACH DELETE 一起刪。" },
      { q: "把使用者輸入的名字直接拼進查詢字串，例如 \"MATCH (p {name: '\" + input + \"'})\"，有什麼問題？", a: "會有 Cypher 注入風險（輸入可以夾帶指令），也讓資料庫每次都要重新編譯查詢。應該用參數，例如 $name，把值和查詢分開傳。" }
    ],
    terms: [
      { zh: "篩選條件", en: "WHERE", c: "WHERE m.released >= 2000", d: "在比對到的結果裡留下符合條件的；可用比較、IN、STARTS WITH、IS NULL。" },
      { zh: "去除重複", en: "DISTINCT", c: "RETURN DISTINCT p.name", d: "同樣的結果只留一筆；同一個人經由多條路徑被找到時很常用。" },
      { zh: "排序與分頁", en: "ORDER BY / SKIP / LIMIT", c: "ORDER BY m.released DESC LIMIT 5", d: "依欄位排序，跳過前幾筆、只取幾筆。" },
      { zh: "合併建立", en: "MERGE", c: "MERGE (p:Person {name: 'Tom Hanks'})", d: "先找整個樣式，找到就用、找不到才建立；可搭配 ON CREATE／ON MATCH。" },
      { zh: "設定屬性", en: "SET", c: "SET m.rating = 9", d: "新增或修改屬性、加上標籤；設成 null 等於刪掉該屬性。" },
      { zh: "移除", en: "REMOVE", c: "REMOVE p:Actor", d: "拿掉屬性或標籤，不會刪掉節點本身。" },
      { zh: "連同關係刪除", en: "DETACH DELETE", c: "DETACH DELETE p", d: "先刪掉節點所有的關係，再刪節點。" },
      { zh: "參數", en: "parameter", c: "$name", d: "查詢裡的佔位符，值另外傳入；安全、可重複使用查詢計畫。" }
    ],
    practice: {
      intro: `先把 Movies 資料集載入（Browser 歡迎頁的 Movie Graph 範例，或官方腳本 ${C("neo4j-graph-examples/movies")}），在 Browser 實際跑每一題。第 5 題請在空資料庫上做。`,
      items: [
        { q: `資料集裡有幾部電影？（${C("MATCH (m:Movie) RETURN count(m)")}）`, a: 38, tol: 0, hint: "整個資料集是 171 個節點：電影加上人。人有 133 位。" },
        { q: "Tom Hanks 演過（ACTED_IN）幾部電影？", a: 12, tol: 0, hint: "MATCH (:Person {name: 'Tom Hanks'})-[:ACTED_IN]->(m:Movie) RETURN count(m)" },
        { q: "有幾位「同一部電影又演又導」的人？", a: 3, tol: 0, hint: "同一個變數 p 在樣式裡出現兩次：(p)-[:ACTED_IN]->(m)<-[:DIRECTED]-(p)，再 count(DISTINCT p)。" },
        { q: "1990 到 1999 年（含）上映的電影有幾部？", a: 20, tol: 0, hint: "WHERE 1990 <= m.released <= 1999，Cypher 可以連著比較。" },
        { q: `在空資料庫連續執行兩次 ${C("MERGE (:Person {name: '小安'})")}，有幾個小安？`, a: 1, tol: 0, hint: "第二次 MERGE 找到第一次建的節點，就直接使用。" }
      ]
    },
    notes: [
      { h: "一句話記住", b: "讀用 MATCH＋WHERE＋RETURN；寫的時候，怕重複就用 MERGE，改用 SET，刪用 DETACH DELETE，外部輸入一律用參數。" },
      { h: "Movies 資料集長什麼樣", b: `<p>38 部 Movie、133 位 Person，共 253 條關係：ACTED_IN 172、DIRECTED 44、PRODUCED 15、WROTE 10、REVIEWED 9、FOLLOWS 3。先看整體結構：</p>` + PRE(`CALL db.schema.visualization();`) + `<p>官方腳本會替 Movie.title 與 Person.name 建唯一性約束，所以在同一個資料庫裡再 CREATE 同名的人會直接報錯。</p>` },
      { h: "WHERE 與 RETURN 的整理", b: PRE(`MATCH (p:Person)-[:ACTED_IN]->(m:Movie)
WHERE m.released >= 2000 AND p.name STARTS WITH 'Tom'
RETURN DISTINCT p.name AS 演員, m.title AS 電影, m.released AS 年份
ORDER BY 年份 DESC
LIMIT 5;`) },
      { h: "MERGE 的陷阱：它比對的是整個樣式", b: `<p>${C("MERGE (a)-[:KNOWS]->(b:Person {name: '志豪'})")} 如果整條樣式找不到，會連「志豪」也重新建一個。安全做法是先分別 MERGE 節點，再 MERGE 關係：</p>` + PRE(`MERGE (a:Person {name: '小安'})
MERGE (b:Person {name: '志豪'})
MERGE (a)-[:KNOWS]->(b);`) },
      { h: "改、刪與參數", b: PRE(`// 改評分再改回來
MATCH (m:Movie {title: 'The Matrix'}) SET m.rating = 9;
MATCH (m:Movie {title: 'The Matrix'}) REMOVE m.rating;

// 在 Browser 設定參數，再用 $name 引用
:param name => 'Tom Hanks'
MATCH (p:Person {name: $name})-[:ACTED_IN]->(m)
RETURN m.title;`) + `<p>直接 ${C("DELETE")} 有關係的節點會報錯，因為關係不能懸空；用 ${C("DETACH DELETE")}。</p>` }
    ],
    quiz: [
      { q: `${C("MATCH (p:Person) WHERE p.born IS NULL RETURN count(p)")} 在找什麼？`, o: ["born 等於 0 的人", "沒有 born 屬性的人", "所有人", "born 是空字串的人"], a: 1, w: "Neo4j 沒有「欄位存在但為 null」這回事：屬性不存在就是 null，所以 IS NULL 找的是沒有這個屬性的節點。Movies 資料集有 5 位。" },
      { q: "MERGE (a:Person {name:'小安'})-[:KNOWS]->(b:Person {name:'志豪'})，若兩人都已存在但還沒有 KNOWS 關係，會發生什麼？", o: ["只建立關係", "建立兩個新節點和一條關係", "報錯", "什麼都不做"], a: 1, w: "MERGE 看的是整個樣式；整條找不到就整條建立，結果多出兩個新節點。先分別 MERGE 節點再 MERGE 關係才安全。" },
      { q: "想把 Keanu Reeves 的節點加上 Actor 標籤，該用？", o: ["SET p:Actor", "MERGE p:Actor", "CREATE p:Actor", "ADD LABEL p Actor"], a: 0, w: "SET 可以加屬性也可以加標籤；拿掉標籤用 REMOVE p:Actor。" },
      { q: "為什麼查詢要用 $name 參數，而不是把字串拼進去？", o: ["參數跑得比較慢但比較好看", "避免注入攻擊，也讓查詢計畫可以重複使用", "只有參數才能查中文", "Browser 規定一定要用"], a: 1, w: "參數讓值與查詢分開：輸入無法改變查詢結構，資料庫也能快取同一個查詢計畫。" },
      { q: "想列出最新上映的 5 部電影，哪一段正確？", o: ["RETURN m LIMIT 5 ORDER BY m.released", "ORDER BY m.released DESC RETURN m LIMIT 5", "RETURN m ORDER BY m.released DESC LIMIT 5", "RETURN TOP 5 m BY m.released"], a: 2, w: "順序是 RETURN → ORDER BY → SKIP → LIMIT；要最新的用 DESC。" }
    ],
    next: "EP3：從表格到圖。先從要回答的問題倒推模型，加上唯一性約束，再用 LOAD CSV＋MERGE 匯入課程主資料集「AI 知識圖譜」。"
  },
  // ---------------------------------------------------------- EP3
  {
    no: 3, id: "u03", phase: 2, tier: "Tier 2｜建模與匯入",
    title: "從表格到圖：建模與匯入 CSV",
    hook: "「機構」該是論文的一個屬性，還是一個獨立節點？匯入跑兩次，資料會不會變兩倍？",
    tags: "圖建模、唯一性約束、索引、LOAD CSV、冪等匯入、AI 知識圖譜",
    status: "planned", estDur: "約 15 分", segWord: "步驟",
    sections: [
      { t: 0, title: "從問題倒推模型" },
      { t: 120, title: "屬性還是節點？" },
      { t: 240, title: "唯一性約束與索引" },
      { t: 370, title: "LOAD CSV 基本" },
      { t: 500, title: "用 MERGE 冪等匯入" },
      { t: 630, title: "匯入 AI 知識圖譜" },
      { t: 770, title: "檢查匯入結果" }
    ],
    formula: "",
    code: `LOAD CSV WITH HEADERS FROM 'file:///papers.csv' AS row
MERGE (p:Paper {title: row.title})
  ON CREATE SET p.year = toInteger(row.year)`,
    pre: [
      { q: "設計圖模型時，第一步該做什麼？", a: "先列出要回答的問題（例如「誰和誰合寫過論文」「哪篇論文被最多人引用」），再決定什麼是節點、什麼是關係。問題裡的名詞多半是節點，動詞是關係，只用來篩選或顯示的值是屬性。" },
      { q: "「機構」什麼時候該做成節點，而不是研究者身上的一個屬性？", a: "當你要沿著它查詢的時候，例如「同一個機構的研究者」「機構之間的合作」。做成節點就能用關係連過去；只拿來顯示或簡單篩選，屬性就夠了。" },
      { q: "什麼叫「冪等匯入」？怎麼做到？", a: "同一份資料匯入幾次，結果都一樣，不會重複。做法是用 MERGE（而不是 CREATE），比對能唯一識別的鍵，並先用唯一性約束保證這個鍵不會重複，MERGE 查找也會變快。" }
    ],
    terms: [
      { zh: "圖模型", en: "graph model", c: "(:Author)-[:WROTE]->(:Paper)", d: "決定哪些東西是節點、哪些是關係、哪些是屬性的設計。" },
      { zh: "唯一性約束", en: "uniqueness constraint", c: "REQUIRE p.title IS UNIQUE", d: "保證某標籤的某屬性不重複；違反時寫入會失敗，同時附帶一個索引。" },
      { zh: "索引", en: "index", c: "SHOW INDEXES", d: "讓資料庫快速找到查詢的起點節點，不必掃過同標籤的所有節點。" },
      { zh: "LOAD CSV", en: "LOAD CSV", c: "LOAD CSV WITH HEADERS FROM 'file:///x.csv' AS row", d: "逐列讀取 CSV；有表頭時每一列是一個 map，值一律是字串。" },
      { zh: "型別轉換", en: "type conversion", c: "toInteger(row.year)", d: "CSV 讀進來都是字串，數字、日期要自己轉。" },
      { zh: "冪等", en: "idempotent", c: "MERGE", d: "同一個操作重複執行，結果和執行一次一樣。" },
      { zh: "孤立節點", en: "orphan node", c: "WHERE NOT (n)--()", d: "沒有任何關係的節點，常是匯入時鍵對不上的徵兆。" }
    ],
    practice: {
      intro: `用 ${C("UNWIND")} 模擬 CSV 的 13 列（每一列是「論文、作者」，最後一列故意重複了 Jacob Devlin），在空資料庫上實際跑「筆記」分頁的匯入程式，回答下面的問題。`,
      items: [
        { q: "用 MERGE 匯入後，有幾個 Author 節點？", a: 12, tol: 0, hint: "13 列裡 Jacob Devlin 出現兩次，MERGE 第二次會找到第一次建的。" },
        { q: "WROTE 關係有幾條？", a: 12, tol: 0, hint: "關係也是 MERGE 的：同一位作者對同一篇論文只會有一條。" },
        { q: "如果作者那一行改用 CREATE（每一列都新建作者），會有幾個 Author 節點？", a: 13, tol: 0, hint: "CREATE 不會先找，有幾列就建幾個。先拿掉唯一性約束才跑得動。" },
        { q: "MERGE 版本原封不動再跑一次，這次「新建立」了幾個節點？", a: 0, tol: 0, hint: "冪等：全部都找得到，什麼都不用建。看結果摘要的 Created 數字。" }
      ]
    },
    notes: [
      { h: "一句話記住", b: "先問題、後模型；先約束、後匯入；先節點、後關係；一律 MERGE。" },
      { h: "從問題倒推模型", b: `<ul><li>「誰和誰合寫過？」→ 需要 ${C("(:Researcher)-[:WROTE]->(:Paper)")}</li><li>「哪篇論文影響最大？」→ 需要 ${C("(:Paper)-[:CITES]->(:Paper)")}</li><li>「這篇論文談哪些概念？」→ 需要 ${C("(:Paper)-[:ABOUT]->(:Concept)")}</li><li>「同機構的研究者？」→ 機構要做成節點：${C("(:Researcher)-[:AFFILIATED_WITH]->(:Institution)")}</li></ul>` },
      { h: "先建約束", b: PRE(`CREATE CONSTRAINT paper_title IF NOT EXISTS
FOR (p:Paper) REQUIRE p.title IS UNIQUE;

CREATE CONSTRAINT author_name IF NOT EXISTS
FOR (a:Author) REQUIRE a.name IS UNIQUE;

SHOW CONSTRAINTS;
SHOW INDEXES;`) },
      { h: "練習用的匯入程式", b: `<p>${C("UNWIND")} 把清單一列一列展開，效果和 ${C("LOAD CSV WITH HEADERS")} 讀到的 ${C("row")} 一樣。</p>` + PRE(`UNWIND [
  {title: 'Attention Is All You Need', year: 2017, author: 'Ashish Vaswani'},
  {title: 'Attention Is All You Need', year: 2017, author: 'Noam Shazeer'},
  {title: 'Attention Is All You Need', year: 2017, author: 'Niki Parmar'},
  {title: 'Attention Is All You Need', year: 2017, author: 'Jakob Uszkoreit'},
  {title: 'Attention Is All You Need', year: 2017, author: 'Llion Jones'},
  {title: 'Attention Is All You Need', year: 2017, author: 'Aidan N. Gomez'},
  {title: 'Attention Is All You Need', year: 2017, author: 'Łukasz Kaiser'},
  {title: 'Attention Is All You Need', year: 2017, author: 'Illia Polosukhin'},
  {title: 'BERT', year: 2019, author: 'Jacob Devlin'},
  {title: 'BERT', year: 2019, author: 'Ming-Wei Chang'},
  {title: 'BERT', year: 2019, author: 'Kenton Lee'},
  {title: 'BERT', year: 2019, author: 'Kristina Toutanova'},
  {title: 'BERT', year: 2019, author: 'Jacob Devlin'}
] AS row
MERGE (p:Paper {title: row.title}) ON CREATE SET p.year = row.year
MERGE (a:Author {name: row.author})
MERGE (a)-[:WROTE]->(p);`) },
      { h: "真的從 CSV 匯入", b: `<p>把檔案放進 docker-compose 旁邊的 ${C("import/")} 資料夾，用 ${C("file:///檔名.csv")} 讀取。注意每個值都是字串：</p>` + PRE(`LOAD CSV WITH HEADERS FROM 'file:///papers.csv' AS row
MERGE (p:Paper {title: row.title})
  ON CREATE SET p.year = toInteger(row.year);

LOAD CSV WITH HEADERS FROM 'file:///authorship.csv' AS row
MATCH (p:Paper {title: row.title})
MERGE (a:Author {name: row.author})
MERGE (a)-[:WROTE]->(p);`) },
      { h: "檢查匯入結果", b: PRE(`// 各標籤的數量
MATCH (n) RETURN labels(n) AS 標籤, count(*) AS 數量;

// 沒有任何關係的孤立節點（通常是鍵對不上）
MATCH (n) WHERE NOT (n)--() RETURN n LIMIT 25;`) }
    ],
    quiz: [
      { q: "LOAD CSV 讀到 row.year 是 \"2017\"，直接存進去會怎樣？", o: ["自動變成整數 2017", "存成字串 \"2017\"，數字比較會出問題", "匯入失敗", "變成日期"], a: 1, w: "CSV 的值一律是字串，要用 toInteger()、toFloat()、date() 自己轉。" },
      { q: "為什麼要先建立唯一性約束，再用 MERGE 匯入？", o: ["約束會自動幫你匯入", "保證鍵不重複，而且附帶的索引讓 MERGE 查找變快", "不建約束就不能用 MERGE", "約束會壓縮資料"], a: 1, w: "約束同時是資料品質的保險和效能的保證：MERGE 每一列都要先找，有索引才不會越匯越慢。" },
      { q: "匯入關係時，比較好的順序是？", o: ["先建關係，再補節點", "先把所有節點 MERGE 好，再用 MATCH 找兩端、MERGE 關係", "節點和關係一律用 CREATE 一次建完", "順序不重要"], a: 1, w: "分兩趟：先節點、後關係。第二趟用 MATCH 找兩端，避免 MERGE 整條樣式時順手建出重複節點。" },
      { q: "想查「同一個機構的研究者有哪些」，機構最好設計成？", o: ["研究者節點上的字串屬性", "獨立的 Institution 節點，用關係連過去", "論文的屬性", "不用存"], a: 1, w: "要沿著它查詢、或它本身有屬性（國家、類型）時，就做成節點。" },
      { q: `${C("MATCH (n) WHERE NOT (n)--() RETURN n")} 找的是？`, o: ["所有節點", "沒有任何關係的節點", "只有一條關係的節點", "關係指向自己的節點"], a: 1, w: "(n)--() 表示 n 有任何方向的關係；NOT 起來就是孤立節點。" }
    ],
    next: "EP4：在 AI 知識圖譜上走路徑、做聚合，寫出「讀了這篇也該讀」的推薦查詢，並用 PROFILE 看懂查詢花了多少力氣。"
  },
  // ---------------------------------------------------------- EP4
  {
    no: 4, id: "u04", phase: 2, tier: "Tier 2｜查詢進階",
    title: "進階查詢：路徑、聚合與推薦",
    hook: "沿著引用往回追三層、找兩篇論文之間最短的路，再算出「讀了這篇也該讀」。",
    tags: "可變長度路徑、最短路徑、聚合、WITH、OPTIONAL MATCH、推薦、PROFILE",
    status: "planned", estDur: "約 15 分", segWord: "步驟",
    sections: [
      { t: 0, title: "可變長度路徑" },
      { t: 130, title: "最短路徑" },
      { t: 250, title: "聚合" },
      { t: 380, title: "WITH 管線" },
      { t: 500, title: "OPTIONAL MATCH" },
      { t: 620, title: "推薦查詢" },
      { t: 760, title: "EXPLAIN 與 PROFILE" }
    ],
    formula: "",
    code: `MATCH (me:Paper {id: 'A'})-[:CITES]->(x)<-[:CITES]-(other)
WHERE other <> me
RETURN other.id, count(x) AS 共同引用 ORDER BY 共同引用 DESC`,
    pre: [
      { q: `${C("-[:CITES*1..3]->")} 是什麼意思？層數放太大會怎樣？`, a: "沿著 CITES 關係走 1 到 3 步的所有路徑。路徑數會隨層數幾何成長，層數放太大（或不設上限）可能找到極多路徑、拖垮查詢，所以要設合理上限。" },
      { q: "在 Cypher 裡寫 count(*)，資料是依什麼分組的？", a: "依 RETURN（或 WITH）裡所有「不是聚合函數」的欄位分組，這些欄位就是隱含的分組鍵。Cypher 沒有 GROUP BY。" },
      { q: "OPTIONAL MATCH 和一般 MATCH 差在哪？", a: "一般 MATCH 對不到就把整列丟掉；OPTIONAL MATCH 對不到時保留這一列，對不到的變數填 null。效果類似 SQL 的 LEFT JOIN，用來列出「沒有也要列出來」的項目。" }
    ],
    terms: [
      { zh: "可變長度路徑", en: "variable-length path", c: "-[:CITES*1..3]->", d: "一次比對 1 到 3 步的路徑；新語法也可寫成 -[:CITES]->{1,3}。" },
      { zh: "最短路徑", en: "shortest path", c: "SHORTEST 1 (a)-[:CITES]->+(b)", d: "兩點之間步數最少的路徑；舊寫法是 shortestPath()。" },
      { zh: "聚合", en: "aggregation", c: "count() collect() avg()", d: "把多列合成一個值；非聚合欄位自動成為分組鍵。" },
      { zh: "WITH 管線", en: "WITH", c: "WITH p, count(*) AS n WHERE n > 1", d: "把前一段的結果交給下一段，中途可以聚合、篩選、改名。" },
      { zh: "選擇性比對", en: "OPTIONAL MATCH", c: "OPTIONAL MATCH (p)<-[:CITES]-(c)", d: "對不到時保留這一列、變數填 null，類似 LEFT JOIN。" },
      { zh: "查詢計畫", en: "EXPLAIN / PROFILE", c: "PROFILE MATCH …", d: "EXPLAIN 只看計畫不執行；PROFILE 實際執行並顯示每一步的 db hits。" },
      { zh: "資料庫存取次數", en: "db hits", c: "", d: "查詢存取儲存層的次數，越少通常越快；加索引前後比較最有感。" }
    ],
    practice: {
      intro: `在空資料庫建一張練習用的小引用圖（8 篇論文 A–H、7 條 CITES，程式在「筆記」分頁），實際跑查詢回答。`,
      items: [
        { q: `從 A 出發沿 CITES 走 1–2 步，${C("count(DISTINCT x)")} 是多少？`, a: 3, tol: 0, hint: "一步到 B、C，兩步到 D（兩條路都到 D）。" },
        { q: `同一個查詢拿掉 DISTINCT，${C("count(x)")} 是多少？`, a: 4, tol: 0, hint: "A→B→D 和 A→C→D 是兩條不同的路徑，D 會被數兩次。" },
        { q: "A 到 E 的最短路徑有幾步（length）？", a: 3, tol: 0, hint: "A→B→D→E 或 A→C→D→E。" },
        { q: "用 OPTIONAL MATCH 數每篇被引用幾次，被引用 0 次的有幾篇？", a: 3, tol: 0, hint: "沒有人指向它的論文：A、F，還有另一群的 G。" }
      ]
    },
    notes: [
      { h: "一句話記住", b: "路徑要設上限、去重要寫 DISTINCT、分組看非聚合欄位、沒有也要列出來就用 OPTIONAL MATCH，慢了先 PROFILE。" },
      { h: "練習用的小引用圖", b: PRE(`CREATE (a:Paper {id: 'A'}), (b:Paper {id: 'B'}), (c:Paper {id: 'C'}), (d:Paper {id: 'D'}),
       (e:Paper {id: 'E'}), (f:Paper {id: 'F'}), (g:Paper {id: 'G'}), (h:Paper {id: 'H'}),
       (a)-[:CITES]->(b), (a)-[:CITES]->(c), (b)-[:CITES]->(d), (c)-[:CITES]->(d),
       (d)-[:CITES]->(e), (f)-[:CITES]->(e), (g)-[:CITES]->(h);`) },
      { h: "路徑與最短路徑", b: PRE(`MATCH (:Paper {id: 'A'})-[:CITES*1..2]->(x)
RETURN count(DISTINCT x);              // 3

MATCH p = SHORTEST 1 (:Paper {id: 'A'})-[:CITES]->+(:Paper {id: 'E'})
RETURN [n IN nodes(p) | n.id] AS 路線, length(p) AS 步數;`) },
      { h: "聚合與 OPTIONAL MATCH", b: PRE(`MATCH (p:Paper)
OPTIONAL MATCH (p)<-[r:CITES]-()
WITH p, count(r) AS 被引用
RETURN p.id, 被引用
ORDER BY 被引用 DESC;`) + `<p>${C("count(r)")} 不數 null，所以沒被引用的論文會得到 0，而不是被丟掉。這張圖平均每篇被引用 0.875 次，最多 2 次（D 和 E）。</p>` },
      { h: "推薦：讀了這篇也該讀", b: `<p>和我引用了同樣論文的其他論文，共同引用越多越相關：</p>` + PRE(`MATCH (me:Paper {id: 'B'})-[:CITES]->(x)<-[:CITES]-(other)
WHERE other <> me
RETURN other.id AS 推薦, count(x) AS 共同引用
ORDER BY 共同引用 DESC;`) },
      { h: "看懂查詢計畫", b: `<p>在查詢前面加 ${C("PROFILE")}，看每一步的 rows 和 db hits。起點用的是 ${C("NodeByLabelScan")}（掃整個標籤）還是 ${C("NodeIndexSeek")}（用索引直接找到），差別在資料一多就很明顯。</p>` + PRE(`PROFILE
MATCH (p:Paper {id: 'A'})-[:CITES*1..2]->(x)
RETURN count(DISTINCT x);`) }
    ],
    quiz: [
      { q: "MATCH (a)-[:CITES*]->(b) 沒有設上限，可能有什麼風險？", o: ["語法錯誤", "路徑數爆炸，查詢非常慢甚至耗盡記憶體", "只會走一步", "結果一定是空的"], a: 1, w: "路徑數隨層數幾何成長。實務上一定要給上限，例如 *1..3。" },
      { q: `${C("RETURN p.year, count(*)")} 會依什麼分組？`, o: ["不分組", "依 p.year", "依 count(*)", "依節點 id"], a: 1, w: "非聚合欄位就是分組鍵。Cypher 沒有 GROUP BY 子句。" },
      { q: "想列出所有論文和它被引用的次數，沒被引用的也要出現，應該用？", o: ["MATCH (p)<-[:CITES]-(c)", "OPTIONAL MATCH (p)<-[:CITES]-(c)", "WHERE (p)<-[:CITES]-()", "MERGE (p)<-[:CITES]-(c)"], a: 1, w: "一般 MATCH 會把沒有引用的論文整列丟掉；OPTIONAL MATCH 留下來並讓 c 為 null，count(c) 得 0。" },
      { q: "WITH 最主要的用途是？", o: ["建立節點", "把查詢分段：前一段的結果交給下一段，中途可聚合後再篩選", "宣告參數", "建立索引"], a: 1, w: "例如先 WITH p, count(*) AS n，再 WHERE n > 1，這是 SQL 裡 HAVING 的效果。" },
      { q: "EXPLAIN 和 PROFILE 的差別是？", o: ["沒有差別", "EXPLAIN 只顯示計畫不執行；PROFILE 實際執行並統計 db hits", "PROFILE 只顯示計畫", "EXPLAIN 會修改資料"], a: 1, w: "想知道真實成本用 PROFILE；查詢很重、只想先看計畫用 EXPLAIN。" }
    ],
    next: "EP5：用 Graph Data Science 找出最有影響力的論文（PageRank）與研究群落（Louvain），再從 Python 讀寫 Neo4j。"
  },
  // ---------------------------------------------------------- EP5
  {
    no: 5, id: "u05", phase: 3, tier: "Tier 3｜演算法與程式",
    title: "圖演算法與 Python",
    hook: "被引用最多的論文就是最重要的嗎？PageRank 說：還要看是誰引用你。",
    tags: "GDS、圖投影、PageRank、Louvain、連通元件、相似度、Python driver",
    status: "planned", estDur: "約 15 分", segWord: "小節",
    sections: [
      { t: 0, title: "GDS 的工作方式" },
      { t: 150, title: "PageRank" },
      { t: 300, title: "社群偵測" },
      { t: 450, title: "相似度" },
      { t: 590, title: "Python driver" },
      { t: 740, title: "從 Python 寫入與讀取" }
    ],
    formula: "",
    code: `CALL gds.graph.project('cites', 'Paper', 'CITES');
CALL gds.pageRank.stream('cites') YIELD nodeId, score
RETURN gds.util.asNode(nodeId).id AS 論文, score ORDER BY score DESC`,
    pre: [
      { q: "GDS 跑演算法前為什麼要先「投影」一張圖？", a: "GDS 會把需要的節點與關係複製一份到記憶體，存成適合計算的格式，演算法在這份投影上跑，又快又不會動到原本的資料。結果可以串流回來看，或寫回資料庫；用完要 drop 釋放記憶體。" },
      { q: "PageRank 和「被引用次數」有什麼不同？", a: "被引用次數只數有幾個人指向你；PageRank 還看指向你的是誰：被重要的論文引用，分數比被冷門論文引用更高。分數是遞迴算出來的，可以想成隨機沿著引用走，最常停留在哪裡。" },
      { q: "用 Python 連 Neo4j，需要哪三樣資訊？", a: "連線網址（bolt://localhost:7687 或 neo4j://…）、帳號、密碼。安裝 neo4j 套件後，用 GraphDatabase.driver(網址, auth=(帳號, 密碼)) 建立 driver。" }
    ],
    terms: [
      { zh: "圖資料科學函式庫", en: "Graph Data Science (GDS)", c: "CALL gds.…", d: "Neo4j 的圖演算法外掛，提供中心性、社群、相似度、路徑等演算法。" },
      { zh: "圖投影", en: "graph projection", c: "gds.graph.project('g', 'Paper', 'CITES')", d: "把要計算的節點與關係複製到記憶體中的圖。" },
      { zh: "PageRank", en: "PageRank", m: R`PR(u)=(1-d)+d\sum_{v\to u}\frac{PR(v)}{\deg^{+}(v)}`, d: "依「誰指向你、它又有多重要」遞迴算出重要性；d 通常取 0.85。" },
      { zh: "社群偵測", en: "community detection (Louvain)", c: "gds.louvain.stream('g')", d: "把內部連得緊、彼此連得鬆的節點分成同一群，以模組度為目標。" },
      { zh: "弱連通元件", en: "weakly connected components", c: "gds.wcc.stream('g')", d: "不看方向時彼此走得到的一群節點；用來檢查圖是不是斷成好幾塊。" },
      { zh: "節點相似度", en: "node similarity", c: "gds.nodeSimilarity.stream('g')", d: "比較兩個節點的鄰居重疊程度（預設 Jaccard），用來找相近的研究者或論文。" },
      { zh: "Python driver", en: "neo4j Python driver", c: "pip install neo4j", d: "官方 Python 套件，透過 Bolt 協定送 Cypher、取回結果。" }
    ],
    practice: {
      intro: `沿用第 4 集的小引用圖（8 篇論文、7 條 CITES），先 ${C("gds.graph.project('cites', 'Paper', 'CITES')")}，再實際跑演算法回答。`,
      items: [
        { q: "gds.wcc.stream 找到幾個連通元件？", a: 2, tol: 0, hint: "A–F 這一群彼此連得到；G→H 自成一群。" },
        { q: "最大的那個元件有幾篇論文？", a: 6, tol: 0, hint: "A、B、C、D、E、F。" },
        { q: "PageRank 分數最高的論文，分數是多少？（四捨五入到小數兩位）", a: 0.71, tol: 0.01, hint: "預設 dampingFactor 0.85。沒人引用的論文分數是 1 − 0.85 = 0.15，分數會沿著 CITES 往下游累積。" },
        { q: "被引用次數（入度）最多的論文，被引用幾次？", a: 2, tol: 0, hint: "gds.degree.stream 加上 {orientation: 'REVERSE'} 就是數被指向的次數；D 和 E 並列。" }
      ]
    },
    notes: [
      { h: "一句話記住", b: "GDS 三步：投影 → 跑演算法（stream 看、write 寫回）→ drop。Python 用一個 driver、一個 execute_query 就能讀寫。" },
      { h: "PageRank 的隨機漫步直覺", b: `<p>想像一位讀者隨機沿著引用往前翻，偶爾（機率 1 − d）跳到任意一篇重新開始。久了之後停留在每篇論文的比例，就是它的重要性：</p><p>$$PR(u)=(1-d)+d\\sum_{v\\to u}\\frac{PR(v)}{\\deg^{+}(v)}$$</p><p>練習圖裡 E 被 D 和 F 引用，而 D 又承接了 B、C 的分數，所以 E 最高（約 0.71），D 次之（約 0.51）。</p>` },
      { h: "GDS 完整流程", b: PRE(`CALL gds.graph.project('cites', 'Paper', 'CITES');

// 看結果
CALL gds.pageRank.stream('cites') YIELD nodeId, score
RETURN gds.util.asNode(nodeId).id AS 論文, round(score, 2) AS 分數
ORDER BY 分數 DESC;

// 寫回成屬性，之後一般 Cypher 就能用
CALL gds.pageRank.write('cites', {writeProperty: 'pagerank'});

// 社群：不看方向時誰和誰連得緊
CALL gds.louvain.stream('cites') YIELD nodeId, communityId
RETURN communityId, collect(gds.util.asNode(nodeId).id) AS 成員;

CALL gds.graph.drop('cites');`) },
      { h: "Python driver：連線與讀取", b: PLAIN(`# pip install neo4j pandas
from neo4j import GraphDatabase, Result

URI, AUTH = "bolt://localhost:7687", ("neo4j", "neo4j-course")
with GraphDatabase.driver(URI, auth=AUTH) as driver:
    driver.verify_connectivity()
    records, summary, keys = driver.execute_query(
        "MATCH (p:Paper)<-[:CITES]-() RETURN p.id AS id, count(*) AS cited ORDER BY cited DESC",
        database_="neo4j",
    )
    for r in records:
        print(r["id"], r["cited"])

    # 直接轉成 pandas DataFrame
    df = driver.execute_query("MATCH (p:Paper) RETURN p.id AS id, p.pagerank AS pr",
                              result_transformer_=Result.to_df)`) },
      { h: "從 Python 批次寫入", b: `<p>一次傳一整批資料，用 ${C("UNWIND $rows")} 展開；不要在迴圈裡一筆一筆送，也不要把值拼進字串：</p>` + PLAIN(`rows = [{"id": "I", "cites": "A"}, {"id": "J", "cites": "A"}]
driver.execute_query("""
    UNWIND $rows AS row
    MERGE (p:Paper {id: row.id})
    MERGE (q:Paper {id: row.cites})
    MERGE (p)-[:CITES]->(q)
""", rows=rows, database_="neo4j")`) }
    ],
    quiz: [
      { q: "GDS 演算法是在哪一份資料上計算？", o: ["直接在硬碟上的原始資料", "記憶體中的圖投影", "Neo4j Browser 的畫面", "CSV 檔"], a: 1, w: "先用 gds.graph.project 投影到記憶體，演算法在投影上跑，用完記得 gds.graph.drop。" },
      { q: "兩篇論文都被引用 3 次，PageRank 卻差很多，最可能的原因是？", o: ["PageRank 有隨機誤差", "引用它們的論文本身重要性不同", "年份不同", "標題長度不同"], a: 1, w: "PageRank 看的是「誰引用你」：被高分論文引用，分到的分數比較多。" },
      { q: "想知道圖是不是斷成好幾塊，該用哪個演算法？", o: ["PageRank", "弱連通元件（WCC）", "節點相似度", "最短路徑"], a: 1, w: "WCC 不看方向，把彼此走得到的節點歸成同一個元件；元件數大於 1 就代表有斷開的部分。" },
      { q: ".stream 與 .write 模式的差別？", o: ["沒有差別", "stream 把結果回傳給你看；write 把結果寫回資料庫成為屬性", "write 比較快但不準", "stream 會刪掉投影"], a: 1, w: "先 stream 檢查結果合不合理，確定了再 write 寫回，之後一般 Cypher 查詢就能使用。" },
      { q: "從 Python 寫入 1 萬筆資料，比較好的做法是？", o: ["迴圈裡每筆呼叫一次 execute_query，值用字串拼接", "把資料當參數傳入，用 UNWIND $rows 一次處理一批", "先存成 Excel 再手動匯入", "用 CREATE 不用 MERGE 就好"], a: 1, w: "一次一批、用參數：往返次數少，也沒有注入風險。" }
    ],
    next: "EP6：把文件切塊、讓大型語言模型抽出實體與關係寫回 Neo4j，再用「向量找入口、圖往外擴」的混合檢索做出 GraphRAG。"
  },
  // ---------------------------------------------------------- EP6
  {
    no: 6, id: "u06", phase: 3, tier: "Tier 3｜AI 應用",
    title: "GraphRAG：知識圖譜＋LLM",
    hook: "純向量檢索找得到「長得像」的段落，卻答不好要串兩三個事實的問題。圖可以補上哪一塊？",
    tags: "GraphRAG、文件切塊、實體抽取、向量索引、混合檢索、引用出處",
    status: "planned", estDur: "約 15 分", segWord: "步驟",
    sections: [
      { t: 0, title: "純向量 RAG 的盲點" },
      { t: 110, title: "文件切塊" },
      { t: 220, title: "LLM 抽實體與關係" },
      { t: 350, title: "寫回 Neo4j" },
      { t: 460, title: "向量索引" },
      { t: 570, title: "混合檢索" },
      { t: 700, title: "讓 LLM 回答並附出處" },
      { t: 810, title: "和純向量 RAG 對照" }
    ],
    formula: "",
    code: `CALL db.index.vector.queryNodes('chunk_emb', 3, $q) YIELD node AS c, score
MATCH (c)-[:MENTIONS]->(e:Entity)-[:BASED_ON|USES]-{0,2}(n:Entity)
RETURN c.id, score, collect(DISTINCT n.name) AS 相關實體`,
    pre: [
      { q: "什麼樣的問題，純向量 RAG 容易答不好？", a: "需要把好幾個事實串起來的多步問題，例如「BERT 建立在哪個架構上？那個架構的核心機制是什麼？」。答案分散在不同段落，而且第二段跟問題字面不像，向量檢索不一定撈得到。圖可以從 BERT 沿 BASED_ON、USES 走過去。" },
      { q: "文件切塊時為什麼要設「重疊」？", a: "一句話或一個概念可能剛好被切在兩塊的邊界；讓相鄰兩塊重疊一小段，可以降低重要內容被切斷、兩塊都不完整的機會。代價是總塊數和儲存量變多。" },
      { q: "「混合檢索」的混合指的是哪兩種方法？", a: "向量相似度與圖走訪：先用向量索引找出和問題最像的段落（入口），再沿著段落提到的實體在圖上往外擴，把相關的事實與出處一起交給大型語言模型。" }
    ],
    terms: [
      { zh: "檢索增強生成", en: "RAG", c: "", d: "先檢索相關資料，再把資料放進提示交給大型語言模型回答。" },
      { zh: "GraphRAG", en: "GraphRAG", c: "(:Chunk)-[:MENTIONS]->(:Entity)", d: "檢索時除了向量相似度，也沿著知識圖譜的關係找出相關事實。" },
      { zh: "切塊", en: "chunking", c: "", d: "把長文件切成固定長度、彼此重疊的小段，每段各自做嵌入。" },
      { zh: "嵌入向量", en: "embedding", c: "c.embedding", d: "把文字轉成一串數字；意思相近的文字，向量方向也相近。" },
      { zh: "實體對齊", en: "entity resolution", c: "MERGE (e:Entity {name: …})", d: "把同一事物的不同寫法合成一個節點，並分開同名但不同的事物。" },
      { zh: "向量索引", en: "vector index", c: "CREATE VECTOR INDEX … OPTIONS {indexConfig: …}", d: "依向量相似度快速找出最近的 k 個節點。" },
      { zh: "餘弦相似度", en: "cosine similarity", m: R`\cos\theta=\frac{\mathbf{a}\cdot\mathbf{b}}{\|\mathbf{a}\|\,\|\mathbf{b}\|}`, d: "比較兩個向量方向的相近程度；Neo4j 的 vector.similarity.cosine 會換算成 (1+cos)/2，落在 0 到 1。" },
      { zh: "混合檢索", en: "hybrid retrieval", c: "queryNodes → MATCH 往外擴", d: "向量找入口、圖往外擴，把相關事實與出處一起交給大型語言模型。" }
    ],
    practice: {
      intro: `前兩題用紙筆或 Python 算；後兩題在 Neo4j 實際執行（迷你知識圖譜的程式在「筆記」分頁）。`,
      items: [
        { q: "一篇 1,000 字的文件，每塊 300 字、相鄰兩塊重疊 50 字，會切成幾塊？", a: 4, tol: 0, hint: "每次往前移 300 − 50 = 250 字：起點 0、250、500、750，第 4 塊（750–1000）已經碰到結尾。" },
        { q: "向量 [1, 0, 1] 和 [1, 1, 0] 的餘弦相似度是多少？", a: 0.5, tol: 0.001, hint: "內積 1，兩個長度都是 √2，1 ÷ 2。" },
        { q: `那 ${C("RETURN vector.similarity.cosine([1.0, 0.0, 1.0], [1.0, 1.0, 0.0])")} 在 Neo4j 會回傳多少？`, a: 0.75, tol: 0.001, hint: "Neo4j 會把 −1 到 1 的餘弦值換算成 (1 + cos) / 2，落在 0 到 1。" },
        { q: "從段落 c2 出發，沿 MENTIONS 到實體、再沿 BASED_ON 或 USES（不看方向）走 0–2 步，會找到幾個不同的實體？", a: 4, tol: 0, hint: "BERT（0 步）→ Transformer（1 步）→ Attention、GPT（2 步）。" }
      ]
    },
    notes: [
      { h: "一句話記住", b: "向量負責「找到入口」，圖負責「把相關事實串起來」；回答時附上走過的節點與段落當出處。" },
      { h: "整體流程", b: `<ol><li>文件切塊（例如每塊 300 字、重疊 50 字）。</li><li>大型語言模型用結構化輸出抽出實體與關係，並對齊既有節點。</li><li>寫回 Neo4j：${C("(:Chunk)-[:MENTIONS]->(:Entity)")}，實體之間也有關係。</li><li>替每個 Chunk 算嵌入，建向量索引。</li><li>提問：向量找最像的段落 → 沿圖往外擴 → 組成提示 → 回答並附出處。</li></ol>` },
      { h: "迷你知識圖譜（練習用）", b: PRE(`CREATE (c1:Chunk {id: 'c1'}), (c2:Chunk {id: 'c2'}),
       (t:Entity {name: 'Transformer'}), (at:Entity {name: 'Attention'}),
       (bert:Entity {name: 'BERT'}), (gpt:Entity {name: 'GPT'}),
       (c1)-[:MENTIONS]->(t), (c1)-[:MENTIONS]->(at), (c2)-[:MENTIONS]->(bert),
       (bert)-[:BASED_ON]->(t), (gpt)-[:BASED_ON]->(t), (t)-[:USES]->(at);

MATCH (:Chunk {id: 'c2'})-[:MENTIONS]->(e:Entity)
MATCH (e)-[:BASED_ON|USES]-{0,2}(n:Entity)
RETURN collect(DISTINCT n.name) AS 相關實體;`) },
      { h: "向量索引與混合檢索", b: `<p>示範用 3 維向量；實際上維度要和你選的嵌入模型一致（例如 384、768、1024）。</p>` + PRE(`CREATE VECTOR INDEX chunk_emb IF NOT EXISTS
FOR (c:Chunk) ON c.embedding
OPTIONS {indexConfig: {
  \`vector.dimensions\`: 3,
  \`vector.similarity_function\`: 'cosine'
}};

MATCH (c:Chunk {id: 'c1'}) SET c.embedding = [1.0, 0.0, 1.0];
MATCH (c:Chunk {id: 'c2'}) SET c.embedding = [0.0, 1.0, 0.2];

CALL db.index.vector.queryNodes('chunk_emb', 2, [1.0, 0.1, 0.9])
YIELD node, score
RETURN node.id, round(score, 4);   // c1 約 0.998，c2 約 0.602`) },
      { h: "讓回答附出處", b: `<p>把檢索到的段落 id 和走過的實體關係一起放進提示，要求模型只根據這些內容回答、並標出用了哪幾段。對照純向量 RAG 時，用同一組多步問題比較：答對了幾題、出處能不能追回圖上的節點。</p>` }
    ],
    quiz: [
      { q: "GraphRAG 比純向量 RAG 多了什麼能力？", o: ["回答速度一定更快", "能沿著實體之間的關係，把分散在不同段落的事實串起來", "不需要嵌入模型", "不需要大型語言模型"], a: 1, w: "向量只比「像不像」；圖保存了「誰和誰有什麼關係」，多步推理的問題特別受惠。" },
      { q: "建立向量索引時，vector.dimensions 應該設成？", o: ["固定 3", "和嵌入模型輸出的向量長度一樣", "越大越好", "文件的段落數"], a: 1, w: "維度要和嵌入模型的輸出一致，否則寫入或查詢會失敗。" },
      { q: "LLM 從兩份文件分別抽出「BERT」和「Bert 模型」，寫回圖之前該做什麼？", o: ["各建一個節點", "實體對齊：判斷是同一事物後合成一個節點", "全部丟掉", "改用 CREATE"], a: 1, w: "不對齊的話，圖會被切成兩半，沿關係走就斷了。同名異物也要分開。" },
      { q: "vector.similarity.cosine 回傳 0.5，代表原本的餘弦值是？", o: ["0.5", "0", "1", "−0.5"], a: 1, w: "Neo4j 回傳 (1 + cos) / 2：0.5 對應 cos = 0，也就是兩個向量互相垂直。" },
      { q: "混合檢索的典型順序是？", o: ["先圖走訪，再用向量排序全部節點", "先用向量索引找出最像的段落當入口，再沿圖往外擴", "只用全文搜尋", "先讓 LLM 回答，再去找資料"], a: 1, w: "向量找入口、圖往外擴，最後把段落與事實交給模型並附上出處。" }
    ],
    next: "課程完成！回到首頁看看「我的學習」，把沒記熟的背誦卡再翻一輪；也可以把自己的筆記或專案資料匯入 Neo4j，做出你自己的知識圖譜。"
  }
];
