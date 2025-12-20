const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");

function addMessage(text, type){
  const div = document.createElement("div");
  div.className = "message " + type;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage(){
  const text = userInput.value.trim();
  if(!text) return;

  addMessage(text, "user");
  userInput.value = "";

  setTimeout(() => {
    addMessage("Halo! Saya EL, AI yang siap membantu kamu 😊", "ai");
  }, 500);
}
