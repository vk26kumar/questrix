# Questrix — AI Assessment Creator

An AI-powered exam paper generation platform. Teachers can create assignments, generate structured question papers using AI, and download them as PDFs — all in real-time.

---

## Live Demo

- **Frontend:** https://questrix.vercel.app
- **Backend:** https://questrix-backend.onrender.com

---

## Features

- Assignment Creation — Upload materials, set due dates, configure question types and marks
- AI Question Generation — GPT-4o-mini powered structured question paper generation
- Real-time Updates — WebSocket (Socket.io) for live job progress tracking
- PDF Export — Download formatted question papers as PDF
- Background Jobs — BullMQ + Redis queue for async AI generation
- Mobile Responsive — Pixel-perfect on all screen sizes
- Assignment Management — View, search, filter, and delete assignments

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│              FRONTEND (Next.js 14)              │
│   Redux Toolkit | Socket.io-client | Tailwind   │
└──────────────────────┬──────────────────────────┘
                       │ HTTP + WebSocket
┌──────────────────────▼──────────────────────────┐
│           BACKEND (Express + TypeScript)        │
│     REST API | Socket.io | BullMQ Worker        │
└──────┬───────────────────────┬──────────────────┘
       │                       │
┌──────▼──────┐       ┌────────▼────────┐
│   MongoDB   │       │  Redis (Upstash) │
│ Assignments │       │  BullMQ Queue    │
│   Results   │       │  Job States      │
└─────────────┘       └────────┬─────────┘
                               │
                      ┌────────▼─────────┐
                      │   BullMQ Worker  │
                      │  OpenAI API Call │
                      │  Parse + Store   │
                      │  Notify via WS   │
                      └──────────────────┘
```

### Request Flow

1. Teacher fills the assignment form and clicks Generate
2. Frontend sends `POST /api/assignments` to the backend
3. Backend saves the assignment to MongoDB and adds a job to the BullMQ queue
4. `assignmentId` is returned immediately — non-blocking
5. BullMQ Worker picks up the job and calls the OpenAI API
6. AI response is parsed into structured JSON (sections, questions, difficulty, marks)
7. Result is saved to MongoDB
8. Socket.io emits `job:complete` event to the frontend
9. Frontend receives the event and navigates to the result page
10. Teacher views the structured question paper and downloads the PDF

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | Framework |
| TypeScript | Type safety |
| Redux Toolkit | State management |
| Tailwind CSS | Styling |
| Bricolage Grotesque | Typography |
| Socket.io-client | Real-time WebSocket |
| Axios | HTTP client |
| @react-pdf/renderer | PDF generation |
| Lucide React | Icons |

### Backend

| Technology | Purpose |
|---|---|
| Node.js + Express | Server |
| TypeScript | Type safety |
| MongoDB + Mongoose | Database |
| Redis (Upstash) | Cache and queue store |
| BullMQ | Background job queue |
| Socket.io | WebSocket server |
| OpenAI API (gpt-4o-mini) | AI generation |
| Zod | Validation |

---

## Project Structure

```
questrix/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── assignments/
│   │   │   │   ├── page.tsx                     # Assignments list
│   │   │   │   ├── create/
│   │   │   │   │   └── page.tsx                 # Create form
│   │   │   │   └── [id]/result/
│   │   │   │       └── page.tsx                 # Output page
│   │   ├── components/
│   │   │   ├── layout/                          # Sidebar, Navbar, MobileNav
│   │   │   ├── assignments/                     # Cards, EmptyState
│   │   │   ├── create/                          # Form, FileUpload, Stepper
│   │   │   ├── output/                          # QuestionPaper, AIBanner
│   │   │   └── ui/                              # Button, Input, Badge, Loader
│   │   ├── store/                               # Redux Toolkit slices
│   │   ├── hooks/                               # useWebSocket
│   │   ├── lib/                                 # api.ts, pdfExport.ts
│   │   └── types/                               # Shared TypeScript types
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/                              # MongoDB, Redis connections
│   │   ├── models/                              # Mongoose models
│   │   ├── routes/                              # API routes
│   │   ├── controllers/                         # Route handlers
│   │   ├── services/                            # AI service
│   │   ├── queues/                              # BullMQ queue + worker
│   │   ├── socket/                              # Socket.io setup
│   │   └── index.ts                             # Entry point
│   └── package.json
│
├── docker-compose.yml                           # Local MongoDB + Redis
└── README.md
```

---

## Local Setup

### Prerequisites

- Node.js 20+
- Docker + Docker Compose (for local MongoDB and Redis)
- OpenAI API Key

### 1. Clone the repository

```bash
git clone https://github.com/vk26kumar/questrix.git
cd questrix
```

### 2. Start local databases

```bash
docker-compose up -d
```

### 3. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values (see Environment Variables section below)
npm run dev
```

### 4. Setup Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Fill in your .env.local values
npm run dev
```

### 5. Open in browser

```
Frontend:  http://localhost:3000
Backend:   http://localhost:5000
```

---

## Environment Variables

### Backend `.env`

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://admin:questrix_secret@localhost:27017/questrix?authSource=admin
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=your_openai_api_key_here
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WS_URL=http://localhost:5000
```

---

## Deployment

### Frontend — Vercel

1. Connect the GitHub repository to Vercel
2. Set Root Directory to `frontend`
3. Framework will be auto-detected as Next.js
4. Add environment variables:
   - `NEXT_PUBLIC_API_URL=https://questrix-backend.onrender.com/api`
   - `NEXT_PUBLIC_WS_URL=https://questrix-backend.onrender.com`
5. Click Deploy

### Backend — Render

1. Connect the GitHub repository to Render as a Web Service
2. Set Root Directory to `backend`
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Add environment variables in the Render dashboard (see above, using production values)

### Worker — Render

1. Create a second Web Service on Render from the same repository
2. Set Root Directory to `backend`
3. Build Command: `npm install && npm run build`
4. Start Command: `node dist/queues/worker.js`
5. Add the same environment variables as the backend service

### Databases

- **MongoDB:** MongoDB Atlas free tier
- **Redis:** Upstash free tier (use `rediss://` URL for TLS)

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/assignments` | Create assignment and queue AI generation |
| GET | `/api/assignments` | List all assignments |
| GET | `/api/assignments/:id` | Get single assignment |
| DELETE | `/api/assignments/:id` | Delete assignment |
| GET | `/api/assignments/:id/result` | Get generated question paper |
| POST | `/api/assignments/:id/regenerate` | Regenerate question paper |

---

## Bonus Features Implemented

- PDF Download — properly formatted, not raw HTML print
- Regenerate question paper action
- Difficulty badges (Easy / Moderate / Challenging)
- Real-time generation progress via WebSocket
- Redis caching for assignment results
- Mobile responsive design
- Search and filter assignments

---

## Author

Vishal Kumar
---

## License

MIT