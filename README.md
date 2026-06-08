# carbon-footprint-calculator

### Empowering individuals to calculate, reduce, and offset emissions with precision.

**ZeroGrid** is a premium, enterprise-grade carbon tracking, analytics, and gamification platform. The application provides modular carbon calculators, high-fidelity data visualizations, personalized reduction targets, interactive eco-challenges, and a simulated carbon offset marketplace. Optimized for performance and hardened for security, ZeroGrid transitions sustainability from abstract data into daily actionable steps.

---

## 🚀 Live Demo & Status
* **Backend Status Health Check**: `https://zerogrid.onrender.com/api/health`

---

## ⚠️ Problem Statement
Carbon dioxide and greenhouse gas emissions are driving climate change, yet the average individual has no visibility into how their daily actions—commuting, eating, disposing of waste, or heating their homes—affect their personal carbon footprint. Traditional calculators are either overly simplistic, static, or fail to provide incentives for behavioral change. Without accessible, real-time feedback loops and gamified structures, individuals struggle to understand their impact or take steps toward net-zero targets.

---

## 💡 Solution
ZeroGrid solves this by offering a responsive, zero-latency dashboard that tracks, validates, and aggregates carbon emissions. By converting logged footprint entries into points, streaks, and achievements, it incentivizes green habits. Users can set custom reduction goals and immediately purchase simulated offsets with their earned points, fostering an engaging ecosystem that translates climate consciousness into behavioral action.

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
* **Purpose**: Auto-allocates ZeroGrid Points and logs daily tracking streaks.
* **User Benefit**: Rewards sustainable behavior through unlocked milestones.
* **Technical Summary**: Utilizes streak calculation algorithms updating SQLite columns on the first entry of the day.

### 🍃 Carbon Offset Marketplace
* **Purpose**: Exchange earned ZeroGrid Points to support simulated offset initiatives.
* **User Benefit**: Offset unavoidable emissions while learning about global offset types (Forestry, Renewables).
* **Technical Summary**: Points deduction and offset purchase logs run inside database transactions to prevent double-spending.

---

## 🔍 Feature Deep Dive

```
+------------------+     (Post Log)     +------------------+     (Redeem Points)     +--------------------+
| Carbon Log Form  |  ===============>  |  Grid Streak &   |  =====================>  | Carbon Offset      |
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
  * `Difference = 1 day`: Streak increases, awarding ZeroGrid Points (+10 daily, +50 bonus every 7 days).
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
* **SQLite (Better-SQLite3)**: Relational database running locally.
* **Drizzle ORM**: Type-safe query builder running in WAL (Write-Ahead Logging) mode.

### DevOps & Infrastructure
* **Render**: Blueprint-based deployment.
* **Nginx**: Web server proxying requests to local ports and handling SSL termination (for VPS setups).
* **Docker / Docker Compose**: Standardizes builder and runner stages.

---

## 📂 Folder Structure

```
zero-grid/
├── package.json              # Monorepo workspaces & root execution scripts
├── tsconfig.json             # Root TypeScript options
├── Dockerfile                # Multi-stage production container build config
├── docker-compose.yml        # Docker compose services & persistence
├── render.yaml               # Render Infrastructure blueprint configuration
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

## 🔥 Firebase Setup & Migration Guide

To configure Authentication for ZeroGrid using Firebase (enabling both Email/Password and Google Sign-In):

### 1. Create a Firebase Project
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and give it a name (e.g. `ZeroGrid-Platform`).
3. Click **Continue** and configure Google Analytics as per your choice, then select **Create Project**.

### 2. Register a Web App
1. In the Project Dashboard, click the **Web icon (</>)** to register an app.
2. Enter app nickname (`ZeroGrid Web`), then click **Register App**.
3. Copy the configuration object keys (you will need these for your environment variables).

### 3. Enable Authentication Providers
1. In the sidebar, select **Build > Authentication**, then click **Get Started**.
2. Go to the **Sign-in method** tab.
3. **Email/Password**: Select `Email/Password`, toggle it to **Enabled**, and save.
4. **Google Sign-In**: Select `Google`, toggle to **Enabled**, choose a support email, and click **Save**.

