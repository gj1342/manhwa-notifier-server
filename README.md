# Manhwa Notifier API

Backend service for the **Manhwa / Manga Update Notifier** application.
It exposes a RESTful JSON API that lets users register, authenticate and manage a personalised list of manga URLs to track. The service is also responsible for scraping each tracked site on a schedule and sending email notifications when new chapters are detected.

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
• **Validation** – express-validator  
• **Env Mgmt** – dotenv

---

## Project Structure

```text
Manhwa-Notifier-Api/
├── src/
│   ├── config/          # Environment, database, endpoint configuration
│   │   ├── endpoints.js # Centralized API endpoint constants
│   ├── controllers/     # Route handlers (auth, manga CRUD)
│   ├── middleware/      # Express middleware (auth, validation, global errors)
│   ├── models/          # Mongoose schemas (User, TrackedManga, ScrapingConfig)
│   ├── routes/          # API route definitions, grouped by domain
│   ├── services/        # Domain services (email, scraper)
│   ├── utils/           # Helper/utility functions
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
   MONGODB_URI=mongodb://localhost:27017/manhwa-notifier
   JWT_SECRET=supersecret
   JWT_EXPIRES_IN=1h
   EMAIL_USERNAME=your@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```
3. **Run the server**
   ```bash
   npm start
   # or: npm run dev
   ```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Launch server in production mode |
| `npm run dev` | Launch with nodemon (auto-restart on changes) |

---

## API Endpoints (brief)

All endpoint paths are centralized in `src/config/endpoints.js` and used throughout the codebase for consistency.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/auth/register` | Register new user (with validation) |
| POST   | `/auth/login`    | User login, returns JWT |
| POST   | `/manga`         | Add manga URL (auth, with validation) |
| GET    | `/manga`         | List tracked manga |
| GET    | `/manga/:id`     | Get single tracked manga |
| PUT    | `/manga/:id`     | Update tracked manga |
| DELETE | `/manga/:id`     | Delete tracked manga |

---

## Validation Middleware

Request validation is handled using `express-validator` middleware. Validation logic for user registration and tracked manga creation is defined in `src/middleware/validation.js` and applied in the relevant routes. This ensures all incoming data is checked for correctness before reaching controllers.

---

## Contributing
Pull requests are welcome. Please open an issue first to discuss any major changes.

---

© 2024 Manhwa Notifier 