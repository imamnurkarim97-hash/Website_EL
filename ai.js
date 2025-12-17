function parseMarkdown(text) {
  return text
    .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/\*(.*?)\*/g, "<i>$1</i>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br>");
}

async function sendMessage() {
  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  const typing = document.getElementById("typing");

  const message = input.value.trim();
  if (!message) return;

  // User bubble
  chatBox.innerHTML += `
    <div class="bubble user">${message}</div>
  `;
  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  // Show typing
  typing.classList.remove("hidden");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    typing.classList.add("hidden");

    chatBox.innerHTML += `
      <div class="bubble ai">${parseMarkdown(data.reply)}</div>
    `;
  } catch (e) {
    typing.classList.add("hidden");
    chatBox.innerHTML += `
      <div class="bubble ai">Maaf, EL gagal merespon.</div>
    `;
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}
