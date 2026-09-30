// Comprehensive QA Automation Test Suite for Cyclone X

async function runQATests() {
  console.log('============================================================');
  console.log('CYCLONE X — AUTOMATED QA AUDIT & VERIFICATION');
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

  // 1. Verify Frontend Routes
  console.log('\n--- 1. TESTING ALL 14 FRONTEND ROUTES ---');
  const routes = [
    '/',
    '/login',
    '/signup',
    '/app',
    '/app/storm',
    '/app/risk',
    '/app/map',
    '/app/infrastructure',
    '/app/simulator',
    '/app/ai',
    '/app/response',
    '/app/alerts',
    '/app/reports',
    '/app/settings'
  ];

  for (const r of routes) {
    try {
      const res = await fetch(`http://localhost:5173${r}`);
      assert(res.status === 200, `Route ${r.padEnd(20)} returned HTTP 200 OK`);
    } catch (e) {
      assert(false, `Route ${r} failed to respond: ${e.message}`);
    }
  }

  // 2. Verify Backend API Endpoints
  console.log('\n--- 2. TESTING BACKEND REST API ENDPOINTS ---');
  try {
    const health = await fetch('http://localhost:3001/api/health').then(r => r.json());
    assert(health.status === 'ok', `GET /api/health returned status 'ok'`);
    assert(health.service.includes('Cyclone X'), `Service name identified as Cyclone X`);
  } catch (e) {
    assert(false, `GET /api/health failed: ${e.message}`);
  }

  try {
    const scenario = await fetch('http://localhost:3001/api/scenario').then(r => r.json());
    assert(scenario.success === true, `GET /api/scenario returned success: true`);
    assert(scenario.data.name === 'Cyclone Varuna', `Target storm confirmed as Cyclone Varuna`);
    assert(scenario.data.zones.length === 5, `5 Geographic Tactical Zones loaded`);
    assert(scenario.data.infrastructure.length >= 9, `Infrastructure assets loaded: ${scenario.data.infrastructure.length}`);
    assert(scenario.data.alerts.length >= 5, `Alerts feed initialized with ${scenario.data.alerts.length} items`);
    assert(scenario.data.initialTasks.length >= 5, `Initial tactical tasks loaded: ${scenario.data.initialTasks.length}`);
  } catch (e) {
    assert(false, `GET /api/scenario failed: ${e.message}`);
  }

  // 3. Verify AI Analysis Endpoint & Schema
  console.log('\n--- 3. TESTING AI ANALYSIS & CASSCADE REASONING SCHEMA ---');
  try {
    const aiRes = await fetch('http://localhost:3001/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storm: { name: 'Cyclone Varuna' },
        parameters: { windSpeed: 175, rainfall: 510, stormSurge: 4.1, infrastructureVulnerability: 80 }
      })
    }).then(r => r.json());

    assert(aiRes.success === true, `POST /api/analyze returned success: true`);
    const analysis = aiRes.analysis;
    assert(typeof analysis.summary === 'string' && analysis.summary.length > 20, `Analysis summary generated (${analysis.summary.length} chars)`);
    assert(Array.isArray(analysis.priorityZones) && analysis.priorityZones.length >= 3, `Priority zones array populated: ${analysis.priorityZones.length}`);
    assert(Array.isArray(analysis.infrastructureRisks) && analysis.infrastructureRisks.length >= 3, `Infrastructure risks populated: ${analysis.infrastructureRisks.length}`);
    assert(Array.isArray(analysis.cascade) && analysis.cascade.length === 6, `6-stage failure cascade generated`);
    assert(Array.isArray(analysis.actions) && analysis.actions.length >= 3, `Synthesized tactical actions generated: ${analysis.actions.length}`);
    assert(typeof analysis.provider === 'string', `Provider identified as ${analysis.provider}`);
    assert(typeof analysis.fallbackUsed === 'boolean', `fallbackUsed flag verified (${analysis.fallbackUsed})`);
    assert(typeof analysis.confidence === 'number' && analysis.confidence >= 80, `Confidence / Rule Coverage score: ${analysis.confidence}%`);
  } catch (e) {
    assert(false, `POST /api/analyze failed: ${e.message}`);
  }

  // 4. Verify Incident Report Generation Endpoint
  console.log('\n--- 4. TESTING INCIDENT REPORT CREATION ---');
  try {
    const reportRes = await fetch('http://localhost:3001/api/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scenarioName: 'Automated QA Rapid Impact Report',
        riskScore: 84,
        severity: 'CRITICAL',
        aiSummary: 'Critical multi-zone overtopping evaluation completed successfully.',
        actions: ['Deploy mobile pumps to Substation 07', 'Evacuate Zone 04']
      })
    }).then(r => r.json());

    assert(reportRes.success === true, `POST /api/report returned success: true`);
    assert(reportRes.report.id.startsWith('rep-'), `Report assigned valid ID: ${reportRes.report.id}`);
    assert(reportRes.report.severity === 'CRITICAL', `Report severity set to CRITICAL`);
  } catch (e) {
    assert(false, `POST /api/report failed: ${e.message}`);
  }

  // 5. Verify Vite Proxy to Express
  console.log('\n--- 5. TESTING VITE PROXY (http://localhost:5173/api/health) ---');
  try {
    const proxyHealth = await fetch('http://localhost:5173/api/health').then(r => r.json());
    assert(proxyHealth.status === 'ok', `Vite reverse-proxy to Express /api/health active`);
  } catch (e) {
    assert(false, `Vite proxy failed: ${e.message}`);
  }

  // 6. Verify Basemap Runtime Configuration & Fallback Security
  console.log('\n--- 6. TESTING CARTO BASEMAP CONFIGURATION & SECURITY ---');
  try {
    const mapConfig = await fetch('http://localhost:3001/api/config/map').then(r => r.json());
    assert(mapConfig.success === true, `GET /api/config/map returned success: true`);
    assert(typeof mapConfig.hasKey === 'boolean', `hasKey boolean flag confirmed (${mapConfig.hasKey})`);
    assert(typeof mapConfig.attribution === 'string' && mapConfig.attribution.includes('CARTO') && mapConfig.attribution.includes('OpenStreetMap'), `Attribution contains OpenStreetMap and CARTO`);
    assert(typeof mapConfig.fallbackUrl === 'string' && mapConfig.fallbackUrl.includes('Canvas/World_Dark_Gray_Base'), `Fallback URL points to clean dark canvas basemap`);
    
    // Security check: ensure NO Gemini API keys or secrets are leaked
    const jsonStr = JSON.stringify(mapConfig);
    assert(!jsonStr.includes('GEMINI'), `Map configuration does not leak GEMINI keys`);
    assert(!jsonStr.includes('AQ.Ab8'), `Map configuration does not leak any Gemini secret hashes`);

    // Verify fallback basemap tile connectivity
    const tileRes = await fetch('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/11/956/1498');
    assert(tileRes.status === 200, `Fallback geographic basemap tile fetched successfully (HTTP 200)`);
  } catch (e) {
    assert(false, `Map configuration test failed: ${e.message}`);
  }

  // Summary
  console.log('\n============================================================');
  console.log(`QA AUDIT COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log('============================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runQATests();

