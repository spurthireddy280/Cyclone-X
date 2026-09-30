// Cyclone X Multi-API AI Failover & Deterministic Cascade Reasoning Engine
// Architecture:
// 1. Gemini API Key #1 (gemini-1)
// 2. Gemini API Key #2 (gemini-2)
// 3. Gemini API Key #3 (gemini-3)
// 4. Deterministic Explainable Vulnerability Engine (rule-engine)

import { initialScenarioData } from './data/mockScenario.js';

/**
 * Validates that an AI response matches the strict schema required by Cyclone X.
 * Schema:
 * {
 *   summary: string,
 *   priorityZones: array,
 *   infrastructureRisks: array,
 *   cascade: array,
 *   actions: array,
 *   confidence: number | string
 * }
 */
export function validateAiResponse(data) {
  if (!data || typeof data !== 'object') return false;

  // 1. Summary validation
  if (typeof data.summary !== 'string' || data.summary.trim().length < 15) {
    return false;
  }

  // 2. Priority Zones validation (at least 1, recommended >= 3)
  if (!Array.isArray(data.priorityZones) || data.priorityZones.length < 1) {
    return false;
  }
  const hasValidZone = data.priorityZones.some(z => 
    z && (z.code || z.name || z.zone) && (z.risk || z.riskScore || z.severity)
  );
  if (!hasValidZone) return false;

  // 3. Infrastructure Risks validation
  if (!Array.isArray(data.infrastructureRisks) || data.infrastructureRisks.length < 1) {
    return false;
  }

  // 4. Cascade validation (at least 3 steps)
  if (!Array.isArray(data.cascade) || data.cascade.length < 3) {
    return false;
  }

  // 5. Tactical Actions validation
  if (!Array.isArray(data.actions) || data.actions.length < 1) {
    return false;
  }

  // 6. Confidence validation
  if (data.confidence === undefined || data.confidence === null) {
    return false;
  }

  return true;
}

/**
 * Attempt to call a specific Gemini AI provider key with strict timeout and validation.
 * NEVER prints API keys or secrets to logs.
 */
