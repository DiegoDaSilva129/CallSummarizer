const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Replace with your OpenAI API key
const OPENAI_API_KEY = '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';
// Replace with the OpenAI API endpoint URL for the desired model
const OPENAI_API_URL = 'https://api.openai.com/v1/engines/davinci-codex/completions';

// Async function to summarize the call transcription text using OpenAI
async function summarizeText(text) {
  const data = {
    prompt: `Please provide a summary of the following call transcription: ${text}`,
    max_tokens: 100, // Adjust this value based on your desired summary length
    n: 1,
    stop: null,
    temperature: 0.7,
  };

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
  };

  try {
    const response = await axios.post(OPENAI_API_URL, data, { headers });
    const summary = response.data.choices[0].text.trim();
    return summary;
  } catch (error) {
    console.error('Error in generating summary:', error);
    return null;
  }
}

// API endpoint to generate the call transcription summary
app.post('/summarize', async (req, res) => {
  const callTranscription = req.body.transcription;

  if (callTranscription) {
    const summary = await summarizeText(callTranscription);

    if (summary) {
      res.json({ summary });
    } else {
      res.status(500).json({ error: 'Unable to generate summary' });
    }
  } else {
    res.status(400).json({ error: 'No transcription data found' });
  }
});

// Set up the server to listen on a specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
