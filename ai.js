const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = sender;
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  userInput.value = "";

  addMessage("⏳ AI sedang mengetik...", "ai");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    // hapus loading
    chatBox.removeChild(chatBox.lastChild);

    if (data.reply) {
      addMessage(data.reply, "ai");
    } else {
      addMessage("❌ AI tidak merespon.", "ai");
    }

  } catch (error) {
    chatBox.removeChild(chatBox.lastChild);
    addMessage("❌ Terjadi error koneksi.", "ai");
    console.error(error);
  }
}
