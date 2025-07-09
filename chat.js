// public/chat.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#chat-form');
  const input = document.querySelector('#user-input');
  const messages = document.querySelector('#messages');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userInput = input.value.trim();
    if (!userInput) return;

    // Show user message
    const userMsg = document.createElement('div');
    userMsg.className = 'message user';
    userMsg.textContent = userInput;
    messages.appendChild(userMsg);
    input.value = '';

    // Show AI is thinking
    const thinkingMsg = document.createElement('div');
    thinkingMsg.className = 'message ai';
    thinkingMsg.textContent = 'AI is thinking...';
    messages.appendChild(thinkingMsg);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userInput })
      });

      const data = await res.json();
      thinkingMsg.textContent = data.message || 'No response.';
    } catch (err) {
      thinkingMsg.textContent = '❌ Error connecting to AI.';
    }
  });
});






