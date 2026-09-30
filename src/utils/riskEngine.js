// Deterministic Explainable Vulnerability Engine for Cyclone X

/**
 * Weights:
 * - Wind Impact: 30%
 * - Rainfall: 25%
 * - Storm Surge: 30%
 * - Infrastructure Vulnerability: 15%
 */

export function calculateRiskScore({
  windSpeed = 145,       // km/h (range ~ 90 - 220)
  rainfall = 420,        // mm (range ~ 50 - 650)
  stormSurge = 3.2,      // meters (range ~ 0.5 - 5.5)
  infrastructureExposure = 65 // 0 - 100
}) {
  // Normalize each parameter to 0 - 100
  // Wind: 70 km/h (tropical gale) = 0%, 205 km/h (Category 5) = 100%
  const windNorm = Math.min(100, Math.max(0, ((windSpeed - 70) / (205 - 70)) * 100));

  // Rainfall: 50 mm = 0%, 600 mm = 100%
  const rainNorm = Math.min(100, Math.max(0, ((rainfall - 50) / (600 - 50)) * 100));

  // Storm Surge: 0.5m = 0%, 5.0m = 100%
  const surgeNorm = Math.min(100, Math.max(0, ((stormSurge - 0.5) / (5.0 - 0.5)) * 100));

  // Infrastructure exposure already 0 - 100
  const infraNorm = Math.min(100, Math.max(0, infrastructureExposure));

  // Contributions
  const windContribution = windNorm * 0.30;
  const rainContribution = rainNorm * 0.25;
  const surgeContribution = surgeNorm * 0.30;
  const infraContribution = infraNorm * 0.15;

  const rawScore = windContribution + rainContribution + surgeContribution + infraContribution;
  const score = Math.round(Math.min(100, Math.max(0, rawScore)));

  // Severity rating:
  // 0–24: LOW
  // 25–49: MODERATE
  // 50–74: HIGH
  // 75–100: CRITICAL
  let severity = "LOW";
  let color = "#10B981"; // green

  if (score >= 75) {
    severity = "CRITICAL";
    color = "#EF4444"; // red
  } else if (score >= 50) {
    severity = "HIGH";
    color = "#F59E0B"; // amber / orange
  } else if (score >= 25) {
    severity = "MODERATE";
    color = "#3B82F6"; // blue
  }

  return {
    score,
    severity,
    color,
    factors: {
      wind: {
        weight: 30,
        raw: windSpeed,
        normalized: Math.round(windNorm),
        contribution: Math.round(windContribution),
        label: "Wind Exposure"
      },
      rainfall: {
        weight: 25,
        raw: rainfall,
        normalized: Math.round(rainNorm),
        contribution: Math.round(rainContribution),
        label: "Precipitation Inundation"
      },
      stormSurge: {
        weight: 30,
        raw: stormSurge,
        normalized: Math.round(surgeNorm),
        contribution: Math.round(surgeContribution),
        label: "Hydrodynamic Storm Surge"
      },
      infrastructure: {
        weight: 15,
        raw: infrastructureExposure,
        normalized: Math.round(infraNorm),
        contribution: Math.round(infraContribution),
        label: "Infrastructure Vulnerability"
      }
    },
    formulaDescription: "Score = (Wind × 30%) + (Precipitation × 25%) + (Storm Surge × 30%) + (Infrastructure Vulnerability × 15%)"
  };
}

/**
 * Recalculate zone risk scores dynamically under simulation parameters
 */
export function calculateDynamicZoneRisks(zones, currentRisk, simRisk) {
  const deltaFactor = simRisk / Math.max(1, currentRisk);

  return zones.map(zone => {
    let multiplier = 1.0;
    if (zone.code === "Zone 04") multiplier = 1.15; // Lowland delta super-sensitive to surge
    if (zone.code === "Zone 02") multiplier = 1.08; // Industrial harbor
    if (zone.code === "Zone 05") multiplier = 0.85; // Elevated foothills

    const adjustedScore = Math.min(99, Math.max(12, Math.round(zone.riskScore * ((deltaFactor - 1) * multiplier + 1))));
    
    let severity = "LOW";
    if (adjustedScore >= 75) severity = "CRITICAL";
    else if (adjustedScore >= 50) severity = "HIGH";
    else if (adjustedScore >= 25) severity = "MODERATE";

    return {
      ...zone,
      riskScore: adjustedScore,
      severity
    };
  });
}
