const chat = document.getElementById("chat");
const input = document.getElementById("input");

function normalize(text) {
  return text.replace(/\n{3,}/g, "\n\n");
}

function add(text, sender) {
  const div = document.createElement("div");
  div.className = `msg ${sender}`;

  if (sender === "ai") {
    div.innerHTML = "<b>EL:</b><br>" + marked.parse(normalize(text));
  } else {
    div.innerHTML = "<b>Kamu:</b><br>" + text;
  }

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}

async function send() {
  const msg = input.value.trim();
  if (!msg) return;

  add(msg, "user");
  input.value = "";

  const typing = add("⏳ EL sedang mengetik...", "ai");

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: msg })
  });

  const data = await res.json();
  typeEffect(typing, data.reply);
}

function typeEffect(el, text) {
  el.innerHTML = "<b>EL:</b><br>";
  let i = 0;

  function step() {
    if (i < text.length) {
      el.innerHTML += text[i++];
      chat.scrollTop = chat.scrollHeight;
      setTimeout(step, 12);
    } else {
      el.innerHTML = "<b>EL:</b><br>" + marked.parse(normalize(text));
    }
  }
  step();
}

window.onload = () => {
  add("Halo 👋 Saya **EL**, AI seperti ChatGPT. Ada yang bisa saya bantu?", "ai");
};
