async function sendMessage() {
  const input = document.getElementById("userInput");
  const chatBox = document.getElementById("chat-box");

  const message = input.value.trim();
  if (!message) return;

  chatBox.innerHTML += `<div class="user"><b>Kamu:</b> ${message}</div>`;
  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  // Loading
  const loading = document.createElement("div");
  loading.className = "ai loading";
  loading.id = "loading";
  loading.innerText = "AI sedang mengetik...";
  chatBox.appendChild(loading);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    document.getElementById("loading").remove();
    chatBox.innerHTML += `<div class="ai"><b>AI:</b> ${data.reply}</div>`;
  } catch {
    document.getElementById("loading").remove();
    chatBox.innerHTML += `<div class="ai">❌ AI tidak merespon</div>`;
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}
