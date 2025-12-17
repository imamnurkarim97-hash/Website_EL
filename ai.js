async function sendMessage() {
  const input = document.getElementById("userInput");
  const chatBox = document.getElementById("chatBox");

  const message = input.value.trim();
  if (!message) return;

  // tampilkan pesan user
  chatBox.innerHTML += `
    <div class="message user">
      <b>Kamu:</b><br>${message}
    </div>
  `;

  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  // typing indicator
  const typingEl = document.createElement("div");
  typingEl.className = "message ai typing";
  typingEl.id = "typing";
  typingEl.innerText = "EL sedang mengetik...";
  chatBox.appendChild(typingEl);
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

    // hapus typing
    typingEl.remove();

    if (!res.ok || !data.reply) {
      throw new Error("AI tidak memberi jawaban");
    }

    chatBox.innerHTML += `
      <div class="message ai">
        <b>EL:</b><br>${data.reply}
      </div>
    `;
  } catch (err) {
    // hapus typing jika error
    typingEl.remove();

    chatBox.innerHTML += `
      <div class="message ai">
        <b>EL:</b><br>Maaf, EL gagal merespon.
      </div>
    `;
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}
