function openChat() {
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("chat").classList.remove("hidden");
}

function openImage() {
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("image").classList.remove("hidden");
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const chatBox = document.getElementById("chatBox");
  const text = input.value.trim();
  if (!text) return;

  const userMsg = document.createElement("div");
  userMsg.className = "message user";
  userMsg.textContent = text;
  chatBox.appendChild(userMsg);
  input.value = "";

  const aiMsg = document.createElement("div");
  aiMsg.className = "message ai";
  aiMsg.textContent = "⏳ EL sedang berpikir...";
  chatBox.appendChild(aiMsg);

  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    aiMsg.textContent = data.reply || "EL tidak bisa menjawab.";

  } catch {
    aiMsg.textContent = "❌ Gagal terhubung ke AI.";
  }
}

function generateImage() {
  const prompt = document.getElementById("imgPrompt").value;
  document.getElementById("imgResult").innerHTML =
    "<p>🖼️ (Demo) Gambar untuk: <b>" + prompt + "</b></p>";
}
