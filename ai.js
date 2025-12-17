async function sendMessage() {
  const input = document.getElementById("userInput");
  const chatBox = document.getElementById("chatBox");

  const message = input.value.trim();
  if (!message) return;

  chatBox.innerHTML += `<div class="user"><b>Kamu:</b> ${message}</div>`;
  input.value = "";

  chatBox.innerHTML += `<div class="ai typing">EL sedang mengetik...</div>`;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    document.querySelector(".typing")?.remove();

    if (data.reply) {
      chatBox.innerHTML += `<div class="ai"><b>EL:</b> ${data.reply}</div>`;
    } else {
      chatBox.innerHTML += `<div class="ai error">EL error: ${JSON.stringify(data)}</div>`;
    }

  } catch (err) {
    document.querySelector(".typing")?.remove();
    chatBox.innerHTML += `<div class="ai error">Server error</div>`;
  }
}
