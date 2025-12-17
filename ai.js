const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = `msg ${sender}`;
  div.innerHTML = sender === "ai"
    ? `<b>EL:</b><br>${marked.parse(text)}`
    : `<b>Kamu:</b><br>${text}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
  return div;
}

async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, "user");
  input.value = "";

  const typing = addMessage("⏳ EL sedang mengetik...", "ai");

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  const data = await res.json();
  typing.innerHTML = "<b>EL:</b><br>";

  typeEffect(typing, data.reply);
}

function typeEffect(el, text) {
  let i = 0;
  const speed = 15;

  function typing() {
    if (i < text.length) {
      el.innerHTML += text.charAt(i);
      i++;
      chatBox.scrollTop = chatBox.scrollHeight;
      setTimeout(typing, speed);
    } else {
      el.innerHTML = "<b>EL:</b><br>" + marked.parse(text);
    }
  }
  typing();
}

window.onload = () => {
  addMessage("Halo 👋 Saya **EL**. Ada yang bisa saya bantu?", "ai");
};