async function tryGeminiProvider(apiKey, providerId, providerName, scenarioParams) {
  const {
    stormName = "Cyclone Varuna",
    windSpeed = 145,
    rainfall = 420,
    stormSurge = 3.2,
    infrastructureVulnerability = 65,
    scenarioPreset = "baseline"
  } = scenarioParams || {};

  // Check if API key is plausible (not placeholder, non-empty)
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length < 10 || apiKey.includes("your_gemini_api_key")) {
    return {
      success: false,
      reason: "missing_or_invalid_key",
      status: 400
    };
  }

  const prompt = `You are Cyclone X's AI Disaster Reasoning Engine.
Analyze the following cyclone scenario:
- Storm Name: ${stormName}
- Wind Speed: ${windSpeed} km/h
- 24h Rainfall: ${rainfall} mm
- Storm Surge: ${stormSurge} meters
- Infrastructure Vulnerability: ${infrastructureVulnerability} / 100
- Scenario Mode: ${scenarioPreset}

Respond with ONLY valid JSON matching this schema:
{
  "summary": "Executive summary of storm impact and threat envelope",
  "priorityZones": [
    {"code": "Zone 04", "risk": "CRITICAL", "headline": "string reason", "recommendedImmediateAction": "string"}
  ],
  "infrastructureRisks": [
    {"asset": "Coastal Substation 07", "type": "Power", "exposure": 92, "consequence": "string"}
  ],
  "actions": [
    {"priority": "P1", "rank": 1, "action": "string", "reason": "string", "target": "string"}
  ],
  "cascade": [
    {"step": 1, "title": "Cyclone intensifies", "impact": "description", "severity": "CRITICAL"},
    {"step": 2, "title": "Storm surge increases", "impact": "description", "severity": "CRITICAL"},
    {"step": 3, "title": "Low-lying roads flood", "impact": "description", "severity": "HIGH"},
    {"step": 4, "title": "Emergency transport slows", "impact": "description", "severity": "HIGH"},
    {"step": 5, "title": "Hospital access pressure rises", "impact": "description", "severity": "CRITICAL"},
    {"step": 6, "title": "Emergency response capacity decreases", "impact": "description", "severity": "CRITICAL"}
  ],
  "confidence": 92
}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7500);

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey.trim())}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json"
        }
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        success: false,
        reason: `HTTP ${response.status}`,
        status: response.status
      };
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText || candidateText.trim().length === 0) {
      return {
        success: false,
        reason: "empty_response",
        status: 200
      };
    }

    let cleaned = candidateText.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      return {
        success: false,
        reason: "malformed_json",
        error: parseErr.message
      };
    }

    if (!validateAiResponse(parsed)) {
      return {
        success: false,
        reason: "missing_required_fields"
      };
    }

    // Normalization to ensure consistent UI rendering
    return {
      success: true,
      data: {
        summary: parsed.summary,
        priorityZones: parsed.priorityZones.map(pz => ({
          code: pz.code || pz.name || "Zone",
          risk: pz.risk || `${pz.severity || 'CRITICAL'} (${pz.riskScore || 90}/100)`,
          headline: pz.headline || pz.reason || "Vulnerable zone with compounded exposure.",
          recommendedImmediateAction: pz.recommendedImmediateAction || pz.immediateAction || "Initiate priority protective measures."
        })),
        infrastructureRisks: parsed.infrastructureRisks.map(ir => ({
          asset: ir.asset || "Critical Facility",
          type: ir.type || ir.category || "Infrastructure",
          exposure: Number(ir.exposure) || 85,
          consequence: ir.consequence || ir.reason || "High operational risk from cyclone conditions.",
          recommendation: ir.recommendation || "Deploy emergency mitigation team."
        })),
        cascade: parsed.cascade.map((c, i) => ({
          step: c.step || i + 1,
          title: c.title || `Impact Phase ${i + 1}`,
          impact: c.impact || "Systemic disruption along primary corridors.",
          severity: c.severity || "HIGH"
        })),
        actions: parsed.actions.map((act, i) => ({
          priority: act.priority || (i < 2 ? "P1" : "P2"),
          rank: act.rank || i + 1,
          action: act.action || "Execute targeted response directive.",
          reason: act.reason || "Mitigate cascading threat.",
          target: act.target || "Coastal Zone Corridor"
        })),
        confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 92
      }
    };
  } catch (err) {
    clearTimeout(timeoutId);
    const isTimeout = err.name === 'AbortError' || err.message?.includes('aborted');
    return {
      success: false,
      reason: isTimeout ? "timeout (7500ms exceeded)" : `network_exception: ${err.message}`
    };
  }
}

/**
 * Deterministic Explainable AI Vulnerability Engine.
 * Fully adapts to scenario conditions (wind, rainfall, surge, infrastructure).
 * Never fails, always produces a structured analysis.
 */
export function runRuleBasedAnalysis(scenarioParams = {}) {
  const {
    windSpeed = 145,
    rainfall = 420,
    stormSurge = 3.2,
    infrastructureVulnerability = 65,
    stormName = "Cyclone Varuna"
  } = scenarioParams;

  // 1. Calculate weighted domain scores based on Cyclone X standard formulation:
  // Wind = 30%, Rainfall = 25%, Storm Surge = 30%, Infrastructure = 15%
  const windScore = Math.min(100, Math.max(10, Math.round((windSpeed / 220) * 100)));
  const rainScore = Math.min(100, Math.max(10, Math.round((rainfall / 600) * 100)));
  const surgeScore = Math.min(100, Math.max(10, Math.round((stormSurge / 5.5) * 100)));
  const infraScore = Math.min(100, Math.max(10, Math.round(infrastructureVulnerability || 65)));

  const compositeRiskScore = Math.round(
    windScore * 0.30 +
    rainScore * 0.25 +
    surgeScore * 0.30 +
    infraScore * 0.15
  );

  // Severity classification: 0-24: LOW, 25-49: MODERATE, 50-74: HIGH, 75-100: CRITICAL
  const severity = compositeRiskScore >= 75 ? "CRITICAL"
    : compositeRiskScore >= 50 ? "HIGH"
    : compositeRiskScore >= 25 ? "MODERATE"
    : "LOW";

  // 2. Rule-Based Reasoning Engine (Dynamic condition triggers):
  const isHighSurge = stormSurge >= 4.0;
  const isHighRainfall = rainfall >= 400;
  const isHighWind = windSpeed >= 160;
  const isHighExposure = infraScore >= 70;

  // Generate Executive Summary
  let summary = "";
  if (isHighSurge && isHighRainfall) {
    summary = `${stormName} represents an extreme compound flood catastrophe. Elevated storm surge of ${stormSurge}m coincident with ${rainfall}mm rainfall creates dual-front marine and urban inundation across low-elevation coastal zones (Zone 04 and Zone 02). Sustained winds of ${windSpeed} km/h severely restrict ground emergency transport.`;
  } else if (isHighSurge) {
    summary = `${stormName} generates severe maritime surge threat. A catastrophic ${stormSurge}m tidal surge will overtop protective coastal sea walls across Zone 04 and the industrial harbor corridor. Sustained winds of ${windSpeed} km/h threaten offshore structures and causeway access.`;
  } else if (isHighRainfall) {
    summary = `${stormName} presents an intense hydrological threat. Unprecedented 24-hour rainfall of ${rainfall}mm will saturate delta soil and overpower municipal drainage channels, generating multi-point urban flash flooding across Zone 03 and Zone 04.`;
  } else if (isHighWind) {
    summary = `${stormName} maintains dangerous high-velocity wind shear with sustained gusts of ${windSpeed} km/h. Structural cladding, high-voltage transmission lines, and port gantry cranes face extreme structural fatigue along the coastal maritime belt.`;
  } else {
    summary = `${stormName} maintains dangerous Category 3 intensity with ${windSpeed} km/h sustained gusts. Coincident ${stormSurge}m storm surge threatens marine infrastructure and low-elevation coastal access corridors. Over 400mm rainfall will trigger multi-point urban flash flooding across Zone 04 and Zone 02.`;
  }

  // 3. Dynamic Priority Containment Zones
  const priorityZones = [
    {
      code: "Zone 04",
      risk: isHighSurge || isHighRainfall ? "CRITICAL (96/100)" : "CRITICAL (91/100)",
      riskScore: isHighSurge || isHighRainfall ? 96 : 91,
      severity: "CRITICAL",
      headline: `Below-sea-level elevation facing ${stormSurge}m surge wave and single-point arterial bottleneck (Route R14).`,
      recommendedImmediateAction: "Enforce mandatory evacuation of 96,000 residents before high-tide surge peak."
    },
    {
      code: "Zone 02",
      risk: isHighSurge || isHighWind ? "CRITICAL (88/100)" : "HIGH (82/100)",
      riskScore: isHighSurge || isHighWind ? 88 : 82,
      severity: isHighSurge || isHighWind ? "CRITICAL" : "HIGH",
      headline: "Industrial maritime basin with 220kV Substation 07, container cranes, and hazardous chemical storage yards.",
      recommendedImmediateAction: "Deploy mobile flood cofferdams around 220kV yard and activate remote grid bypass."
    },
    {
      code: "Zone 03",
      risk: isHighRainfall ? "HIGH (78/100)" : "HIGH (74/100)",
      riskScore: isHighRainfall ? 78 : 74,
      severity: "HIGH",
      headline: "High-density metropolitan core; elevated structural wind exposure and urban drainage pump station saturation.",
      recommendedImmediateAction: "Restrict Expressway E02 to emergency traffic; pre-position trauma overflow wards at Apex Regional Hospital."
    }
  ];

  // 4. Dynamic Infrastructure Risks across categories (Hospital, Power, Road, Shelter)
  const infrastructureRisks = [
    {
      asset: "Coastal Transmission Substation 07",
      type: "Power",
      exposure: Math.min(98, Math.round(surgeScore * 0.6 + windScore * 0.4)),
      risk: surgeScore >= 60 ? "CRITICAL" : "HIGH",
      consequence: "Loss of primary 220kV grid power for 180,000 residents and coastal intensive care dialysis units.",
      recommendation: "Deploy high-capacity mobile dewatering pumps and configure automated grid sectionalizing."
    },
    {
      asset: "Highway Corridor R14",
      type: "Road",
      exposure: Math.min(99, Math.round(surgeScore * 0.7 + rainScore * 0.3)),
      risk: "CRITICAL",
      consequence: "Severing of sole ground evacuation route for southern delta settlement due to 50-80cm water wash.",
      recommendation: "Establish high-clearance military shuttle fleet and contraflow traffic control immediately."
    },
    {
      asset: "Coastal Medical Center",
      type: "Hospital",
      exposure: Math.min(95, Math.round(rainScore * 0.5 + windScore * 0.5)),
      risk: rainScore >= 65 ? "CRITICAL" : "HIGH",
      consequence: "Basement diesel generator flooding risking emergency room and ICU life-support continuity.",
      recommendation: "Sandbag fuel storage vaults, elevate mobile generator units, and prepare triage airlift to Apex Trauma Hub."
    },
    {
      asset: "Delta Technical Shelter S08",
      type: "Shelter",
      exposure: Math.min(90, Math.round(surgeScore * 0.5 + rainScore * 0.5)),
      risk: surgeScore >= 55 ? "CRITICAL" : "HIGH",
      consequence: "Secondary flooding of access perimeter; 850 evacuees risk compound isolation.",
      recommendation: "Initiate rapid transfer of vulnerable occupants to elevated Centennial Arena Mega-Shelter S12."
    }
  ];

  // 5. Systemic Impact Cascade (6 Stages adapting to scenario drivers)
  const cascade = [
    {
      step: 1,
      title: "Cyclone intensifies over coastal waters",
      impact: `Wind shear reaches sustained ${windSpeed} km/h; barometric drop to 964 hPa drives astronomical tidal buildup.`,
      severity: isHighWind ? "CRITICAL" : "HIGH"
    },
    {
      step: 2,
      title: `Storm surge water levels rise to ${stormSurge}m`,
      impact: isHighSurge
        ? `Surge wave reaches ${stormSurge}m, overtopping outer seawalls and pushing saltwater 4.2 km into estuarine canals.`
        : `Tidal swell reaches ${stormSurge}m; saltwater enters secondary coastal drainage channels.`,
      severity: "CRITICAL"
    },
    {
      step: 3,
      title: "Low-lying roads & Route R14 flood",
      impact: isHighRainfall
        ? `Over ${rainfall}mm precipitation combines with surge runoff to submerge Route R14 under 75cm standing water.`
        : `Runoff creates impassable conditions across primary evacuation causeways.`,
      severity: "CRITICAL"
    },
    {
      step: 4,
      title: "Emergency transport and logistics slow",
      impact: "Standard civilian ambulances and fuel resupply convoys halted by inundated transit bottlenecks.",
      severity: "HIGH"
    },
    {
      step: 5,
      title: "Hospital access & Substation 07 pressure rises",
      impact: "Coastal Medical Center road access cut; Substation 07 basement switchgear faces water ingress.",
      severity: "CRITICAL"
    },
    {
      step: 6,
      title: "Emergency response capacity reaches threshold",
      impact: "First responder response times double unless amphibious assets and elevated staging hubs are operational.",
      severity: isHighSurge || isHighRainfall ? "CRITICAL" : "HIGH"
    }
  ];

  // 6. Ranked Tactical Actions (Synced to Response Planner)
  const actions = [
    {
      priority: "P1",
      rank: 1,
      action: "Execute Urgent Evacuation Transfer for Zone 04 & Shelter S08",
      reason: `Surge overtopping probability exceeds 92%; Route R14 will become impassable within 90 minutes.`,
      target: "Zone 04 Delta Corridor"
    },
    {
      priority: "P1",
      rank: 2,
      action: "Fortify Substation 07 with High-Capacity Mobile Dewatering Pumps",
      reason: "Prevent catastrophic electrical cascade across metropolitan trauma network.",
      target: "Zone 02 Harbor Basin"
    },
    {
      priority: "P2",
      rank: 3,
      action: "Establish High-Clearance Shuttle Fleet on Elevated Expressway E02",
      reason: "Bypasses surface water accumulation to route casualties to Apex Trauma.",
      target: "Expressway E02 Ramp System"
    },
    {
      priority: "P2",
      rank: 4,
      action: "Pre-position Emergency Medical Staging Teams at Centennial Arena S12",
      reason: "Centennial Arena has 2,260 berths ready to absorb displaced coastal populations.",
      target: "Zone 05 Foothills Mega-Shelter"
    },
    {
      priority: "P3",
      rank: 5,
      action: "Broadcast Multilingual Satellite Emergency Bulletins via Mesh Radios",
      reason: "Ensure warnings reach disconnected coastal communities before cellular towers lose power.",
      target: "Coastal Maritime Belt"
    }
  ];

  return {
    summary,
    priorityZones,
    infrastructureRisks,
    cascade,
    actions,
    confidence: 94, // High deterministic coverage
    provider: "rule-engine",
    fallbackUsed: true,
    providerMessage: "AI providers unavailable. Displaying deterministic scenario analysis.",
    source: "Deterministic Vulnerability Reasoning Engine (Local Active)",
    isFallback: true,
    disclaimer: "AI decision support simulation only. Not an official authoritative emergency bulletin."
  };
}

/**
 * Main Orchestrator: Multi-API AI Failover Engine.
 *
 * Priority order:
 * 1. API KEY #1 (GEMINI_API_KEY_1)
 * 2. API KEY #2 (GEMINI_API_KEY_2)
 * 3. API KEY #3 (GEMINI_API_KEY_3)
 * 4. Rule-Based Fallback Engine (rule-engine)
 *
 * Sequential execution: Only attempts next provider upon failure.
 * Never exposes API keys in logs or response payloads.
 */
export async function runDisasterAnalysis(scenarioParams = {}) {
  // Provider configuration list
  const providers = [
    { id: "gemini-1", name: "Gemini 1", key: process.env.GEMINI_API_KEY_1 },
    { id: "gemini-2", name: "Gemini 2", key: process.env.GEMINI_API_KEY_2 },
    { id: "gemini-3", name: "Gemini 3", key: process.env.GEMINI_API_KEY_3 }
  ];

  // Backwards compatibility: If legacy GEMINI_API_KEY is present and key 1 is not configured, map it to Provider 1
  if (!providers[0].key && process.env.GEMINI_API_KEY) {
    providers[0].key = process.env.GEMINI_API_KEY;
  }

  // Iterate sequentially through providers
  for (let i = 0; i < providers.length; i++) {
    const provider = providers[i];

    // Check if key is available
    if (!provider.key || provider.key.trim().length < 10 || provider.key.includes("your_gemini_api_key")) {
      console.log(`[AI] ${provider.name} (${provider.id}) skipped: key not configured`);
      continue;
    }

    console.log(`[AI] Attempting ${provider.name} (${provider.id})...`);
    const result = await tryGeminiProvider(provider.key, provider.id, provider.name, scenarioParams);

    if (result.success && result.data) {
      console.log(`[AI] ${provider.name} (${provider.id}) succeeded`);
      const providerMessage = i > 0
        ? `Switched to backup AI provider (${provider.name}).`
        : "";

      return {
        ...result.data,
        provider: provider.id,
        fallbackUsed: false,
        providerMessage,
        source: `${provider.name} (Cloud AI)`,
        isFallback: false,
        disclaimer: "AI decision support simulation only. Not an official authoritative emergency bulletin."
      };
    }

    // Provider failed — log safe status and continue to next provider
    console.log(`[AI] ${provider.name} (${provider.id}) failed: ${result.reason || 'unknown failure'}`);
    if (i < providers.length - 1) {
      console.log(`[AI] Switching to ${providers[i + 1].name} (${providers[i + 1].id})...`);
    }
  }

  // All providers failed or were unconfigured -> Execute Explainable Deterministic Fallback Engine
  console.log("[AI] All external AI providers unavailable. Executing deterministic rule engine fallback");
  return runRuleBasedAnalysis(scenarioParams);
}

// Backwards compatibility alias
export const generateDeterministicAnalysis = runRuleBasedAnalysis;
