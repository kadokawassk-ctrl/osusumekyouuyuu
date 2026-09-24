// ---- 他の人の投稿（仮データ） ----
// ※ 本物の共有をするときは、ここをサーバーから取得したデータに置き換えます
const OTHERS = [
  { id: "o1", author: "さくら", name: "喫茶ミモザ", area: "下北沢", likes: 3,
    comment: "自家製プリンとネルドリップ珈琲が最高。平日午前が狙い目。" },
  { id: "o2", author: "たろう", name: "新宿御苑", area: "新宿", likes: 5,
    comment: "静かで散歩にぴったり。お弁当持参がおすすめ。" },
  { id: "o3", author: "みなみ", name: "らーめん龍", area: "高円寺", likes: 2,
    comment: "濃厚鶏白湯。夜は並ぶので開店直後が◎。" }
];

// ---- 保存・読み込み（ブラウザ内） ----
function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch (e) { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}

let mySpots = load("spots", []);   // 自分の投稿
let liked = load("liked", {});     // いいねした投稿のID { o1: true }
let wanted = load("wanted", {});   // 「行きたい！」した投稿のID { o1: true }
let currentTab = "all";            // 現在選択中のタブ ("all", "liked", "want")

// ---- タブ切り替え ----
function switchTab(tab) {
  currentTab = tab;
  document.getElementById("tab-all").classList.toggle("active", tab === "all");
  document.getElementById("tab-liked").classList.toggle("active", tab === "liked");
  document.getElementById("tab-want").classList.toggle("active", tab === "want");
  render();
}

// ---- 表示 ----
function render() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  // 自分の投稿 → 他の人の投稿 の順に並べる
  let all = [
    ...mySpots.map((s, i) => ({ ...s, id: "m" + i, mine: true, likes: 0 })),
    ...OTHERS.map(s => ({ ...s, mine: false }))
  ];

// タブによる絞り込み処理
  if (currentTab === "liked") {
    all = all.filter(s => liked[s.id]);
  } else if (currentTab === "want") {
    all = all.filter(s => wanted[s.id]);
  }

  // 該当する投稿がない場合のメッセージ表示
  if (all.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-msg";
    const msgMap = {
      liked: "いいねした投稿はありません",
      want: "「行きたい！」した投稿はありません",
      all: "投稿がありません"
    };
    empty.textContent = msgMap[currentTab];
    list.appendChild(empty);
    return;
  }

  all.forEach(s => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = "<h2></h2><small></small><p></p><span></span>";
    div.querySelector("h2").textContent = s.name;
    div.querySelector("small").textContent =
      (s.area ? s.area + " ・ " : "") + (s.mine ? "あなた" : s.author) + "の投稿";
    div.querySelector("p").textContent = s.comment;
    const box = div.querySelector("span");

    if (s.mine) {
      // 自分の投稿：削除だけできる（いいねはできない）
      const del = document.createElement("button");
      del.textContent = "削除";
      del.onclick = () => {
        mySpots.splice(Number(s.id.slice(1)), 1);
        save("spots", mySpots);
        render();
      };
      box.appendChild(del);
    } else {
      // 他の人の投稿：いいねできる
      const isLiked = !!liked[s.id];
      const btn = document.createElement("button");
      btn.className = isLiked ? "liked" : "";
      btn.textContent = (isLiked ? "♥ " : "♡ ") + (s.likes + (isLiked ? 1 : 0));
      btn.onclick = () => {
        liked[s.id] = !isLiked;
        save("liked", liked);
        render();
      };
      box.appendChild(btn);

      // 他の人の投稿：「行きたい！」ボタン
      const isWanted = !!wanted[s.id];
      const wantBtn = document.createElement("button");
      wantBtn.className = isWanted ? "wanted" : "";
      wantBtn.textContent = isWanted ? "★ 行きたい！" : "☆ 行きたい！";
      wantBtn.onclick = () => {
        wanted[s.id] = !isWanted;
        save("wanted", wanted);
        render();
      };
      box.appendChild(wantBtn);
    }
    list.appendChild(div);
  });
}

// ---- 投稿 ----
document.getElementById("form").onsubmit = e => {
  e.preventDefault();
  mySpots.unshift({
    name: document.getElementById("name").value.trim(),
    area: document.getElementById("area").value.trim(),
    comment: document.getElementById("comment").value.trim()
  });
  save("spots", mySpots);
  render();
  e.target.reset();
};

render();
