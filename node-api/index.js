const express = require('express');
const axios = require('axios');
const chatRouter = require('./routes/chat');

const app = express();
app.use(express.json()); // parse JSON request bodies

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// mount chatRouter function to handle /chat routes
app.use('/chat', chatRouter);