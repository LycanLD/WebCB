// Assumes GPT API key is available in environment variable via backend
async function sendMessage(message) {
    const chatWindow = document.getElementById('chat-window');
    // Show user message
    appendMessage('user', message);
    // Show loading
    appendMessage('bot', '...');
    try {
        // Call backend API endpoint that wraps GPT API
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        const data = await response.json();
        // Remove loading
        removeLastBotMessage();
        appendMessage('bot', data.reply);
    } catch (err) {
        removeLastBotMessage();
        appendMessage('bot', 'Error: Could not reach GPT API.');
    }
}

function appendMessage(sender, text) {
    const chatWindow = document.getElementById('chat-window');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    msgDiv.textContent = text;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function removeLastBotMessage() {
    const chatWindow = document.getElementById('chat-window');
    const messages = chatWindow.getElementsByClassName('bot');
    if (messages.length > 0) {
        chatWindow.removeChild(messages[messages.length - 1]);
    }
}

document.getElementById('chat-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    if (message) {
        sendMessage(message);
        input.value = '';
    }
});
