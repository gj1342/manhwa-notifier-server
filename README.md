# Manhwa Notifier API

Backend service for the **Manhwa / Manga Update Notifier** application.
It exposes a RESTful JSON API that lets users register, authenticate and manage a personalised list of manga URLs to track.  The service is also responsible for scraping each tracked site on a schedule and sending email notifications when new chapters are detected.

---

## Tech Stack

• **Runtime** – Node.js (LTS)  
• **Framework** – Express.js  
• **Database** – MongoDB (with Mongoose ODM)  
• **Authentication** – JSON Web Tokens (JWT)  
• **Email** – Nodemailer + SMTP  
• **Scheduling** – node-cron (periodic scraping jobs)  
• **HTTP** – Axios (for outbound requests)  
• **Scraping** – Cheerio (static) & optional Puppeteer/Playwright for dynamic sites  
• **Env Mgmt** – dotenv

---

## Project Structure

```text
Manhwa-Notifier-Api/
├── src/
│   ├── config/          # Environment & database configuration
│   ├── controllers/     # Route handlers (auth, manga CRUD)
│   ├── middleware/      # Express middleware (auth, global errors)
│   ├── models/          # Mongoose schemas (User, TrackedManga, ScrapingConfig)
│   ├── routes/          # API route definitions, grouped by domain
│   ├── services/        # Domain services (email, scraper)
│   ├── utils/           # Helper/utility functions and validation
│   ├── app.js           # Express app instance (middleware + routes)
│   └── server.js        # Entry point – loads env, connects DB, starts server
├── .env                 # Local environment variables (never commit!)
├── package.json         # Dependencies & scripts
└── README.md            # This file
```

---

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure environment** – copy `.env.example` to `.env` and fill values:
   ```ini
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/manhwa-notifier
   JWT_SECRET=supersecret
   JWT_EXPIRES_IN=1h
   EMAIL_USERNAME=your@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```
3. **Run the server**
   ```bash
   npm start
   # or: node src/server.js
   ```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Launch server in production mode |
| `npm run dev` | Launch with nodemon (requires nodemon installed globally) |

---

## API Endpoints (brief)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login`    | User login, returns JWT |
| POST   | `/api/manga`         | Add manga URL (auth) |
| GET    | `/api/manga`         | List tracked manga |
| GET    | `/api/manga/:id`     | Get single tracked manga |
| PUT    | `/api/manga/:id`     | Update tracked manga |
| DELETE | `/api/manga/:id`     | Delete tracked manga |

---

## Contributing
Pull requests are welcome.  Please open an issue first to discuss any major changes.

---

© 2024 Manhwa Notifier 