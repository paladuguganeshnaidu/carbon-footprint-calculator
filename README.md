# EcoCoach

### Empowering individuals to calculate, reduce, and offset emissions with precision.

**EcoCoach** is a premium, enterprise-grade carbon tracking, analytics, and gamification platform. The application provides modular carbon calculators, high-fidelity data visualizations, personalized reduction targets, interactive eco-challenges, and a simulated carbon offset marketplace. Optimized for performance and hardened for security, the platform transitions sustainability from abstract data into daily actionable steps.

---

## 🚀 Live Demo & Status
* **Backend Status Health Check**: `https://carbonfootprintcalculator.me/`

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
* **Technical Summary**: Validated by Zod schemas, calculations are computed on the Express backend using standard EPA (US) and DEFRA (UK) emission factors.

### 📊 Smart Sustainability Dashboard
* **Purpose**: Aggregates monthly emissions, active streaks, points, and category breakdowns.
* **User Benefit**: Gives an immediate, visually compelling overview of emissions patterns.
* **Technical Summary**: Built using `Recharts` SVG widgets backed by accessible HTML summary tables for screen reader users.

### 🎯 Personalized Carbon Reduction Goals
* **Purpose**: Set monthly targets (in kg CO2e) per emission category.
* **User Benefit**: Provides actionable budgets to check consumption against target metrics.

### 🏆 Gamification & Achievement System
* **Purpose**: Auto-allocates Awareness Points and logs daily tracking streaks.
* **User Benefit**: Rewards sustainable behavior through unlocked milestones.

### 🍃 Carbon Offset Marketplace
* **Purpose**: Exchange earned Awareness Points to support simulated offset initiatives.
* **User Benefit**: Offset unavoidable emissions while learning about global offset types (Forestry, Renewables).

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

---

## 🔥 Firebase Setup Guide

To configure Authentication for EcoCoach using Firebase:

### 1. Create a Firebase Project
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and name it (e.g. `Carbon-Awareness-Platform`).
3. Click **Continue** and select **Create Project**.

### 2. Register a Web App
1. Click the **Web icon (</>)** to register an app.
2. Enter app nickname (`Carbon Awareness Web`), then click **Register App**.
3. Copy the configuration object keys.

### 3. Enable Authentication Providers
1. Go to **Build > Authentication**, then click **Get Started**.
2. Under **Sign-in method**:
   * **Email/Password**: Toggle to **Enabled** and save.
   * **Google Sign-In**: Toggle to **Enabled**, choose a support email, and click **Save**.

### 4. Create Backend Credentials
1. Click the gear icon next to **Project Overview** in the sidebar and select **Project settings**.
2. Open the **Service accounts** tab.
3. Click **Generate new private key** (downloads a JSON file).
4. Save the variables from this JSON file for your backend configuration:
   * `project_id` -> `FIREBASE_PROJECT_ID`
   * `client_email` -> `FIREBASE_CLIENT_EMAIL`
   * `private_key` -> `FIREBASE_PRIVATE_KEY` (ensure you preserve the newline characters).

---

## 🚀 Render Free Tier Deployment Guide

EcoCoach is built as a workspace monorepo. In production, the Express backend builds and serves the frontend statically, allowing the app to run entirely within a single Render Web Service node.

### 1. Understanding Free Tier Database Volatility
Render's **Free Tier** does **not** support mounting persistent disks. Since the database is local SQLite (`app.db`), this has the following implications:
* The SQLite database file will be stored directly inside the container's temporary filesystem.
* **Database Resets**: Every time the Render container restarts (which happens automatically once a day, during redeployments, or when the server goes to sleep due to inactivity), any logged footprints, goals, or offsets will be reset.
* **Ideal Use Case**: This is perfect for quick demonstrations, school grading/evaluations, or temporary showcases.
* **Production Workaround**: For true data persistence on the Free Tier, you can modify `server/src/config/db.ts` to connect to a free hosted PostgreSQL database (such as **Neon.tech** or **Supabase**) instead of local SQLite.

### 2. Deploying on Render Free Tier via GitHub
Follow these steps to deploy using Render's Free Web Service:

1. Push your code changes to your GitHub repository.
2. Log into the [Render Dashboard](https://render.com/).
3. Click **New > Web Service**.
4. Connect your GitHub repository.
5. In the Web Service configuration page:
   * **Name**: `ecocoach` (or any custom name)
   * **Region**: Choose the region closest to you
   * **Branch**: `main`
   * **Language**: `Node`
   * **Build Command**: `npm install && npm run build`
   * **Start Command**: `npm --workspace=server start`
   * **Instance Type**: Select **Free**
6. Click **Advanced** to add the following **Environment Variables**:
   * `NODE_ENV`: `production`
   * `PORT`: `3000`
   * `DATABASE_URL`: `file:./app.db`
   * `CLIENT_ORIGIN`: `https://ecocoach.onrender.com` (replace with your actual Render service URL once generated)
   * **Firebase Client Keys**:
     * `VITE_FIREBASE_API_KEY`: *(Your Firebase API Key)*
     * `VITE_FIREBASE_AUTH_DOMAIN`: *(Your Firebase Auth Domain)*
     * `VITE_FIREBASE_PROJECT_ID`: *(Your Firebase Project ID)*
     * `VITE_FIREBASE_APP_ID`: *(Your Firebase App ID)*
   * **Firebase Admin Credentials**:
     * `FIREBASE_PROJECT_ID`: *(Your Firebase Project ID)*
     * `FIREBASE_CLIENT_EMAIL`: *(Your Firebase Client Email)*
     * `FIREBASE_PRIVATE_KEY`: *(Your Firebase Private Key, preserving newlines)*
7. **Health Check Path**: Set this to `/api/health` so Render can accurately monitor your server state.
8. Click **Create Web Service**.

### 3. Authorize Render Domain in Firebase Auth
Once Render generates your app URL (e.g. `https://ecocoach.onrender.com`):
1. In the Firebase Console, navigate to **Authentication > Settings**.
2. Click **Authorized domains**.
3. Click **Add domain** and enter your Render URL domain (e.g. `ecocoach.onrender.com`).

---

## ♿ Accessibility Compliance (WCAG 2.2 AA)
* **Keyboard Navigation**: Native tab flow and visual focus borders are enforced throughout.
* **Skip-to-Content link**: Allows screen reader users to bypass the sidebar navigation loop directly.
* **Accessible Visual Data**: Hidden semantic HTML summary tables (containing headers and labels) back up Recharts graphics so screen readers can consume trend values.
* **Form Labels**: Form structures strictly link elements with descriptive labels.

---

## 🔒 Security Architecture
1. **Broken Auth Prevention**: Integrates Firebase Authentication on the frontend and validates ID tokens on the backend using the Firebase Admin SDK.
2. **CORS Hardening**: Limits Cross-Origin Resource Sharing exclusively to whitelisted client domains and secure local ports.
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

---

## 📄 License
This project is licensed under the MIT License.
