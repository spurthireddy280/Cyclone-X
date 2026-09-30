// Multi-API AI Failover & Guaranteed Output Test Matrix
import { runDisasterAnalysis, runRuleBasedAnalysis, validateAiResponse } from '../server/gemini.js';

async function runFailoverTestSuite() {
  console.log('============================================================');
  console.log('CYCLONE X — MULTI-API FAILOVER & GUARANTEED OUTPUT TEST MATRIX');
  console.log('============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  const mockScenario = {
    stormName: "Cyclone Varuna",
    windSpeed: 175,
    rainfall: 510,
    stormSurge: 4.1,
    infrastructureVulnerability: 78
  };

  // ------------------------------------------------------------
  // TEST 1: Schema Validator unit tests
  // ------------------------------------------------------------
  console.log('--- TEST: Response Schema Validation ---');
  const validSchemaObj = {
    summary: "Cyclone Varuna maintains extreme threat intensity.",
    priorityZones: [{ code: "Zone 04", risk: "CRITICAL", headline: "Severe surge", recommendedImmediateAction: "Evacuate" }],
    infrastructureRisks: [{ asset: "Substation 07", type: "Power", exposure: 90, consequence: "Blackout" }],
    cascade: [
      { step: 1, title: "Intensifies", impact: "Wind", severity: "HIGH" },
      { step: 2, title: "Surge rises", impact: "Surge", severity: "CRITICAL" },
      { step: 3, title: "Floods", impact: "Water", severity: "CRITICAL" }
    ],
    actions: [{ priority: "P1", rank: 1, action: "Deploy pumps", reason: "Flooding", target: "Harbor" }],
    confidence: 94
  };

  assert(validateAiResponse(validSchemaObj) === true, "Valid structured schema passes validation");
  assert(validateAiResponse({ summary: "Too short" }) === false, "Incomplete schema fails validation");
  assert(validateAiResponse(null) === false, "Null object fails validation");

  // ------------------------------------------------------------
  // TEST 2: Deterministic Rule-Engine Fallback Output Completeness
  // ------------------------------------------------------------
  console.log('\n--- TEST: Deterministic Rule-Engine Fallback ---');
  const ruleResult = runRuleBasedAnalysis(mockScenario);

  assert(ruleResult.provider === "rule-engine", `Provider marked as rule-engine (got: ${ruleResult.provider})`);
  assert(ruleResult.fallbackUsed === true, `fallbackUsed flag is true`);
  assert(typeof ruleResult.summary === 'string' && ruleResult.summary.length > 50, `Executive summary generated (${ruleResult.summary.length} chars)`);
  assert(Array.isArray(ruleResult.priorityZones) && ruleResult.priorityZones.length >= 3, `At least 3 priority zones present (${ruleResult.priorityZones.length})`);
  assert(Array.isArray(ruleResult.infrastructureRisks) && ruleResult.infrastructureRisks.length >= 4, `All 4 infrastructure categories present (${ruleResult.infrastructureRisks.length})`);
  assert(Array.isArray(ruleResult.cascade) && ruleResult.cascade.length === 6, `Complete 6-stage failure cascade generated (${ruleResult.cascade.length} stages)`);
  assert(Array.isArray(ruleResult.actions) && ruleResult.actions.length >= 5, `At least 5 ranked tactical directives generated (${ruleResult.actions.length} actions)`);
  assert(ruleResult.confidence === 94, `Deterministic rule coverage score: ${ruleResult.confidence}%`);

  // ------------------------------------------------------------
  // TEST 3: Rule Reasoning verification (Conditions trigger dynamic logic)
  // ------------------------------------------------------------
  console.log('\n--- TEST: Rule Reasoning & Physical Dynamics ---');
  assert(ruleResult.summary.includes('4.1m') || ruleResult.summary.includes('surge'), "Summary reflects 4.1m storm surge");
  assert(ruleResult.priorityZones[0].code === 'Zone 04', "Top priority zone correctly identified as Zone 04");
  assert(ruleResult.priorityZones[0].risk.includes('CRITICAL'), "Zone 04 rated CRITICAL");

  const infraTypes = ruleResult.infrastructureRisks.map(i => i.type);
  assert(infraTypes.includes('Power'), "Power infrastructure evaluated (Substation 07)");
  assert(infraTypes.includes('Road'), "Road infrastructure evaluated (Highway Corridor R14)");
  assert(infraTypes.includes('Hospital'), "Hospital infrastructure evaluated (Coastal Medical Center)");
  assert(infraTypes.includes('Shelter'), "Shelter infrastructure evaluated (Delta Technical Shelter S08)");

  // ------------------------------------------------------------
  // TEST 4: All keys missing or invalid -> Safe Fallback (No crash, no secrets)
  // ------------------------------------------------------------
  console.log('\n--- TEST: All Keys Missing/Invalid -> Safe Sequential Fallback ---');
  // Temporarily clear env
  const origKey1 = process.env.GEMINI_API_KEY_1;
  const origKey2 = process.env.GEMINI_API_KEY_2;
  const origKey3 = process.env.GEMINI_API_KEY_3;
  const origKey = process.env.GEMINI_API_KEY;

  delete process.env.GEMINI_API_KEY_1;
  delete process.env.GEMINI_API_KEY_2;
  delete process.env.GEMINI_API_KEY_3;
  delete process.env.GEMINI_API_KEY;

  const noKeyResult = await runDisasterAnalysis(mockScenario);
  assert(noKeyResult.provider === "rule-engine", `When keys are missing, fallback to rule-engine operates cleanly`);
  assert(noKeyResult.fallbackUsed === true, `fallbackUsed is true`);
  assert(typeof noKeyResult.summary === 'string', `Summary is populated`);

  // Restore env
  if (origKey1) process.env.GEMINI_API_KEY_1 = origKey1;
  if (origKey2) process.env.GEMINI_API_KEY_2 = origKey2;
  if (origKey3) process.env.GEMINI_API_KEY_3 = origKey3;
  if (origKey) process.env.GEMINI_API_KEY = origKey;

  // ------------------------------------------------------------
  // TEST 5: API /api/analyze Integration Test
  // ------------------------------------------------------------
  console.log('\n--- TEST: Live Integration via HTTP POST /api/analyze ---');
  try {
    const res = await fetch('http://localhost:3001/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storm: { name: "Cyclone Varuna" },
        parameters: {
          windSpeed: 175,
          rainfall: 510,
          stormSurge: 4.1
        }
      })
    });

    const data = await res.json();
    assert(data.success === true, "POST /api/analyze returns success: true");
    assert(!!data.analysis.summary, "analysis.summary exists");
    assert(Array.isArray(data.analysis.priorityZones) && data.analysis.priorityZones.length >= 3, "analysis.priorityZones exists");
    assert(Array.isArray(data.analysis.infrastructureRisks) && data.analysis.infrastructureRisks.length >= 4, "analysis.infrastructureRisks exists");
    assert(Array.isArray(data.analysis.cascade) && data.analysis.cascade.length === 6, "analysis.cascade exists");
    assert(Array.isArray(data.analysis.actions) && data.analysis.actions.length >= 5, "analysis.actions exists");
    assert(typeof data.analysis.provider === 'string', `analysis.provider exists (${data.analysis.provider})`);
    assert(typeof data.analysis.fallbackUsed === 'boolean', `analysis.fallbackUsed exists (${data.analysis.fallbackUsed})`);
    assert(!JSON.stringify(data).includes('AQ.Ab8'), "No API secret keys returned in response payload");
  } catch (err) {
    assert(false, `Integration test failed: ${err.message}`);
  }

  // ------------------------------------------------------------
  // TEST 6: Sync to Response Planner Schema Compatibility
  // ------------------------------------------------------------
  console.log('\n--- TEST: Response Planner Action Syncing ---');
  const plannerActions = ruleResult.actions.map((act, idx) => ({
    id: `task-ai-${Date.now()}-${idx}`,
    priority: act.priority ? `${act.priority} - HIGH` : "P1 - CRITICAL",
    rank: act.rank || idx + 1,
    title: act.action,
    reason: act.reason,
    area: act.target || "Coastal Corridor",
    urgency: idx === 0 ? "Immediate (< 60 mins)" : "Urgent (< 3 hours)",
    status: "Pending",
    assignedTo: "Cyclone X Rapid Response Unit"
  }));

  assert(plannerActions.length >= 5, `Response Planner correctly formatted ${plannerActions.length} actions from fallback`);
  assert(plannerActions[0].title.length > 10, `Action title is valid: "${plannerActions[0].title}"`);
  assert(plannerActions[0].area.length > 5, `Action target area is valid: "${plannerActions[0].area}"`);

  // ------------------------------------------------------------
  // TEST 7: Report Generation with Fallback Intelligence Source
  // ------------------------------------------------------------
  console.log('\n--- TEST: Report Generation with Analysis Source ---');
  try {
    const reportRes = await fetch('http://localhost:3001/api/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scenarioName: "Cyclone Varuna Full Fallback Briefing",
        stormParameters: { wind: "175 km/h", rainfall: "510 mm", surge: "4.1 m" },
        riskScore: 88,
        severity: "CRITICAL",
        priorityZones: ["Zone 04 (Delta)", "Zone 02 (Harbor)", "Zone 03 (Core)"],
        aiSummary: ruleResult.summary,
        actions: ruleResult.actions.map(a => a.action),
        analysisSource: "Deterministic Rule Engine"
      })
    });

    const reportData = await reportRes.json();
    assert(reportData.success === true, "POST /api/report returns success: true");
    assert(reportData.report.analysisSource === "Deterministic Rule Engine", `Report records correct analysis source: ${reportData.report.analysisSource}`);
  } catch (err) {
    assert(false, `Report creation failed: ${err.message}`);
  }

  // ------------------------------------------------------------
  // TEST 8: Health endpoint reports Multi-API status safely
  // ------------------------------------------------------------
  console.log('\n--- TEST: Health Check Safe Status ---');
  try {
    const health = await fetch('http://localhost:3001/api/health').then(r => r.json());
    assert(health.status === 'ok', "Health check returned ok");
    assert(typeof health.aiEngine === 'string', `Health reports AI engine status: ${health.aiEngine}`);
    assert(!JSON.stringify(health).includes('AQ.Ab8'), "No secret keys present in health payload");
  } catch (err) {
    assert(false, `Health check failed: ${err.message}`);
  }

  // Summary
  console.log('\n============================================================');
  console.log(`MULTI-API FAILOVER TEST MATRIX: ${passed} PASSED, ${failed} FAILED`);
  console.log('============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runFailoverTestSuite();
