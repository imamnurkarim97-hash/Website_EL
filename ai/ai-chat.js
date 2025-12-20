console.log("AI CHAT JS TERLOAD");

const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", sendMessage);

function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  // pesan user
  const userMsg = document.createElement("div");
  userMsg.className = "message user";
  userMsg.textContent = text;
  chatBox.appendChild(userMsg);

  userInput.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  // balasan AI (dummy dulu)
  setTimeout(() => {
    const aiMsg = document.createElement("div");
    aiMsg.className = "message ai";
    aiMsg.textContent = "🤖 EL: Pesan kamu diterima!";
    chatBox.appendChild(aiMsg);
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 500);
}
