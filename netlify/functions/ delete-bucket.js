<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>For Soumya 💖</title>

<style>
:root {
  --pink:#ff8fb1;
  --pink2:#ffd1dc;
  --bg1:#fff0f5;
  --bg2:#ffe4e1;
  --ink:#4b2c2c;
}

body {
  margin:0;
  font-family:system-ui,-apple-system,Segoe UI,Roboto;
  background:linear-gradient(180deg,var(--bg1),var(--bg2));
  color:var(--ink);
}

.container {
  max-width:900px;
  margin:auto;
  padding:24px 14px 140px;
}

.card {
  background:#fff;
  border-radius:22px;
  padding:18px;
  box-shadow:0 10px 25px rgba(0,0,0,.08);
  margin:16px 0;
}

.hero { text-align:center; }

h1,h2 { margin:.4rem 0; }

.mood-row {
  display:flex;
  gap:10px;
  flex-wrap:wrap;
}

.pill {
  border:none;
  cursor:pointer;
  padding:10px 14px;
  border-radius:999px;
  background:linear-gradient(180deg,var(--pink2),var(--pink));
  color:#fff;
  font-weight:700;
}

.reply {
  margin-top:10px;
  font-style:italic;
}

/* Bucket list */
.bucket-input {
  display:flex;
  gap:10px;
}

.bucket-input input {
  flex:1;
  padding:12px;
  border-radius:12px;
  border:1px solid #ddd;
}

.bucket-input button {
  padding:12px 14px;
  border-radius:12px;
  border:none;
  background:var(--pink);
  color:#fff;
  font-weight:700;
  cursor:pointer;
}

ul {
  list-style:none;
  padding:0;
  margin-top:12px;
}

li {
  display:flex;
  justify-content:space-between;
  align-items:center;
  background:#fff6fa;
  border-radius:14px;
  padding:10px 12px;
  margin:8px 0;
}

.done {
  text-decoration:line-through;
  opacity:.6;
}

/* Cats */
.cat {
  position:fixed;
  bottom:20px;
  font-size:44px;
  cursor:pointer;
  user-select:none;
}

.cat .bubble {
  position:absolute;
  bottom:56px;
  left:50%;
  transform:translateX(-50%);
  background:#fff;
  padding:6px 10px;
  border-radius:999px;
  font-size:12px;
  opacity:0;
  transition:.2s;
  box-shadow:0 6px 15px rgba(0,0,0,.15);
  white-space:nowrap;
}

.cat .bubble.show { opacity:1; }

footer {
  position:fixed;
  bottom:0;
  left:0;
  right:0;
  background:rgba(255,255,255,.85);
  text-align:center;
  padding:12px;
  font-size:13px;
}
</style>
</head>

<body>

<div class="container">

  <div class="card hero">
    <h1>Hey Soumya 💕</h1>
    <div id="dailyMessage"></div>
  </div>

  <div class="card">
    <h2>How are you cutiee? 🥰</h2>
    <div class="mood-row">
      <button class="pill" data-mood="happy">Happy 😊</button>
      <button class="pill" data-mood="sad">Sad 🥺</button>
      <button class="pill" data-mood="tired">Tired 😴</button>
      <button class="pill" data-mood="excited">Excited ✨</button>
    </div>
    <div class="reply" id="moodReply"></div>
  </div>

  <div class="card">
    <h2>Our Cute Bucket List 🐾</h2>
    <div class="bucket-input">
      <input id="bucketInput" placeholder="Add something sweet…" />
      <button id="bucketAdd">Add</button>
    </div>
    <ul id="bucketList"></ul>
  </div>

</div>

<!-- Cats -->
<div class="cat" id="cat1" style="left:10%">
  🐱
  <div class="bubble">hi Soumya 💕</div>
</div>

<div class="cat" id="cat2" style="left:80%">
  🐱
  <div class="bubble">purr… 🐾</div>
</div>

<footer>Made with love 💗</footer>

<script>
/* -----------------------
   Helpers
----------------------- */
function post(fn, payload) {
  return fetch(`/.netlify/functions/${fn}`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

/* -----------------------
   Log visit
----------------------- */
post("log-event", { event_type: "visit", value: "open" });

/* -----------------------
   Daily message
----------------------- */
const messages = [
  "You make the world softer just by existing 💖",
  "If smiles were stars, you’d be a galaxy ✨",
  "You are deeply cherished 💞",
  "A cat somewhere is purring for you 🐾"
];
document.getElementById("dailyMessage").textContent =
  messages[Math.floor(Math.random() * messages.length)];

/* -----------------------
   Mood buttons
----------------------- */
const moodReply = {
  happy:"That smile is adorable 💫",
  sad:"Soft hugs for you 🤍",
  tired:"Rest a little, sweetheart 🌙",
  excited:"Your joy is glowing ✨"
};

document.querySelectorAll(".pill").forEach(btn => {
  btn.onclick = () => {
    const mood = btn.dataset.mood;
    document.getElementById("moodReply").textContent = moodReply[mood];
    post("log-event", { event_type:"mood", value:mood });
  };
});

/* -----------------------
   Bucket list
----------------------- */
const list = document.getElementById("bucketList");

document.getElementById("bucketAdd").onclick = async () => {
  const input = document.getElementById("bucketInput");
  const text = input.value.trim();
  if (!text) return;
  input.value = "";

  const res = await post("add-bucket", { text });
  const item = await res.json();

  const li = document.createElement("li");
  li.innerHTML = `
    <span>${item.text}</span>
    <div>
      <button>✔</button>
      <button>✖</button>
    </div>
  `;

  li.children[1].children[0].onclick = () => {
    li.classList.toggle("done");
    post("update-bucket", {
      id: item.id,
      done: li.classList.contains("done")
    });
  };

  li.children[1].children[1].onclick = () => {
    li.remove();
    post("delete-bucket", { id: item.id });
  };

  list.appendChild(li);
};

/* -----------------------
   Cats
----------------------- */
document.querySelectorAll(".cat").forEach(cat => {
  cat.onclick = () => {
    const bubble = cat.querySelector(".bubble");
    bubble.classList.add("show");
    setTimeout(() => bubble.classList.remove("show"), 2000);
  };

  setInterval(() => {
    cat.style.left = Math.random() * (window.innerWidth - 60) + "px";
  }, 3000);
});
</script>

</body>
</html>
