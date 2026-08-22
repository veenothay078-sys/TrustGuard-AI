# 🛡️ TrustGuard – AI-Powered Scam & Fraud Risk Manager

> **AI-assisted risk assessment tool for detecting potential scams, phishing, and fraud in digital content.**
> This system provides decision support only and is **not a guaranteed scam detector**.
> Always verify suspicious content through official channels.

---

## 🚀 Live Demo

The application runs in **Demo Mode** by default — no API key required.

| Service | URL |
|---|---|
| Backend API | http://localhost:5000 |
| Web Dashboard | http://localhost:5174 (or 5173) |
| API Health | http://localhost:5000/api/health |

---

## 📋 Problem Statement

Millions of people worldwide fall victim to scams, phishing, and digital fraud every year. Fraudsters exploit human psychology with urgency, fear, and impersonation to steal money and personal information. Most victims don't have the technical expertise to identify suspicious content before it's too late.

TrustGuard addresses this gap by providing an AI-powered decision support tool that:
- Analyzes suspicious content for risk indicators
- Explains WHY content is considered risky
- Provides evidence-backed guidance from a cybersecurity knowledge base
- Recommends specific safety actions

---

## 🎯 Objectives

1. Detect scam/phishing/fraud risk in text, URLs, webpages, and screenshots
2. Generate transparent 0–100 risk scores with factor breakdown
3. Classify content into 12 scam categories
4. Provide explainable AI reasons for every risk assessment
5. Back explanations with RAG-retrieved cybersecurity knowledge
6. Deliver results via browser extension (real-time) and web dashboard

---

## ✨ Features

| Feature | Description |
|---|---|
| 📝 Text Analysis | Analyze SMS, email, WhatsApp messages, or any text |
| 🔗 URL Analysis | Check URLs for phishing patterns and suspicious characteristics |
| 🌐 Page Scanner | Analyze full webpage content via browser extension |
| 📸 Screenshot OCR | Upload screenshots → OCR extracts text → AI analyzes |
| 🧠 Explainable AI | Every score comes with specific reasons and supporting evidence |
| 📚 RAG Pipeline | 22+ cybersecurity knowledge documents back every analysis |
| 💬 AI Chat | Conversational assistant to explain results in plain language |
| 📊 Dashboard | Charts showing risk distribution, trends, and categories |
| 📋 History | Search, filter, and manage all previous analyses |
| 🔌 Extension | Chrome/Edge MV3 extension with popup and context menus |
| 🎭 Demo Mode | Fully functional without any API key |
| ⚙️ Admin View | System status, memory usage, API endpoint reference |

---

## 🏗️ Architecture

```
Browser Extension (Manifest V3)
        │
        ├── Popup UI (popup.html/js/css)
        ├── Content Script (content.js)
        └── Background Worker (background.js)
                │
                ▼
        Backend REST API (Express.js :5000)
                │
                ├── Input Validation & Rate Limiting
                │
                ├── Risk Scoring Engine (Heuristic, 0-100)
                │        └── Keyword detection, URL analysis
                │
                ├── RAG Knowledge Retrieval
                │        └── 22 cybersecurity knowledge docs
                │        └── Keyword-based semantic matching
                │
                ├── AI Analysis (Google Gemini API)
                │        └── Structured JSON response
                │        └── Demo Mode fallback
                │
                └── MongoDB (Analysis, ChatSession models)
                        │
                        ▼
        Web Dashboard (React + Vite :5173)
                │
                ├── Landing Page
                ├── Dashboard (Chart.js)
                ├── Analyze Page (4 input types)
                ├── History Page (search/filter/paginate)
                ├── Report Page (full detail)
                └── Admin Page
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Browser Extension | Chrome Manifest V3, Vanilla JS/CSS |
| Frontend | React 19, Vite, React Router, Chart.js, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| AI Integration | Google Gemini API (gemini-1.5-flash) |
| RAG | Keyword-based knowledge retrieval (22 docs) |
| OCR | Tesseract.js |
| File Upload | Multer |
| Security | Helmet, CORS, express-rate-limit, express-validator |

---

## 📁 Project Structure

```
trustguard/
├── extension/              # Chrome/Edge MV3 Extension
│   ├── manifest.json
│   ├── popup/              # Popup UI (HTML/JS/CSS)
│   ├── content/            # Content script (page extraction)
│   ├── background/         # Service worker (context menus, notifications)
│   ├── options/            # Settings page
│   └── assets/icons/       # Extension icons
│
├── frontend/               # React + Vite Dashboard
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── RiskComponents.jsx
│   │   │   └── ChatPanel.jsx
│   │   ├── pages/          # Route pages
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AnalyzePage.jsx
│   │   │   ├── HistoryPage.jsx
│   │   │   ├── ReportPage.jsx
│   │   │   └── AdminPage.jsx
│   │   ├── services/api.js # API service layer
│   │   └── index.css       # Design system
│   └── vite.config.js
│
├── backend/                # Node.js/Express API
│   ├── server.js           # App entry point
│   ├── controllers/        # Route handlers
│   ├── routes/             # Express routes
│   ├── models/             # MongoDB schemas
│   ├── services/
│   │   └── riskScoring.js  # Heuristic scoring engine
│   ├── ai/
│   │   ├── aiService.js    # Gemini API abstraction
│   │   ├── prompts.js      # Prompt templates
│   │   └── demoMode.js     # Demo scenarios
│   ├── rag/
│   │   └── knowledgeBase.js # 22 cybersecurity docs + retrieval
│   └── utils/
│       └── database.js     # MongoDB connection
│
├── dataset/
│   └── sample_data.json    # 12 labeled development samples
│
├── tests/
│   └── api.test.js         # 24-test suite
│
├── .env.example            # Environment variable template
└── README.md
```

---

## ⚙️ Environment Variables

```bash
# Copy to backend/.env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/trustguard
GEMINI_API_KEY=your_gemini_api_key_here   # Get from aistudio.google.com
AI_MODEL=gemini-1.5-flash
DEMO_MODE=true                            # Set false when API key is ready
API_SECRET_KEY=trustguard_local_secret
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE_MB=5
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB (optional — app works without it in demo mode)
- Chrome or Edge browser

