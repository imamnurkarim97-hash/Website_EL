const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");

function renderMarkdown(text) {
  return text
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/\n/g, "<br>");
}

function addMessage(role, content, isMarkdown = false) {
  const div = document.createElement("div");
  div.className = `message ${role}`;
  div.innerHTML = isMarkdown ? renderMarkdown(content) : content;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
  return div;
}

async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  addMessage("user", message);
  input.value = "";

  const typingEl = addMessage("ai", "EL sedang mengetik...", false);
  typingEl.classList.add("typing");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    typingEl.remove();
    addMessage("ai", data.reply || "Maaf, EL tidak bisa merespon.", true);

  } catch (err) {
    typingEl.remove();
    addMessage("ai", "Terjadi kesalahan koneksi.", false);
  }
}
