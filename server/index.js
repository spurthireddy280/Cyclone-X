import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initialScenarioData } from './data/mockScenario.js';
import { runDisasterAnalysis, generateDeterministicAnalysis } from './gemini.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory reports store
const generatedReports = [
  {
    id: "rep-001",
    scenarioName: "Cyclone Varuna - Pre-Landfall Assessment",
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    riskScore: 61,
    severity: "HIGH",
    summary: "Cyclone Varuna maintaining Category 3 velocity. Primary vulnerabilities concentrated along Zone 04 delta corridor and Zone 02 maritime industrial basin.",
    priorityZones: ["Zone 04 (91)", "Zone 02 (82)", "Zone 03 (74)"],
    recommendationsCount: 5,
    generatedBy: "AI Command Center (Simulation Model)"
  }
];

// GET /api/health
app.get('/api/health', (req, res) => {
  const configuredKeys = [
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY
  ].filter(k => k && k.trim().length > 10 && !k.includes("your_gemini_api_key")).length;

  res.json({
    status: "ok",
    service: "Cyclone X Disaster Intelligence Platform API",
    version: "1.0.0",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    aiEngine: configuredKeys > 0
      ? `Multi-API Failover Active (${configuredKeys} Gemini keys configured)`
      : "Deterministic Cascade Engine (Active Fallback)"
  });
});

// GET /api/config/map - Safe basemap runtime configuration (never exposes Gemini keys)
app.get('/api/config/map', (req, res) => {
  const rawKey = (process.env.CARTO_BASEMAP_KEY || '').trim();
  const hasValidKey = Boolean(
    rawKey &&
    rawKey !== 'your_key_here' &&
    rawKey !== 'your_carto_key_here' &&
    !rawKey.startsWith('your_') &&
    rawKey.length > 5
  );

  res.json({
    success: true,
    hasKey: hasValidKey,
    tileUrl: hasValidKey
      ? `https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=${encodeURIComponent(rawKey)}`
      : null,
    fallbackUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 18
  });
});

// GET /api/scenario
app.get('/api/scenario', (req, res) => {
  res.json({
    success: true,
    data: initialScenarioData
  });
});

// POST /api/analyze
app.post('/api/analyze', async (req, res) => {
  let analysisParams;
  try {
    const { storm, parameters } = req.body || {};
    analysisParams = {
      stormName: storm?.name || "Cyclone Varuna",
      windSpeed: parameters?.windSpeed || storm?.currentConditions?.windSpeed || 145,
      rainfall: parameters?.rainfall || storm?.currentConditions?.rainfall || 420,
      stormSurge: parameters?.stormSurge || storm?.currentConditions?.stormSurge || 3.2,
      infrastructureVulnerability: parameters?.infrastructureVulnerability || 65,
      scenarioPreset: parameters?.scenarioPreset || "baseline"
    };

    const result = await runDisasterAnalysis(analysisParams);

    res.json({
      success: true,
      analysis: result
    });
  } catch (err) {
    console.error("[AI] Error in /api/analyze route:", err.message);
    // Non-blocking guaranteed fallback
    const fallbackResult = generateDeterministicAnalysis(analysisParams || {
      windSpeed: 145,
      rainfall: 420,
      stormSurge: 3.2,
      infrastructureVulnerability: 65,
      stormName: "Cyclone Varuna"
    });

    res.json({
      success: true,
      analysis: {
        ...fallbackResult,
        provider: "rule-engine",
        fallbackUsed: true,
        providerMessage: "AI service temporarily unavailable. Displaying deterministic scenario analysis."
      }
    });
  }
});

// POST /api/report
app.post('/api/report', (req, res) => {
  try {
    const { scenarioName, stormParameters, riskScore, severity, priorityZones, aiSummary, actions, analysisSource } = req.body;

    const newReport = {
      id: `rep-${Date.now().toString().slice(-4)}`,
      scenarioName: scenarioName || "Cyclone Varuna Rapid Impact Assessment",
      timestamp: new Date().toISOString(),
      riskScore: riskScore || 61,
      severity: severity || "HIGH",
      summary: aiSummary || "Comprehensive multi-domain impact evaluation across coastal zones.",
      stormParameters: stormParameters || {
        wind: "145 km/h",
        rainfall: "420 mm",
        surge: "3.2 m"
      },
      priorityZones: priorityZones || ["Zone 04 (91)", "Zone 02 (82)", "Zone 03 (74)"],
      actions: actions || [],
      analysisSource: analysisSource || "Deterministic Rule Engine",
      generatedBy: "Cyclone X Operations Intelligence Hub",
      disclaimer: "Simulated Disaster Decision Support Artifact. Not an official legal emergency declaration."
    };

    generatedReports.unshift(newReport);

    res.status(201).json({
      success: true,
      report: newReport
    });
  } catch (err) {
    console.error("Error generating report:", err);
    res.status(500).json({ success: false, error: "Failed to generate report" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Cyclone X Intelligence API running on http://localhost:${PORT}`);
});
