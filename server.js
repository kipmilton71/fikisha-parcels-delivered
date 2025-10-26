const express = require('express');
const cors = require('cors');
const { APIRoutes } = require('./src/api/routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.all('/api/*', async (req, res) => {
  try {
    const response = await APIRoutes.handleRequest(req);
    
    // Convert Response to Express-like response
    const body = await response.text();
    const status = response.status;
    const headers = Object.fromEntries(response.headers.entries());
    
    res.status(status);
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    res.send(body);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Fikisha API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API endpoint: http://localhost:${PORT}/api/delivery-tasks`);
});


