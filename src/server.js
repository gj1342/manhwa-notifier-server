const http = require('http');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = require('./app');

dotenv.config();

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();

  http.createServer(app).listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})(); 