import './config/env.js';
import http from 'http';
import connectDB from './config/db.js';
import app from './app.js';

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();

  http.createServer(app).listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})(); 