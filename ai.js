const chat = document.getElementById("chat");
const input = document.getElementById("input");

window.onload = () => {
  addAI("Halo, saya EL. Ada yang bisa saya bantu?");
};

function addUser(text) {
  const div = document.createElement("div");
  div.className = "msg user";
  div.innerText = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function addAI(text) {
  const div = document.createElement("div");
  div.className = "msg ai";
  div.innerText = "EL: " + text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  addUser(message);
  input.value = "";

  const loading = document.createElement("div");
  loading.className = "msg ai loading";
  loading.id = "loading";
  loading.innerText = "EL sedang mengetik...";
  chat.appendChild(loading);
  chat.scrollTop = chat.scrollHeight;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    document.getElementById("loading").remove();
    addAI(data.reply);
  } catch {
    document.getElementById("loading").remove();
    addAI("Maaf, EL sedang mengalami gangguan.");
  }
}
