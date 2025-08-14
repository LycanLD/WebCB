// Simple Express backend to proxy GPT API requests
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const GPT_API_KEY = process.env.GPT_API_KEY;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;
    if (!GPT_API_KEY) {
        return res.status(500).json({ reply: 'GPT API key not set.' });
    }
    try {
        const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GPT_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: userMessage }],
                max_tokens: 150
            })
        });
        const gptData = await gptRes.json();
        const reply = gptData.choices?.[0]?.message?.content || 'No response.';
        res.json({ reply });
    } catch (err) {
        res.status(500).json({ reply: 'Error contacting GPT API.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
