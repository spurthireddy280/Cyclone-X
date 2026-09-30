# CYCLONE X
### AI-Powered Disaster Intelligence & Response Platform

> **"Don't just predict the cyclone. Predict what the cyclone can disrupt, how those disruptions can cascade, and what should be prioritized next."**

---

## ⚡ Executive Summary

**Cyclone X** is an enterprise-grade tactical disaster intelligence platform engineered for emergency management commanders, critical infrastructure operators, and civil defense agencies. Built with mission-control visual aesthetics and a deterministic **Explainable Vulnerability Engine**, Cyclone X bridges the critical gap between raw meteorological telemetry and actionable multi-agency response directives.

---

## 🚀 Key Differentiators & Features

1. **Deterministic Explainable Vulnerability Engine**
   - Transparent mathematical hazard weighting:
     - **Wind Impact (30%)**
     - **Precipitation Inundation (25%)**
     - **Hydrodynamic Storm Surge (30%)**
     - **Infrastructure Physical Exposure (15%)**
   - Eliminates dangerous black-box hallucinations in life-critical emergency decisions.

2. **Systemic Impact Cascade Modeling**
   - Visualizes multi-point failure propagation:
     `Cyclone Intensifies` ➔ `Storm Surge Overtopping (+3.2m)` ➔ `Evacuation Arterial R14 Floods` ➔ `Emergency Logistics Paralyzed` ➔ `Coastal Medical Center & Substation 07 Isolated` ➔ `First Responder Capacity Threshold Exceeded`.

3. **Interactive Geospatial Risk Map (Leaflet & CartoDB Dark Matter)**
   - 8 live toggleable hazard layers:
     - Storm Path & Forecast Track
     - Vulnerability Zones (Zones 01–05)
     - Regional Hospitals
     - Power Grid Substation Nodes
     - Road Corridors & Causeways
     - Safe Receiving Shelters
     - Rainfall Inundation Circles
     - Hydrodynamic Surge Envelope
   - "Center on Highest Risk Zone" and "Reset View" controls.
   - Click markers to open comprehensive infrastructure detail drawers.

4. **What-If Scenario Simulator**
   - Dynamic real-time sliders:
     - Wind Speed (100–200 km/h)
     - Cumulative Precipitation (100–600 mm)
     - Storm Surge (1.0–5.0 m)
     - Infrastructure Exposure (0–100)
   - One-click presets: **Baseline (Cat 3)**, **Severe (Cat 4 Surge)**, **Extreme (Super Cyclone)**.
   - Side-by-side comparison with real-time impact deltas (`+26 Risk`, `+14 Infra Nodes`, `+31,000 Exposed Citizens`).
   - Automated AI reasoning explaining *why* risk increased.

5. **AI Command Center (Gemini 1.5 Flash + Deterministic Active Fallback)**
   - 4-stage cycling processing state.
   - Structured JSON output schema providing executive summary, priority containment zones, infrastructure failure nodes, 6-stage cascade flow, and ranked tactical actions.
   - 100% resilient: if internet or API keys are unavailable, local deterministic cascade reasoning engages with zero downtime.

6. **Interactive Incident Response Planner**
   - Priority-ranked operational tasks (P1 Critical, P2 High, P3 Moderate).
   - Interactive status cycling: `Pending` ➔ `In Progress` ➔ `Completed`.
   - Filter by status and generate refreshed action plans.
   - State persisted in `localStorage`.

7. **Automated Incident Reports & Print / Save as PDF**
   - Generate situation reports capturing live storm metrics, zone exposures, and operational directives.
   - Clean, professional print stylesheet supporting one-click `window.print()` / Save as PDF.

---

## 🔑 Demo Access Credentials

The platform is pre-configured with a one-click demo login button:
- **Email:** `demo@cyclonex.ai`
- **Password:** `demo123`

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, React Router v6, Vanilla CSS Design System with dark mission-control design tokens (`#06080D`, `#00F0FF`, glassmorphism, custom toggles & sliders).
- **Icons & Graphics:** Lucide React, HTML5 Canvas Doppler Radar with live convective sweep animation.
- **Geospatial Mapping:** Leaflet 1.9 with CartoDB Dark Matter tiles, custom SVG DivIcons, tooltips, and interactive layers.
- **Backend:** Node.js, Express, CORS, Dotenv, Gemini 1.5 Flash API client.
- **Persistence:** LocalStorage synchronization for authentication, response tasks, alerts, reports, and display preferences.

---

## 🚦 Quick Start & Local Execution

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
If you wish to connect live cloud Gemini API:
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
```
*(If omitted, Cyclone X's deterministic cascade engine will automatically run with 100% functionality).*

### 3. Launch Platform
```bash
npm run dev
```
- **Frontend Command Center:** [http://localhost:5173](http://localhost:5173)
- **Backend API Server:** [http://localhost:3001](http://localhost:3001)

### 4. Build for Production
```bash
npm run build
```

---

## 🗺️ Application Routes

### Public
- `/` — Landing Page with Doppler Canvas, 3 Pillars, and Statistics.
- `/login` — Login with "Use Demo Account" quick button.
- `/signup` — Registration portal with operational terms.

### Authenticated (Protected)
- `/app` — Overview Command Dashboard with greeting, key metrics, and priority areas.
- `/app/storm` — Storm Monitor with Doppler vortex and lifecycle timeline.
- `/app/risk` — Risk Analysis with Explainable Vulnerability Engine 30/25/30/15 breakdown.
- `/app/map` — Interactive Leaflet Risk Map with 8 layers and asset drawer.
- `/app/infrastructure` — Infrastructure Intelligence with category tabs, search, and sorting.
- `/app/simulator` — What-If Simulator with presets, live sliders, and impact deltas.
- `/app/ai` — AI Command Center with 6-stage cascade flow and action synchronization.
- `/app/response` — Response Planner with interactive status advancement.
- `/app/alerts` — Real-time Emergency Alerts with severity filters and acknowledgement.
- `/app/reports` — Incident Reports with PDF / Print export.
- `/app/settings` — Platform Preferences (Dark/Light mode, Reduced Motion, Demo Reset).

---

*Cyclone X is an operational decision support simulation platform created for hackathon demonstration.*
