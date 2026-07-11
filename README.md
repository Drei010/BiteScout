# BiteScout

A restaurant finder powered by AI. Ask for restaurants in natural language and get results from Foursquare Places.

## Project Structure

```
BiteScout/
├── src/               # Express backend (API server)
├── frontend/          # Next.js frontend (chat UI)
├── package.json       # Root — backend deps + unified scripts
└── frontend/package.json
```

## Prerequisites

- Node.js (LTS) and npm
- Git

## Setup

### 1. Install dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend && npm install
```

### 2. Configure environment variables

Create a single `.env` in the project root:

```bash
PORT=3000
BACKEND_URL=http://localhost:3000
FOURSQUARE_API_KEY=your_foursquare_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
GROQ_API_KEY=your_groq_api_key_here
ACCESS_CODE=your_access_code_here
```

> Both the backend and frontend read from this single file. The frontend's `next.config.ts` loads it via dotenv and exposes `BACKEND_URL` and `ACCESS_CODE` to the Next.js server runtime. These are never exposed to the browser.

**Getting a Foursquare API Key:**

- Create an account at https://foursquare.com
- Create a project → Generate API key
- If approval is pending: Click "learn about keys" → Select Places API → Copy Header value as token

**Getting an OpenAI API Key:**

- Create an account at https://platform.openai.com
- Go to API keys section (https://platform.openai.com/api-keys)
- Click "Create new secret key" → Copy and save the key

**Getting a Groq API Key:**

- Create an account at https://console.groq.com
- Go to API Keys in the left sidebar
- Click "Create API Key" → Copy and save the key

> Groq is used as an automatic fallback when OpenAI is unavailable (rate limits, outages, etc.). Both keys are required.

### 3. Run the application

Start both backend and frontend with a single command:

```bash
npm run dev:all
```

This runs:
- **Backend** → `http://localhost:3000`
- **Frontend** → `http://localhost:3001`

Open `http://localhost:3001` in your browser to use the chat interface.

#### Run individually

```bash
# Backend only
npm run dev

# Frontend only
npm run dev:frontend
```

## Usage

Open the frontend at `http://localhost:3001` and type a natural language query like:

- "Find me cheap sushi in downtown Los Angeles"
- "I want pizza in Sydney"
- "Show me expensive Italian restaurants in BGC Taguig that are open now"

Results will appear in the chat with restaurant names, categories, and addresses.

## API Reference

### Backend

| Endpoint | Method | Params | Description |
|----------|--------|--------|-------------|
| `/api/execute` | GET | `message` (string), `code` (string) | Parses natural language via OpenAI and queries Foursquare |

### Frontend API Proxy

| Endpoint | Method | Body | Description |
|----------|--------|------|-------------|
| `/api/search` | POST | `{ "message": "..." }` | Proxies to backend with access code injected server-side |

## Troubleshooting

- **Missing variables** → Verify all keys are present in the root `.env`
- **Server won't start** → Ensure the `dev` script sets `NODE_ENV=development` (already configured in `package.json`)
- **Port conflict** → Change `PORT` in `.env` (backend) or edit the `--port` flag in `frontend/package.json` (frontend)
- **Frontend can't reach backend** → Ensure `BACKEND_URL` in `.env` matches the backend's actual port
- **Access denied errors** → Ensure `ACCESS_CODE` is set in the root `.env`

## Deploying to Vercel

This project deploys as a single Vercel project (monorepo). The backend runs as a serverless function under `/restaurantfinder` and the frontend is served at the root.

### Environment Variables (set in Vercel Dashboard)

| Variable | Value |
|----------|-------|
| `BACKEND_URL` | `https://bitescout-frontend.vercel.app/restaurantfinder` |
| `FOURSQUARE_API_KEY` | Your Foursquare API key |
| `OPENAI_API_KEY` | Your OpenAI API key |
| `GROQ_API_KEY` | Your Groq API key |
| `ACCESS_CODE` | Your access code |

### How it works

- Requests to `/restaurantfinder/*` are routed to the Express backend (`src/index.ts`)
- All other requests are served by the Next.js frontend (`frontend/`)
- The frontend's `/api/search` route proxies to the backend using `BACKEND_URL`
