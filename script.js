let spots = [];
try { spots = JSON.parse(localStorage.getItem("spots")) || []; } catch (e) {}

function save() {
  try { localStorage.setItem("spots", JSON.stringify(spots)); } catch (e) {}
}

function render() {
  const list = document.getElementById("list");
  list.innerHTML = "";
  spots.forEach((s, i) => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = "<h2></h2><small></small><p></p><button>削除</button>";
    div.querySelector("h2").textContent = s.name;
    div.querySelector("small").textContent = s.area;
    div.querySelector("p").textContent = s.comment;
    div.querySelector("button").onclick = () => {
      spots.splice(i, 1);
      save();
      render();
    };
    list.appendChild(div);
  });
}

document.getElementById("form").onsubmit = e => {
  e.preventDefault();
  spots.unshift({
    name: document.getElementById("name").value.trim(),
    area: document.getElementById("area").value.trim(),
    comment: document.getElementById("comment").value.trim()
  });
  save();
  render();
  e.target.reset();
};

render();