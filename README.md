# Swimore.ai

> High-Performance AI Inference Gateway & Modern Playground Interface.

Swimore.ai provides a unified API gateway and responsive client workspace for multi-provider LLM inference, failover management, and developer telemetry.

---

## 🚀 Overview

- **Unified Ingress Gateway**: Standardized OpenAI-compatible inference endpoints with dynamic upstream routing and automatic failover.
- **Client Workspace**: Sleek dark-mode interface featuring chat streaming, model comparison, partner marketplace, and API key management.
- **Client-Side Ephemeral Security**: Support for client-side zero-knowledge encryption using Web Crypto (AES-GCM-256) with ephemeral session scrubbing.
- **Real-Time Telemetry**: Real-time tracking of latency (p50/p95), tokens per second (TPS), upstream provider status, and quota usage.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite, Zustand, Lucide Icons
- **Backend**: Go (Gin Web Framework), High-Throughput HTTP Proxy Engine
- **Deployment**: Docker, Caddy Reverse Proxy, Containerized Workflows

---

## 📁 Repository Structure

```text
swimore.ai/
├── backend/                # Go API Gateway & Routing Engine
│   ├── cmd/                # CLI & entrypoints
│   ├── config/             # Configuration loaders
│   ├── controller/         # API HTTP route controllers
│   ├── middleware/         # Auth, CORS, Audit, and Rate Limiting
│   ├── model/              # Domain models & DTOs
│   ├── router/             # Gin route definitions
│   └── main.go             # Application entry point
├── frontend/               # React + TypeScript Workspace
│   ├── src/
│   │   ├── components/     # Reusable UI components & layouts
│   │   ├── features/       # Feature views (Chat, Models, Marketplace, Pricing, Keys)
│   │   ├── services/       # Client encryption & API clients
│   │   ├── store/          # Zustand application state
│   │   └── routes/         # React Router navigation
│   ├── package.json
│   └── vite.config.ts
├── deploy/                 # Dockerfile & reverse proxy configuration
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   ├── Caddyfile
│   └── compose.yaml
└── README.md
```

---

## 💻 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **Go**: v1.22 or higher
- **Git**

---

### 1. Backend Gateway Setup

```bash
# Navigate to backend directory
cd backend

# Download Go dependencies
go mod download

# Start the gateway server (defaults to port :8080)
go run main.go
```

The gateway health probe is accessible at `http://localhost:8080/health`.

---

### 2. Frontend Workspace Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend application will be live at `http://localhost:5173` (or `http://localhost:4173` for production preview).

---

## 🧪 Testing

```bash
# Test backend gateway endpoints
cd backend
node test_layer3_gateway.mjs

# Test client encryption & storage
cd frontend
node test_layer2.mjs
```

---

## 📄 License

© 2026 Swimore.ai. All rights reserved. Proprietary software — unauthorized copying, modification, or redistribution is strictly prohibited.

