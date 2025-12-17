async function sendMessage() {
  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");

  const message = input.value.trim();
  if (!message) return;

  // Tampilkan pesan user
  const userDiv = document.createElement("div");
  userDiv.className = "chat user";
  userDiv.innerHTML = `<b>Kamu:</b><br>${message}`;
  chatBox.appendChild(userDiv);

  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  // Loading AI
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "chat ai loading";
  loadingDiv.innerHTML = `<b>EL:</b><br><i>mengetik...</i>`;
  chatBox.appendChild(loadingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    loadingDiv.classList.remove("loading");
    loadingDiv.innerHTML = `<b>EL:</b><br>${formatText(data.reply)}`;
    chatBox.scrollTop = chatBox.scrollHeight;

  } catch (err) {
    loadingDiv.innerHTML = `<b>EL:</b><br><span style="color:red">Gagal merespon</span>`;
  }
}

// Supaya teks rapi & mudah dibaca (mirip ChatGPT)
function formatText(text) {
  return text
    .replace(/\n/g, "<br>")
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/\*(.*?)\*/g, "<i>$1</i>");
}
