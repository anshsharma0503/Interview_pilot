# InterviewPilot

InterviewPilot is a full-stack interview preparation application. Users upload a PDF resume, provide a target job description and background summary, and receive an AI-generated interview report with a match score, strengths, skill gaps, practice questions, a preparation plan, and resume suggestions. Reports are stored per user, and a tailored resume can be generated and downloaded as a PDF.

## Features

- Account registration, login, session restoration, and logout
- HTTP-only cookie authentication with token invalidation on logout
- PDF resume upload and text extraction (maximum 3 MB)
- Gemini-powered interview analysis and tailored resume generation
- Per-user report history and report detail pages
- Tailored-resume PDF download
- Responsive React interface

## Technology stack

| Area | Technologies |
| --- | --- |
| Frontend | React, Vite, React Router, Axios, Tailwind CSS, Lucide React |
| Backend | Node.js, Express, Mongoose, Multer, pdf-parse, Puppeteer |
| Database | MongoDB Atlas or a compatible MongoDB deployment |
| AI | Google Gemini through `@google/genai` |
| Authentication | JWT stored in HTTP-only cookies, bcrypt password hashing |

## Folder structure

```text
InterviewPilot/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── server.js
└── Frontend/
    └── src/
        ├── features/
        ├── lib/
        ├── pages/
        └── routes/
```

## Prerequisites

- Node.js 20 or newer
- A MongoDB Atlas cluster or another accessible MongoDB instance
- A Google Gemini API key

## MongoDB Atlas setup

1. Create a project and cluster in MongoDB Atlas.
2. Create a database user with access to the application database.
3. Add the backend host to the Atlas network access list. Use a narrowly scoped address in production.
4. Copy the application connection string and replace its placeholder username, password, and database name.
5. Store the connection string only in `Backend/.env` as `MONGO_URI`.

## Backend setup

```bash
cd Backend
npm install
```

Copy `Backend/.env.example` to `Backend/.env`, then provide your own values:

```dotenv
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
JWT_SECRET=<long-random-secret>
GOOGLE_GENAI_API_KEY=<gemini-api-key>
```

Start the backend:

```bash
npm run dev
```

For a production-style start, use `npm start`.

## Frontend setup

```bash
cd Frontend
npm install
```

Copy `Frontend/.env.example` to `Frontend/.env`:

```dotenv
VITE_API_BASE_URL=http://localhost:3000
```

Start the frontend with `npm run dev` and open the URL shown by Vite.

`VITE_API_BASE_URL` is required in production and must point to the deployed backend origin. The application uses `http://localhost:3000` only as a local-development fallback.

## Development commands

Run these commands from the corresponding `Backend` or `Frontend` directory.

| Command | Location | Purpose |
| --- | --- | --- |
| `npm run dev` | Backend | Start the API with automatic restart |
| `npm start` | Backend | Start the API with Node.js |
| `npm run dev` | Frontend | Start the Vite development server |
| `npm run lint` | Frontend | Run ESLint |
| `npm run build` | Frontend | Create a production build |
| `npm run preview` | Frontend | Preview the production build locally |

## API routes

All routes are prefixed by the backend origin.

| Method | Route | Authentication | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/health` | No | Check API health |
| `POST` | `/api/auth/register` | No | Create an account |
| `POST` | `/api/auth/login` | No | Start an authenticated session |
| `GET` | `/api/auth/me` | Yes | Fetch the current user |
| `POST` | `/api/auth/logout` | Yes | Invalidate the current session |
| `POST` | `/api/interview` | Yes | Upload a resume and create a report |
| `GET` | `/api/interview` | Yes | List the current user's reports |
| `GET` | `/api/interview/:reportId` | Yes | Fetch one report owned by the user |
| `GET` | `/api/interview/:reportId/resume` | Yes | Generate or download a tailored resume PDF |

## Security notes

- Never commit `.env` files or real credentials. Only placeholder `.env.example` files belong in Git.
- Use a long, random `JWT_SECRET` in every deployed environment.
- Configure `FRONTEND_URL` to the exact deployed frontend origin; credentialed CORS is intentionally restricted to that origin.
- Production authentication cookies use `Secure`, `HttpOnly`, and `SameSite=None` for cross-origin deployment.
- Uploaded files are held in memory, restricted to PDF MIME type, and limited to 3 MB.
- Report queries are scoped to the authenticated user.
- Treat resume text and job descriptions as sensitive data and configure MongoDB access accordingly.
