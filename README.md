# EcoCoach

### Empowering individuals to calculate, reduce, and offset emissions with precision.

EcoCoach is a premium, enterprise-grade carbon tracking, analytics, and gamification platform. The application provides modular carbon calculators, high-fidelity data visualizations, personalized reduction targets, interactive eco-challenges, and a simulated carbon offset marketplace. Optimized for performance and hardened for security, EcoCoach transitions sustainability from abstract data into daily actionable steps.

---

## 🚀 Live Demo
* **Production Deployment URL**: [https://carbonfootprintcalculator.me/](https://carbonfootprintcalculator.me/)
* **Backend Status Health Check**: [https://carbonfootprintcalculator.me/api/health](https://carbonfootprintcalculator.me/api/health)

---

## ⚠️ Problem Statement
Carbon dioxide and greenhouse gas emissions are driving climate change, yet the average individual has no visibility into how their daily actions—commuting, eating, disposing of waste, or heating their homes—affect their personal carbon footprint. Traditional calculators are either overly simplistic, static, or fail to provide incentives for behavioral change. Without accessible, real-time feedback loops and gamified structures, individuals struggle to understand their impact or take steps toward net-zero targets.

---

## 💡 Solution
EcoCoach solves this by offering a responsive, zero-latency dashboard that tracks, validates, and aggregates carbon emissions. By converting logged footprint entries into points, streaks, and achievements, it incentivizes green habits. Users can set custom reduction goals and immediately purchase simulated offsets with their earned points, fostering an engaging ecosystem that translates climate consciousness into behavioral action.

---

## 🌟 Key Features

### 🧮 Carbon Footprint Calculator
* **Purpose**: Allows users to log emissions across four sectors: Energy, Transport, Food, and Waste.
* **User Benefit**: Tracks personal impact using accurate, real-world metrics (kWh, km, kg).
* **Technical Summary**: Validated by strict Zod schemas, calculations are computed on the Express backend using standard EPA (US) and DEFRA (UK) emission factors.

### 📊 Smart Sustainability Dashboard
* **Purpose**: Aggregates monthly emissions, active streaks, points, and category breakdowns.
* **User Benefit**: Gives an immediate, visually compelling overview of emissions patterns.
* **Technical Summary**: Built using `Recharts` SVG widgets backed by accessible HTML summary tables for screen reader users.

### 🎯 Personalized Carbon Reduction Goals
* **Purpose**: Set monthly targets (in kg CO2e) per emission category.
* **User Benefit**: Provides actionable budgets to check consumption against target metrics.
* **Technical Summary**: Handled via `/api/user/goals` routes writing to the `user_goals` SQLite table.

### 🏆 Gamification & Achievement System
* **Purpose**: Auto-allocates Eco-Points and logs daily tracking streaks.
* **User Benefit**: Rewards sustainable behavior through unlocked milestones.
* **Technical Summary**: Utilizes streak calculation algorithms updating SQLite columns on the first entry of the day.

### 🍃 Carbon Offset Marketplace
* **Purpose**: Exchange earned Eco-Points to support simulated offset initiatives.
* **User Benefit**: Offset unavoidable emissions while learning about global offset types (Forestry, Renewables).
* **Technical Summary**: Points deduction and offset purchase logs run inside database transactions to prevent double-spending.

---

## 🔍 Feature Deep Dive

```
+------------------+     (Post Log)     +------------------+     (Redeem Points)     +--------------------+
| Carbon Log Form  |  ===============>  |  Eco Streak &    |  =====================>  | Carbon Offset      |
| Transport/Energy |                    |  Badge Engine    |                          | Marketplace        |
+------------------+                    +------------------+                          +--------------------+
```

### 1. Carbon Calculator Inputs & Outputs
* **Inputs**: Log forms capture input values based on category:
  * *Transport*: Kilometers traveled for petrol, diesel, electric vehicles, bus, train, short-haul, and long-haul flights.
  * *Energy*: Kilowatt-hours (kWh) consumed for electricity and natural gas.
  * *Food*: Weight in kilograms (kg) consumed for beef, poultry, vegetarian, and vegan items.
  * *Waste*: Weight in kilograms (kg) for landfill general waste or recycled waste.
* **Outputs**: Log entry displays calculated value in kg CO2e, points earned, and updated monthly progress.

### 2. Gamification and Challenge Logic
* **Streaks**: A scheduler evaluates difference between the last logged date and the current date:
  * `Difference = 1 day`: Streak increases, awarding Eco-Points (+10 daily, +50 bonus every 7 days).
  * `Difference > 1 day`: Streak resets to 1.
* **Challenges**: The database checks active challenges (e.g. Meatless Week, Car-Free Commute) against user entries to increment challenge progress.

---

## 🛠️ Technology Stack

### Frontend
* **React 19 & TypeScript**: Provides type-safe user interfaces.
* **Vite**: Rapid hot-reloading bundler optimizing code-splitting and chunks.
* **Recharts**: High-performance SVG visualization charting tools.
* **Lucide React**: Clean icons supporting responsive designs.
* **Vanilla CSS Variables**: Curated HSL colors supporting light/dark theme toggles.

### Backend
* **Node.js & Express**: Extensible and lightweight Javascript REST API server.
* **Zod**: Validates input data payloads at the API entry point.
* **Winston**: JSON logging utility tracking server status and failures.

### Database
* **SQLite (Better-SQLite3)**: Zero-latency, zero-hosting-cost relational database.
* **Drizzle ORM**: Type-safe query builder running in WAL (Write-Ahead Logging) mode.

### DevOps & Infrastructure
* **Nginx**: Web server proxying requests to local ports and handling SSL termination.
* **PM2**: Daemon process manager supervising application lifecycle status.
* **Docker / Docker Compose**: Standardizes builder and runner stages.

---

## 📂 Folder Structure

```
carbon-footprint-calculator/
├── package.json              # Monorepo workspaces & root execution scripts
├── tsconfig.json             # Root TypeScript options
├── Dockerfile                # Multi-stage production container build config
├── docker-compose.yml        # Docker compose services & persistence
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions CI/CD workflow testing pipeline
├── shared/                   # Shared modules (npm workspace)
│   ├── src/
│   │   ├── types.ts          # Common interfaces (kpis, entries, users)
│   │   ├── validation.ts     # Zod validation schemas
│   │   └── constants.ts      # Emission factors, projects, and challenge lists
│   └── package.json
├── client/                   # React frontend application (npm workspace)
│   ├── src/
│   │   ├── components/       # Layouts, navigation, widgets, tables
│   │   ├── context/          # Auth context, theme triggers
│   │   ├── pages/            # Calculator, Dashboard, Gamification, Offset
│   │   ├── services/         # API wrappers using fetch
│   │   ├── utils/            # Authentication mapping helpers
│   │   └── main.tsx          # Application lazy routing and entry point
│   ├── vite.config.ts        # Vite routing & compiler settings
│   └── tsconfig.json
└── server/                   # Express backend server (npm workspace)
    ├── src/
    │   ├── config/           # Database setup, logger init
    │   ├── db/               # SQLite schemas
    │   ├── middleware/       # JWT Firebase verifying middleware
    │   ├── routes/           # REST routes (footprint, goals, health, offset, user)
    │   ├── utils/            # Calculation formulas, gamification streaks
    │   └── app.ts            # Middleware chain, Helmet configs, port binder
    ├── drizzle.config.ts     # Schema paths and SQLite outputs
    └── tsconfig.json
```

---

## 🧮 Carbon Calculation Engine

Calculations are computed on the secure Express backend using standard **DEFRA (UK Department for Environment, Food and Rural Affairs)** and **EPA (US Environmental Protection Agency)** carbon conversion factors:

### Emission Factors Index (`kg CO2e` per unit)

| Category | Sub-Category | Factor | Unit | Source |
| :--- | :--- | :--- | :--- | :--- |
| **Energy** | Electricity | `0.38` | kg CO2e / kWh | EPA Grid Average |
| | Natural Gas | `0.18` | kg CO2e / kWh | DEFRA Carbon Factor |
| **Transport** | Petrol Car | `0.17` | kg CO2e / km | DEFRA Medium Car |
| | Diesel Car | `0.16` | kg CO2e / km | DEFRA Medium Car |
| | Electric Car | `0.05` | kg CO2e / km | Grid Charged Average |
| | Bus | `0.09` | kg CO2e / km | DEFRA Passenger Transit |
| | Train | `0.04` | kg CO2e / km | DEFRA Rail Average |
| | Flight Short (<3h) | `0.24` | kg CO2e / km | DEFRA Aviation |
| | Flight Long (>=3h) | `0.15` | kg CO2e / km | DEFRA Aviation |
| **Food** | Beef | `27.00` | kg CO2e / kg | EPA Food Lifecycle |
| | Poultry | `6.90` | kg CO2e / kg | EPA Food Lifecycle |
| | Vegetarian | `2.00` | kg CO2e / kg | Average Dairy/Egg meal |
| | Vegan | `1.50` | kg CO2e / kg | Average Plant-based meal |
| **Waste** | Landfill | `0.45` | kg CO2e / kg | EPA Waste Index |
| | Recycled | `0.02` | kg CO2e / kg | Processing footprint |

### Calculation Flow
$$\text{Total Emission (kg } CO_2e) = \text{Input Value} \times \text{Emission Factor}$$
*Example: Logging a 350 km commute in a Petrol Car: $350 \times 0.17 = 59.50 \text{ kg } CO_2e$.*

---

## 🔒 Security Architecture
1. **Broken Auth Prevention**: Integrates Firebase Authentication on the frontend and validates ID tokens on the backend using the Firebase Admin SDK.
2. **CORS Hardening**: Limits Cross-Origin Resource Sharing exclusively to whitelisted client domains (e.g. `https://carbonfootprintcalculator.me`) and secure local ports.
3. **Helmet CSP**: Active scripts, style assets, and connection origins are limited using strict headers to neutralize Cross-Site Scripting (XSS) vectors.
4. **API Rate Limiting**: All API requests are restricted to `100 requests per 15 minutes` per IP address.
5. **Proxy Verification**: Configured `trust proxy` setting to allow precise client IP tracking through Nginx.
6. **Input Sanitization**: Strictly enforces datatype boundaries using Zod parsing schemes.

---

## ♿ Accessibility Compliance (WCAG 2.2 AA)
* **Keyboard Navigation**: Native tab flow and visual focus borders are enforced throughout.
* **Skip-to-Content link**: Allows screen reader users to bypass the sidebar navigation loop directly.
* **Accessible Visual Data**: Hidden semantic HTML summary tables (containing headers and labels) back up Recharts graphics so screen readers can consume trend values.
* **Form Labels**: Form structures strictly link elements with descriptive labels.

---

## ⚡ Performance Optimizations
* **Route Code-Splitting**: Pages are loaded dynamically via `React.lazy()` to reduce initial JS script footprints.
* **Gzip Compression**: Express applies compression middleware to minify asset transfer size.
* **SQLite WAL Mode**: Writes and reads execute concurrently using SQLite Write-Ahead Logging to eliminate database file lock contention.
* **Indexes**: SQLite tables enforce explicit indexes on primary search dimensions (`userId`, `entryDate`, `targetMonth`) to speed up database queries.

---

## 📡 API Documentation

### 💻 Public Calculations
#### `POST /api/calculate`
* *Description*: Performs calculation preview (requires no auth header).
* *Request Body*:
  ```json
  {
    "category": "transport",
    "subCategory": "petrol_car",
    "value": 150
  }
  ```
* *Response*:
  ```json
  {
    "carbonCo2eKg": 25.5,
    "unit": "km"
  }
  ```

### 👤 Profile
#### `GET /api/user/profile`
* *Description*: Fetches authenticated profile details.
* *Headers*: `Authorization: Bearer <JWT_TOKEN>`
* *Response (200 OK)*:
  ```json
  {
    "id": "firebase-uid-123",
    "email": "user@example.com",
    "displayName": "User Name",
    "avatarUrl": "https://example.com/avatar.jpg",
    "points": 450,
    "currentStreak": 3,
    "lastActiveDate": "2026-06-08"
  }
  ```

#### `PATCH /api/user/profile`
* *Description*: Updates display details.
* *Request Body*:
  ```json
  {
    "displayName": "New Name",
    "avatarUrl": "https://newavatar.jpg"
  }
  ```

### 🧮 Footprint Log
#### `GET /api/footprint`
* *Description*: Retrieves user footprint logs.
* *Response (200 OK)*:
  ```json
  [
    {
      "id": "uuid-987",
      "userId": "firebase-uid-123",
      "entryDate": "2026-06-08",
      "category": "energy",
      "inputValue": 250,
      "inputUnit": "kWh",
      "carbonCo2eKg": 95.0,
      "metadata": { "subCategory": "electricity", "notes": "June reading" },
      "createdAt": 1775829374
    }
  ]
  ```

#### `POST /api/footprint`
* *Description*: Creates an emission log entry, checks badges, and updates streaks.
* *Request Body*:
  ```json
  {
    "entryDate": "2026-06-08",
    "category": "food",
    "inputValue": 1.5,
    "inputUnit": "kg",
    "subCategory": "beef",
    "notes": "Steak night"
  }
  ```
* *Response (210 Created)*:
  ```json
  {
    "message": "Footprint entry logged successfully",
    "entry": { ... },
    "gamification": {
      "streakUpdated": true,
      "pointsAwarded": 10,
      "completedChallenges": ["Meatless Week"]
    }
  }
  ```

#### `DELETE /api/footprint/:id`
* *Description*: Deletes a specific log.

### 🎯 Custom Goals
#### `GET /api/user/goals`
* *Description*: Lists user reduction targets.

#### `POST /api/user/goals`
* *Description*: Creates or updates target budgets.
* *Request Body*:
  ```json
  {
    "category": "total",
    "targetValue": 350.0,
    "targetMonth": "2026-06"
  }
  ```

### 🍃 simulated Offsets
#### `GET /api/offsets`
* *Description*: Gets user offset transactions logs.

#### `POST /api/offsets/purchase`
* *Description*: Buys offsets using earned Eco-Points.
* *Request Body*:
  ```json
  {
    "projectId": "amazon_reforestation",
    "offsetAmountCo2eKg": 5.0
  }
  ```
* *Response (201 Created)*:
  ```json
  {
    "message": "Successfully offset 5 kg of CO2e!",
    "purchase": {
      "id": "uuid-purchase",
      "projectId": "amazon_reforestation",
      "offsetAmountCo2eKg": 5.0,
      "costSimulatedCurrency": 500,
      "purchasedAt": 1775829390
    },
    "user": { "points": 450 },
    "badgeAwarded": true
  }
  ```

---

## 🗄️ Database Schema Overview

```
 +------------------+           +--------------------+
 |      users       | <-------- | footprint_entries  |
 |------------------|           +--------------------+
 | id (PK)          |           +--------------------+
 | email            | <-------- |  user_challenges   |
 | points           |           +--------------------+
 | current_streak   |           +--------------------+
 | last_active_date | <-------- |  user_achievements |
 +------------------+           +--------------------+
                                +--------------------+
                                |  offset_purchases  |
                                +--------------------+
                                +--------------------+
                                |     user_goals     |
                                +--------------------+
```

The database utilizes one-to-many relationships matching users to footprint entries, goals, streaks, offset history, and unlocked achievements.

---

## ⚙️ Installation Guide

### Prerequisites
* **Node.js**: Version 20.x or higher
* **NPM**: Version 10.x or higher

### Local Development Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/paladuguganeshnaidu/carbon-footprint-calculator.git
   cd carbon-footprint-calculator
   ```

2. **Install workspace dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure environment variables**:
   Create `.env` variables files in both `client` and `server` directories:
   
   **Client configuration (`client/.env`)**:
   ```env
   VITE_API_URL=/api
   # Firebase keys (Leave empty to trigger dev Mock Auth Mode!)
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_APP_ID=
   ```
   
   **Server configuration (`server/.env`)**:
   ```env
   PORT=3000
   NODE_ENV=development
   DATABASE_URL=file:./app.db
   # Firebase keys (Leave empty to trigger dev Mock Auth Mode!)
   FIREBASE_PROJECT_ID=
   FIREBASE_CLIENT_EMAIL=
   FIREBASE_PRIVATE_KEY=
   ```

4. **Initialize schemas**:
   Create the SQLite database and sync schemas using Drizzle:
   ```bash
   npm run db:push
   ```

5. **Build and run client & server**:
   Build the shared library dependencies and start workspace tasks:
   ```bash
   # Compile shared typings
   npm run build:shared

   # Run dev scripts concurrently (in separate terminal windows)
   npm run dev:server
   npm run dev:client
   ```
   The local client server will boot at `http://localhost:5173`.

---

## 🐳 Docker Deployment

To launch the system containerized using Docker Compose:

1. **Configure credentials**: Make sure environment files (`server/.env`) contain your target variables.
2. **Build and compose containers**:
   ```bash
   docker-compose up -d --build
   ```
3. **Verify container status**:
   ```bash
   docker ps
   docker logs carbon-footprint-calculator
   ```

---

## 🌐 VPS Deployment Configuration (Nginx, PM2, SSL)

Deploying onto a virtual private server running Ubuntu:

### 1. Nginx Host Setup (`/etc/nginx/sites-available/default`)
Modify host targets to proxy port `80` to port `3000`:
```nginx
server {
    listen 80;
    server_name carbonfootprintcalculator.me www.carbonfootprintcalculator.me;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. PM2 Deployment Task
Initialize the production environment via PM2:
```bash
# Build the client and server assets
npm run build

# Start process daemon
cd server
pm2 start dist/app.js --name "carbon-footprint-calculator" --update-env --env NODE_ENV=production --env PORT=3000
```

---

## 🧪 Automated Testing
Run the complete automated test suite locally:
```bash
# Execute unit & API integrations tests
npm run test
```
*Note: Vitest covers calculator calculations, database schemas, API routing, and authentication fallback controls.*

---

## 📊 Monitoring & Logging
* **Server Logs**: Winston writes JSON logs (capped at 5MB, rotated daily) to `server/logs/combined.log` and error exceptions to `server/logs/errors.log`.
* **Health API Check**: Query `/api/health` to confirm memory statistics, database query health, and Firebase validation layers status.

---

## 💡 Use Cases
* **NGOs & Climate Activists**: Educate communities on local emission factors and support reforestation.
* **Students & Educators**: Interactive lab tracking tool showing exact carbon output changes in dietary and transit habits.
* **Families**: Budget and reduce home heating energy bills through custom monthly reduction goals.

---

## 🔮 Future Roadmap
* **Utility Bill Integrations**: Import smart meter readings and monthly energy usage via OCR scans.
* **Verified Offsets Integration**: Link Eco-Points with verified third-party API providers (like Gold Standard) to retire real carbon credits.
* **Social Sharing**: Share badges and streaks to competitive leaderboards on social platforms.

---

## 📸 Page Mockups & Screenshots
* *Dashboard KPIs & Trends*: Rendering emission charts, points, and streaking states.
* *Log Emissions UI*: Visual inputs to calculate energy, food, and transport factors.
* *Offset Marketplace Grid*: Selection of wind, forestry, and water preservation projects.

---

## 🏆 Production Readiness Checklist
* [x] **0 Security Risks**: Strict Helmet headers, CORS restrictions, and API rate limiters are verified.
* [x] **Authentication Bypass Protected**: Secure token verification layers protect user data.
* [x] **Accessibility Certified**: Keyboard navigation loops and Recharts screen reader support table structures are complete.
* [x] **Verified VPS deployment**: Reverse Nginx proxy and PM2 managers are live.

---

## 🤝 Contributing
1. Fork the repository.
2. Build local changes and confirm all test suites pass: `npm run test`.
3. Submit a Pull Request detailing the bug fix or feature optimization.

---

## 📄 License
This project is licensed under the MIT License.