### 1. Clone / Download

```bash
# The project is already in: C:\Users\veeno\OneDrive\Desktop\TRUSTGUARD AI
```

### 2. Backend Setup

```bash
cd backend
npm install
# Copy .env.example to .env and configure
cp ../.env.example .env
# Start backend
npm run dev
# Server runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
# Dashboard runs on http://localhost:5173
```

### 4. Run Tests

```bash
# From project root
node tests/api.test.js
# Expected: 24 passed, 0 failed
```

### 5. Load Chrome Extension

1. Open Chrome/Edge → `chrome://extensions`
2. Enable **Developer Mode** (toggle top-right)
3. Click **"Load unpacked"**
4. Select the `extension/` folder
5. Extension appears in toolbar — click 🛡️ TrustGuard

> **Note:** For the extension to work, the backend must be running on `http://localhost:5000`.
> You can change the backend URL in the extension's Settings (right-click extension → Options).

### 6. Enable Real AI (Optional)

1. Get a free Gemini API key from [aistudio.google.com](https://aistudio.google.com)
2. Edit `backend/.env`
3. Set `GEMINI_API_KEY=your_actual_key`
4. Set `DEMO_MODE=false`
5. Restart backend

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Backend health check |
| POST | `/api/analyze/text` | Analyze text content |
| POST | `/api/analyze/url` | Analyze URL |
| POST | `/api/analyze/page` | Analyze webpage |
| POST | `/api/analyze/screenshot` | Upload image for OCR + analysis |
| POST | `/api/chat` | AI chat with analysis context |
| POST | `/api/rag/search` | Search knowledge base |
| GET | `/api/analysis/history` | Get analysis history |
| GET | `/api/analysis/:id` | Get specific analysis |
| DELETE | `/api/analysis/:id` | Delete analysis |
| GET | `/api/dashboard/statistics` | Dashboard stats |
| GET | `/api/dashboard/admin` | Admin/developer stats |

### Example: Text Analysis

```bash
POST /api/analyze/text
Content-Type: application/json

{
  "text": "URGENT: Your bank account has been suspended..."
}

Response:
{
  "analysisId": "uuid",
  "riskScore": 87,
  "riskLevel": "CRITICAL",
  "categories": ["Phishing Risk", "Account Takeover Risk"],
  "indicators": [...],
  "summary": "...",
  "recommendations": [...],
  "uncertainty": "...",
  "ragEvidence": [...]
}
```

---

## 🎭 Demo Mode

Demo Mode provides realistic pre-configured analysis scenarios without requiring a Gemini API key.

**Demo Scenarios:**
1. 🏦 Fake Bank Alert SMS → CRITICAL (91/100)
2. 🎁 Prize/Reward Scam → CRITICAL (87/100)
3. 📈 Investment Scam → CRITICAL (84/100)
4. 🛒 Suspicious Shopping Website → HIGH (62/100)
5. ✅ Legitimate Website → LOW (8/100)

All demo results are clearly labeled with **⚡ DEMO DATA**.

---

## 📊 Risk Scoring

| Score Range | Level | Meaning |
|---|---|---|
| 0 – 20 | ✅ LOW | No significant indicators detected |
| 21 – 50 | ⚠️ MODERATE | Some suspicious characteristics |
| 51 – 75 | 🔴 HIGH | Multiple risk indicators detected |
| 76 – 100 | 🚨 CRITICAL | Strong scam/fraud indicators |

**Score = 0.7 × AI Score + 0.3 × Heuristic Score**

---

## 🔒 Security

- ✅ API keys stored server-side only (never in extension or frontend)
- ✅ Rate limiting (100 req/15 min by default)
- ✅ Input validation on all endpoints
- ✅ File type and size validation for uploads
- ✅ CORS configured for extension and frontend origins only
- ✅ Helmet security headers
- ✅ No silent browsing history collection
- ✅ Extension only activates when user explicitly requests analysis

---

## 🚧 Limitations

1. **Not a guaranteed detector** — AI pattern detection can have false positives/negatives
2. **No real-time blocklist** — Does not check URLs against live threat intelligence feeds
3. **OCR accuracy** — Image quality affects text extraction
4. **Demo Mode** — Pre-configured results are illustrative, not from actual AI analysis
5. **No authentication** — Backend should be deployed with proper auth in production
6. **RAG** — Uses keyword-based matching; production system would benefit from vector search

---

## 🔮 Future Enhancements

- [ ] Vector database (Pinecone/ChromaDB) for semantic RAG
- [ ] Real-time URL reputation checking (VirusTotal API)
- [ ] User authentication and multi-user support
- [ ] Email header analysis
- [ ] Browser history analysis (opt-in only)
- [ ] Evaluation metrics dashboard (F1, AUC-ROC)
- [ ] Fine-tuned model on labeled scam dataset
- [ ] Multi-language support
- [ ] Mobile app

---

## ⚠️ Important Disclaimer

> **TrustGuard provides AI-assisted risk assessment and is not a guaranteed scam detector. Results should not be treated as definitive legal or financial conclusions. Users should independently verify suspicious content through trusted official channels. This system assists human judgment — it does not replace it.**

---

*Built with ❤️ for cybersecurity awareness and digital safety.*
