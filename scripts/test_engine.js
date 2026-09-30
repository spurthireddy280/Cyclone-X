// Unit test for Explainable Vulnerability Engine & Dynamic Zone recalculations
import { calculateRiskScore, calculateDynamicZoneRisks } from '../src/utils/riskEngine.js';

console.log('--- TESTING RISK ENGINE FORMULA INTEGRITY ---');

// 1. Baseline Test (Wind: 145, Rain: 420, Surge: 3.2, Infra: 65)
const baseline = calculateRiskScore({
  windSpeed: 145,
  rainfall: 420,
  stormSurge: 3.2,
  infrastructureExposure: 65
});
console.log('Baseline Score:', baseline.score, 'Severity:', baseline.severity);
if (baseline.score === 61 && baseline.severity === 'HIGH') {
  console.log('[PASS] Baseline score matches specification (61 HIGH)');
} else {
  console.error('[FAIL] Baseline score mismatch:', baseline.score);
  process.exit(1);
}

// 2. Extreme Cat 5 Test (Wind: 195, Rain: 580, Surge: 4.8, Infra: 90)
const extreme = calculateRiskScore({
  windSpeed: 195,
  rainfall: 580,
  stormSurge: 4.8,
  infrastructureExposure: 90
});
console.log('Extreme Score:', extreme.score, 'Severity:', extreme.severity);
if (extreme.score >= 85 && extreme.severity === 'CRITICAL') {
  console.log('[PASS] Extreme scenario correctly triggers CRITICAL rating');
} else {
  console.error('[FAIL] Extreme scenario failed:', extreme);
  process.exit(1);
}

// 3. Minimum Boundary Test
const min = calculateRiskScore({
  windSpeed: 80,
  rainfall: 50,
  stormSurge: 0.5,
  infrastructureExposure: 10
});
console.log('Minimum Score:', min.score, 'Severity:', min.severity);
if (min.score <= 15 && min.severity === 'LOW') {
  console.log('[PASS] Minimum boundary score returns LOW rating');
} else {
  console.error('[FAIL] Minimum boundary failed:', min);
  process.exit(1);
}

// 4. Factor contributions sum verification
const totalContribution = Object.values(baseline.factors).reduce((acc, f) => acc + f.contribution, 0);
console.log('Factor contribution sum:', totalContribution, 'vs Score:', baseline.score);
if (Math.abs(totalContribution - baseline.score) <= 2) {
  console.log('[PASS] Explainable factor contributions add up to total score');
} else {
  console.error('[FAIL] Contribution discrepancy:', totalContribution, baseline.score);
  process.exit(1);
}

console.log('ALL RISK ENGINE CALCULATIONS VERIFIED SUCCESSFULLY');
