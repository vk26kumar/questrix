# Questrix — AI Assessment Creator

> An AI-powered exam paper generation platform built for VedaAI. Teachers can create assignments, generate structured question papers using AI, and download them as PDFs — all in real-time.

![VedaAI](https://img.shields.io/badge/VedaAI-Assignment-orange?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-20-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-7-green?style=for-the-badge&logo=mongodb)
![Redis](https://img.shields.io/badge/Redis-7-red?style=for-the-badge&logo=redis)

---

## 🚀 Live Demo

- **Frontend:** [https://questrix.vercel.app](https://questrix.vercel.app)
- **Backend:** [https://questrix-api.onrender.com](https://questrix-api.onrender.com)

---

## ✨ Features

- 📝 **Assignment Creation** — Upload materials, set due dates, configure question types and marks
- 🤖 **AI Question Generation** — GPT-4o powered structured question paper generation
- ⚡ **Real-time Updates** — WebSocket (Socket.io) for live job progress
- 📄 **PDF Export** — Download formatted question papers as PDF
- 🔄 **Background Jobs** — BullMQ + Redis queue for async AI generation
- 📱 **Mobile Responsive** — Pixel-perfect on all screen sizes
- 🗂️ **Assignment Management** — View, search, filter, delete assignments

---

## 🏗️ Architecture
┌─────────────────────────────────────────────────┐
│              FRONTEND (Next.js 14)              │
│   Redux Toolkit │ Socket.io-client │ Tailwind   │
└──────────────────────┬──────────────────────────┘
│ HTTP + WebSocket
┌──────────────────────▼──────────────────────────┐
│           BACKEND (Express + TypeScript)        │
│     REST API │ Socket.io │ BullMQ Worker        │
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

### Flow
1. Teacher fills assignment form → clicks **Generate**
2. Frontend sends `POST /api/assignments` to backend
3. Backend saves assignment to MongoDB → adds job to **BullMQ** queue
4. Returns `assignmentId` immediately (non-blocking)
5. **BullMQ Worker** picks up job → calls **OpenAI API**
6. AI response parsed into structured JSON (sections, questions, difficulty, marks)
7. Result saved to MongoDB
8. **Socket.io** emits `job:complete` event to frontend
9. Frontend receives event → navigates to result page
10. Teacher views structured question paper → downloads PDF

---

## 🛠️ Tech Stack

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
| react-hook-form + Zod | Form validation |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | Server |
| TypeScript | Type safety |
| MongoDB + Mongoose | Database |
| Redis (Upstash) | Cache + Queue store |
| BullMQ | Background job queue |
| Socket.io | WebSocket server |
| OpenAI API (gpt-4o-mini) | AI generation |
| Zod | Validation |

---

## 📁 Project Structure
questrix/
├── frontend/                    # Next.js 14 App
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── assignments/
│   │   │   │   ├── page.tsx         # Assignments list
│   │   │   │   └── create/
│   │   │   │       └── page.tsx     # Create form
│   │   │   └── assignments/[id]/result/
│   │   │       └── page.tsx         # Output page
│   │   ├── components/
│   │   │   ├── layout/          # Sidebar, Navbar, MobileNav
│   │   │   ├── assignments/     # Cards, EmptyState
│   │   │   ├── create/          # Form, FileUpload, Stepper
│   │   │   ├── output/          # QuestionPaper, AIBanner
│   │   │   └── ui/              # Button, Input, Badge, Loader
│   │   ├── store/               # Redux Toolkit slices
│   │   ├── hooks/               # useWebSocket
│   │   ├── lib/                 # api.ts, pdfExport.ts
│   │   └── types/               # Shared TypeScript types
│   └── package.json
│
├── backend/                     # Express + TypeScript
│   ├── src/
│   │   ├── config/              # MongoDB, Redis connections
│   │   ├── models/              # Mongoose models
│   │   ├── routes/              # API routes
│   │   ├── controllers/         # Route handlers
│   │   ├── services/            # AI service
│   │   ├── queues/              # BullMQ queue + worker
│   │   ├── socket/              # Socket.io setup
│   │   └── index.ts             # Entry point
│   └── package.json
│
├── docker-compose.yml           # Local MongoDB + Redis
└── README.md

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 20+
- Docker + Docker Compose (for local MongoDB + Redis)
- OpenAI API Key

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/questrix.git
cd questrix
```

### 2. Start databases (local)
```bash
docker-compose up -d
```

### 3. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values
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
Frontend: http://localhost:3000
Backend:  http://localhost:5000

---

## 🌍 Environment Variables

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

## 🚢 Deployment

### Frontend → Vercel
```bash
cd frontend
vercel --prod
```

### Backend → Render
1. Connect GitHub repo to Render
2. Set root directory: `backend`
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Add environment variables in Render dashboard

### Database
- **MongoDB:** MongoDB Atlas free tier
- **Redis:** Upstash free tier

---

## 🎯 Bonus Features Implemented
- ✅ PDF Download (properly formatted, not raw HTML print)
- ✅ Regenerate question paper action
- ✅ Difficulty badges (Easy / Moderate / Challenging)
- ✅ Real-time generation progress via WebSocket
- ✅ Redis caching for assignment results
- ✅ Mobile responsive (pixel-perfect Figma match)
- ✅ Search and filter assignments

---

## 👨‍💻 Author

Built as part of VedaAI Full Stack Engineering Assignment.

---

## 📄 License

MIT