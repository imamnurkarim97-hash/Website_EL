async function sendMessage() {
  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");

  const message = input.value.trim();
  if (!message) return;

  chatBox.innerHTML += `
    <div class="chat user">
      <b>Kamu:</b><br>${message}
    </div>
  `;

  input.value = "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    if (!res.ok) {
      throw new Error("Server error");
    }

    const data = await res.json();

    chatBox.innerHTML += `
      <div class="chat ai">
        <b>EL:</b><br>${data.reply}
      </div>
    `;

    chatBox.scrollTop = chatBox.scrollHeight;

  } catch (err) {
    chatBox.innerHTML += `
      <div class="chat ai error">
        <b>EL:</b><br>Maaf, EL gagal merespon.
      </div>
    `;
  }
}