### 4. Create Backend Admin Credentials
1. Click the gear icon next to **Project Overview** in the sidebar and select **Project settings**.
2. Open the **Service accounts** tab.
3. Click **Generate new private key** (this downloads a JSON file).
4. Save the variables from this JSON file for your backend configuration:
   * `project_id` -> `FIREBASE_PROJECT_ID`
   * `client_email` -> `FIREBASE_CLIENT_EMAIL`
   * `private_key` -> `FIREBASE_PRIVATE_KEY` (ensure you preserve the newline characters).

---

## 🚀 Render Deployment Guide

ZeroGrid is built as a workspace monorepo. In production, the Express backend builds and serves the frontend statically, allowing the app to run entirely within a single Render Web Service node.

### 1. Blueprint Deployment (Recommended)
1. Commit all changes to your GitHub Repository.
2. Log into [Render](https://render.com/).
3. In the Render Dashboard, click **New > Blueprint**.
4. Select your GitHub repository.
5. Render will detect the `render.yaml` file and automatically prepare the configuration.
6. Under **Environment Variables**, provide the Sync variables:
   * `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`.
   * `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` (copy the raw multiline key).
7. Under **Disk**, Render will automatically attach a `1GB` volume to persist the SQLite `app.db` file at `/data`.
8. Click **Deploy**.

### 2. Manual Render Web Service Setup
If you prefer to configure manually:
1. Click **New > Web Service**.
2. **Build Command**: `npm install && npm run build`
3. **Start Command**: `npm --workspace=server start`
4. **Environment Variables**:
   * `NODE_ENV`: `production`
   * `PORT`: `3000`
   * `DATABASE_URL`: `file:/data/app.db`
   * Add all Firebase client and admin variables shown in the blueprint.
5. **Advanced > Add Disk**:
   * Name: `sqlite-db-volume`
   * Mount Path: `/data`
   * Size: `1 GB`
6. **Health Check Path**: `/api/health`

### 3. Add Authorized Domain in Firebase Console
Once the Render web service starts, copy your Render deployment URL (e.g. `https://zerogrid.onrender.com`).
1. In the Firebase Console, navigate to **Authentication > Settings**.
2. Select **Authorized domains**.
3. Click **Add domain** and input your Render URL (excluding the `https://` prefix).

---

## ♿ Accessibility Compliance (WCAG 2.2 AA)
* **Keyboard Navigation**: Native tab flow and visual focus borders are enforced throughout.
* **Skip-to-Content link**: Allows screen reader users to bypass the sidebar navigation loop directly.
* **Accessible Visual Data**: Hidden semantic HTML summary tables (containing headers and labels) back up Recharts graphics so screen readers can consume trend values.
* **Form Labels**: Form structures strictly link elements with descriptive labels.

---

## 🔒 Security Architecture
1. **Broken Auth Prevention**: Integrates Firebase Authentication on the frontend and validates ID tokens on the backend using the Firebase Admin SDK.
2. **CORS Hardening**: Limits Cross-Origin Resource Sharing exclusively to whitelisted client domains (e.g. `https://zerogrid.onrender.com`) and secure local ports.
3. **Helmet CSP**: Active scripts, style assets, and connection origins are limited using strict headers to neutralize Cross-Site Scripting (XSS) vectors.
4. **API Rate Limiting**: All API requests are restricted to `100 requests per 15 minutes` per IP address.
5. **Proxy Verification**: Configured `trust proxy` setting to allow precise client IP tracking through Nginx.
6. **Input Sanitization**: Strictly enforces datatype boundaries using Zod parsing schemes.

---

## 🧪 Automated Testing
Run the complete automated test suite locally:
```bash
# Execute unit & API integrations tests
npm run test
```
*Note: Vitest covers calculator calculations, database schemas, API routing, and authentication fallback controls.*

---

## 🤝 Contributing
1. Fork the repository.
2. Build local changes and confirm all test suites pass: `npm run test`.
3. Submit a Pull Request detailing the bug fix or feature optimization.

---

## 📄 License
This project is licensed under the MIT License.
