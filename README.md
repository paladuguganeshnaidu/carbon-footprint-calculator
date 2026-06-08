# EcoCoach - Carbon Footprint Tracker & Eco Coach Platform

EcoCoach is a premium, lightweight, and production-ready web application designed to help users calculate, track, and offset their carbon footprint. The platform features an interactive calculator, personal analytics dashboards, gamified Eco-Challenges, streak rewards, and a simulated offsets marketplace.

---

## 🚀 Live Demo
*   **Production URL**: [http://206.189.139.23/](http://206.189.139.23/)
*   **Source Code**: [GitHub Repository](https://github.com/paladuguganeshnaidu/carbon-footprint-calculator)

---

## 🛠️ Tech Stack & Architecture

*   **Frontend**: React (v19) + Vite + TypeScript. Styled with modern HSL Custom Properties (CSS variables) for automatic light/dark mode and responsive layouts. Exclusively uses **Recharts** for visualizations.
*   **Backend**: Node.js + Express + TypeScript.
*   **Database**: SQLite + Drizzle ORM (Zero hosting cost, WAL-logging enabled for concurrent read/write scalability).
*   **Authentication**: Firebase Authentication. Supported by a secure, automatic **Local Dev Mock Authentication Fallback** if keys are unconfigured.
*   **Project Layout**: Monorepo with npm workspaces.
    ```
    ├── shared/          # Types, validation schemas (Zod), and emission index factors
    ├── server/          # Express API server & Drizzle database controllers
    └── client/          # Vite React single page web application
    ```

---

## 📦 Directory Structure Detail

```
carbon-footprint-calculator/
├── package.json
├── tsconfig.json
├── shared/
│   ├── src/
│   │   ├── types.ts          # Shared models and API payload interfaces
│   │   ├── validation.ts     # Zod validation schemas
│   │   └── constants.ts      # DEFRA/EPA carbon conversion indices
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/       # UI (Navbar layout, stats widget)
│   │   ├── context/          # Auth state (Firebase/Mock) and Theme contexts
│   │   ├── pages/            # Dashboard charts, Calculator forms, Offsets, Trophy milestones
│   │   ├── services/         # Axios/Fetch api calls wrapper
│   │   └── main.tsx          # Router layout and entry points
│   └── vite.config.ts
└── server/
    ├── src/
    │   ├── config/           # Better-sqlite3 & Firebase admin sdk configs
    │   ├── db/               # Drizzle schemas
    │   ├── middleware/       # JWT auth token verifiers
    │   ├── routes/           # Footprints logs CRUD & Aggregation controllers
    │   ├── utils/            # Calculation math & Gamification engines
    │   └── app.ts            # App router mapping & production asset serving
    └── drizzle.config.ts
```

---

## 🧮 Carbon Calculation Standards

Calculations are computed on the secure Express backend using standard **DEFRA (UK)** & **EPA (US)** carbon conversion factors:

*   **Grid Electricity**: `0.38 kg CO2e / kWh`
*   **Natural Gas**: `0.18 kg CO2e / kWh`
*   **Transport (Petrol Car)**: `0.17 kg CO2e / km`
*   **Diet (Beef)**: `27.0 kg CO2e / kg`
*   **Landfill General Waste**: `0.45 kg CO2e / kg`

---

## ⚙️ Local Development Setup

### 1. Install Dependencies
Install all workspace dependencies at the root of the project:
```bash
npm install --legacy-peer-deps
```

### 2. Configure Environment Variables
Create `.env` files in both the client and server directories:

**Client (`client/.env`)**
```env
VITE_API_URL=/api
# Leave Firebase configurations empty to auto-run in local Mock Dev Mode!
# VITE_FIREBASE_API_KEY=your-api-key
# VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
# VITE_FIREBASE_PROJECT_ID=your-project-id
# VITE_FIREBASE_APP_ID=your-app-id
```

**Server (`server/.env`)**
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=file:./app.db
# Leave empty for Dev Mock Auth Mode
# FIREBASE_PROJECT_ID=your-project-id
# FIREBASE_CLIENT_EMAIL=your-client-email
# FIREBASE_PRIVATE_KEY="your-private-key"
```

### 3. Push Database Schema
Initialize the SQLite database and schemas:
```bash
npm run db:push
```

### 4. Build Shared Package & Run Workspace
Compile shared types and start the developer environment:
```bash
# Compile shared assets
npm run build:shared

# Run server and client concurrently
npm run dev:server
# (In another tab)
npm run dev:client
```

---

## 🧪 Automated Testing
Run server and client tests locally:
```bash
# Run server test suites (Vitest + Supertest APIs)
npm run test:server

# Run client tests
npm run test:client
```

---

## 🌐 VPS Deployment Configuration (DigitalOcean/Ubuntu)

The app is optimized to run on a cheap **$4-$6/mo VPS** (1-2GB RAM) under a unified Node process.

### 1. Nginx Reverse Proxy Setup (`/etc/nginx/sites-available/default`)
Proxies incoming IP-based port 80 traffic to the Node.js Express process:
```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. PM2 Daemon Running
Express compiles TypeScript to `dist/app.js` and serves compiled Vite static assets:
```bash
# Compile the monorepo workspaces
npm run build

# Start server in production mode via PM2
cd server
pm2 start dist/app.js --name "carbon-footprint-calculator" --update-env --env NODE_ENV=production --env PORT=3000
```
This single-node architecture consumes less than 50MB RAM, guaranteeing efficient performance.

---

## ♿ Accessibility & Security Details
*   **Accessibility (WCAG 2.1 AA)**: Keyboard nav traps, semantic markup layout, ARIA descriptors for graphs, color contrast ratio of > 4.5:1.
*   **Security (OWASP Top 10)**: Strict Zod schemas for all client input validation, Helmet headers setup, CORS constraints, rate-limiters on APIs (100 requests / 15 minutes per IP).
