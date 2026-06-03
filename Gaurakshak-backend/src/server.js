const app = require('./app');
const connectDB = require('./config/db');
const { PORT, NODE_ENV } = require('./config/env');

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`
  🙏 ========================================
  🙏  Gaurakshak Backend API
  🙏  Environment: ${NODE_ENV}
  🙏  Port: ${PORT}
  🙏  API: http://localhost:${PORT}/api
  🙏  Health: http://localhost:${PORT}/health
  🙏 ========================================
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
