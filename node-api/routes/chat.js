const express = require('express');
const router = express.Router();
const { sendMessageToPythonBot } = require('../services/python');

router.post('/', async (req, res) => {
  const { message } = req.body;
    if (!message || typeof message !== 'string' || message.length === 0) 
    {
    return res.status(400).json({ error: 'Message must be a nonempty string' });
    }
    try {
    const pythonBotResponse = await sendMessageToPythonBot(message);
    res.json(pythonBotResponse);
  } catch (error) {
    console.error('Error communicating with Python bot:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;