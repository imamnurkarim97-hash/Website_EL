async function sendMessage() {
  const input = document.getElementById("userInput");
  const chatBox = document.getElementById("chatBox");

  const text = input.value.trim();
  if (!text) return;

  // pesan user
  const userMsg = document.createElement("div");
  userMsg.className = "message user";
  userMsg.textContent = text;
  chatBox.appendChild(userMsg);

  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  // typing
  const typing = document.createElement("div");
  typing.className = "message ai typing";
  typing.textContent = "EL sedang mengetik...";
  chatBox.appendChild(typing);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    typing.remove();

    const aiMsg = document.createElement("div");
    aiMsg.className = "message ai";
    aiMsg.textContent = data.reply;
    chatBox.appendChild(aiMsg);

  } catch (e) {
    typing.remove();
    const err = document.createElement("div");
    err.className = "message ai";
    err.textContent = "EL gagal merespon.";
    chatBox.appendChild(err);
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}
