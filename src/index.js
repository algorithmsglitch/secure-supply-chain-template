const express = require('express');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Demo API endpoint: Hash a password securely
app.post('/api/hash', async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Password required' });
    }

    // Bcrypt with salt rounds (secure by default)
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    res.status(200).json({
      success: true,
      hash: hashedPassword,
      message: 'Password hashed securely'
    });
  } catch (error) {
    console.error('Hash error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Demo API endpoint: Verify password
app.post('/api/verify', async (req, res) => {
  try {
    const { password, hash } = req.body;

    if (!password || !hash) {
      return res.status(400).json({ error: 'Password and hash required' });
    }

    const isValid = await bcrypt.compare(password, hash);

    res.status(200).json({
      success: true,
      isValid,
      message: isValid ? 'Password matches' : 'Password does not match'
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Info endpoint: Display build/deployment info (for audit)
app.get('/api/info', (req, res) => {
  res.status(200).json({
    app: 'secure-app-demo',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'production',
    buildTime: process.env.BUILD_TIME || 'unknown',
    commitSha: process.env.COMMIT_SHA || 'unknown',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Secure app demo running on port ${PORT}`);
  console.log(`📋 Health: http://localhost:${PORT}/health`);
  console.log(`ℹ️  Info: http://localhost:${PORT}/api/info`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = app;