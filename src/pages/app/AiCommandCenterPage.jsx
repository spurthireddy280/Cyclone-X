import React, { useState } from 'react';
import { useScenario } from '../../context/ScenarioContext';
import { useResponse } from '../../context/ResponseContext';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import CascadeFlow from '../../components/visualization/CascadeFlow';
import {
  Sparkles,
  Cpu,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  ShieldCheck,
  Building2,
  Zap,
  Navigation,
  FileCheck,
  Activity,
  Layers,
  ShieldAlert,
  ArrowRight,
  HardDrive
} from 'lucide-react';

export default function AiCommandCenterPage() {
  const { scenario, activeSim } = useScenario();
  const { generateNewPlan } = useResponse();

  const [pipelineState, setPipelineState] = useState('idle'); // 'idle' | 'analyzing' | 'result'
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [loadingStatusMessage, setLoadingStatusMessage] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [syncSuccessNotice, setSyncSuccessNotice] = useState(false);

  const loadingStages = [
    "Analyzing atmospheric barometry & storm conditions...",
    "Evaluating multi-sector infrastructure exposure...",
    "Tracing systemic multi-point impact cascade...",
    "Synthesizing ranked tactical response directives..."
  ];

  /**
   * Client-side deterministic emergency fallback generator.
   * Ensures that even if network communication fails, the UI ALWAYS produces a complete, structured analysis.
   */
  const generateClientFallback = () => {
    const wind = activeSim?.windSpeed || 145;
    const rain = activeSim?.rainfall || 420;
    const surge = activeSim?.stormSurge || 3.2;
    const infra = activeSim?.infrastructureVulnerability || 65;

    const windScore = Math.min(100, Math.round((wind / 220) * 100));
    const rainScore = Math.min(100, Math.round((rain / 600) * 100));
    const surgeScore = Math.min(100, Math.round((surge / 5.5) * 100));
    const infraScore = Math.min(100, Math.round(infra));

    const overallRisk = Math.round(windScore * 0.30 + rainScore * 0.25 + surgeScore * 0.30 + infraScore * 0.15);

    return {
      summary: `${scenario?.name || "Cyclone Varuna"} maintains dangerous Category ${scenario?.category || 3} intensity with ${wind} km/h sustained gusts. Coincident ${surge}m storm surge threatens marine infrastructure and low-elevation coastal access corridors. Over ${rain}mm rainfall will trigger multi-point urban flash flooding across Zone 04 and Zone 02.`,
      confidence: 94,
      provider: "rule-engine",
      fallbackUsed: true,
      providerMessage: "AI providers unavailable. Displaying deterministic scenario analysis.",
      source: "Deterministic Vulnerability Reasoning Engine (Local Active)",
      priorityZones: [
        {
          code: "Zone 04",
          name: "Southern Delta & Lowland Settlement",
          risk: "CRITICAL (91/100)",
          riskScore: 91,
          severity: "CRITICAL",
          headline: `Below-sea-level elevation facing ${surge}m surge wave and single-point arterial bottleneck (Route R14).`,
          recommendedImmediateAction: "Enforce mandatory evacuation of 96,000 residents before high-tide surge peak."
        },
        {
          code: "Zone 02",
          name: "Harbor & Industrial Maritime Belt",
          risk: "CRITICAL (86/100)",
          riskScore: 86,
          severity: "CRITICAL",
          headline: "Industrial maritime basin with 220kV Substation 07, container cranes, and hazardous chemical storage terminals.",
          recommendedImmediateAction: "Deploy mobile flood cofferdams around 220kV yard and activate remote grid bypass."
        },
        {
          code: "Zone 03",
          name: "Metropolitan Central Core",
          risk: "HIGH (76/100)",
          riskScore: 76,
          severity: "HIGH",
          headline: "High-density metropolitan core; elevated structural wind exposure and urban drainage pump station saturation.",
          recommendedImmediateAction: "Restrict highway E02 to emergency traffic; prepare Apex Regional Trauma overflow wing."
        }
      ],
      infrastructureRisks: [
        {
          asset: "Coastal Transmission Substation 07",
          type: "Power",
          category: "Power",
          exposure: 92,
          risk: "CRITICAL",
          reason: "220kV switchyard proximity to shoreline risks catastrophic shorting and regional blackout.",
          consequence: "Loss of primary grid power for 180,000 residents and coastal intensive care dialysis units.",
          recommendation: "Deploy high-capacity mobile dewatering pumps and enable automated grid sectionalizing."
        },
        {
          asset: "Highway Corridor R14",
          type: "Road",
          category: "Road",
          exposure: 95,
          risk: "CRITICAL",
          reason: "Low elevation causeway subject to 50-80cm water wash; sole delta evacuation route.",
          consequence: "Severing of sole ground evacuation route for southern delta settlement.",
          recommendation: "Establish high-clearance military shuttle fleet and contraflow traffic control immediately."
        },
        {
          asset: "Coastal Medical Center",
          type: "Hospital",
          category: "Hospital",
          exposure: 82,
          risk: "HIGH",
          reason: "Basement diesel generator flooding risking emergency room and ICU life-support continuity.",
          consequence: "Basement diesel generator flooding risking ICU life-support continuity.",
          recommendation: "Sandbag fuel storage vaults, elevate mobile generator units, and prepare triage airlift to Apex Trauma Hub."
        },
        {
          asset: "Delta Technical Shelter S08",
          type: "Shelter",
          category: "Shelter",
          exposure: 86,
          risk: "HIGH",
          reason: "Proximity to canal confluence risks perimeter isolation for 850 evacuees.",
          consequence: "Secondary flooding of shelter perimeter; urgent transfer needed to Centennial Arena S12.",
          recommendation: "Initiate rapid transfer of vulnerable occupants to elevated Centennial Arena Mega-Shelter S12."
        }
      ],
      cascade: [
        {
          step: 1,
          title: "Cyclone intensifies over coastal waters",
          impact: `Wind shear reaches sustained ${wind} km/h; barometric drop to 964 hPa drives astronomical tidal buildup.`,
          severity: "CRITICAL"
        },
        {
          step: 2,
          title: `Storm surge water levels rise to ${surge}m`,
          impact: "Coastal sea wall defenses overtopped; saltwater enters estuarine canal network.",
          severity: "CRITICAL"
        },
        {
          step: 3,
          title: "Low-lying roads & Route R14 flood",
          impact: `Runoff from ${rain}mm rainfall creates 50-80cm standing water across primary evacuation causeways.`,
          severity: "CRITICAL"
        },
        {
          step: 4,
          title: "Emergency transport and logistics slow",
          impact: "Standard civilian ambulances and fuel resupply trucks cannot navigate inundated access corridors.",
          severity: "HIGH"
        },
        {
          step: 5,
          title: "Hospital access & Substation 07 pressure rises",
          impact: "Coastal Medical Center isolated; 220kV transmission hub faces basement switchgear water ingress.",
          severity: "CRITICAL"
        },
        {
          step: 6,
          title: "Emergency response capacity reaches threshold",
          impact: "First responder response times double unless amphibious assets and elevated triage hubs are operational.",
          severity: "CRITICAL"
        }
      ],
      actions: [
        {
          priority: "P1",
          rank: 1,
          action: "Execute Urgent Evacuation Transfer for Zone 04 & Shelter S08",
          reason: "Surge overtopping probability exceeds 92%; Route R14 will become impassable within 90 minutes.",
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
          reason: "Centennial Arena has 2,260 available berths ready to absorb delta evacuees.",
          target: "Zone 05 Foothills Safe Hub"
        },
        {
          priority: "P3",
          rank: 5,
          action: "Broadcast Multilingual Satellite Emergency Bulletins via Mesh Radios",
          reason: "Ensure warnings reach disconnected coastal communities before cellular towers lose power.",
          target: "Coastal Maritime Belt"
        }
      ]
    };
  };

  const handleRunAiAnalysis = async () => {
    setPipelineState('analyzing');
    setLoadingStepIndex(0);
    setLoadingStatusMessage('');

    // Cycle through visual loading stages
    const stageInterval = setInterval(() => {
      setLoadingStepIndex(prev => {
        const next = (prev + 1) % loadingStages.length;
        if (next === 2) {
          setLoadingStatusMessage('Validating multi-model reasoning and failover integrity...');
        }
        return next;
      });
    }, 750);

    try {
      const apiBase = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiBase}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storm: scenario,
          parameters: activeSim
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();

      if (data && data.success && data.analysis && data.analysis.summary) {
        setAnalysisResult(data.analysis);
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      console.warn("[AI Command] Backend fetch or provider failover completed with local fallback:", err.message);
      const fallbackData = generateClientFallback();
      setAnalysisResult(fallbackData);
    } finally {
      clearInterval(stageInterval);
      setPipelineState('result');
    }
  };

  const handleApplyToResponsePlan = () => {
    if (analysisResult?.actions && analysisResult.actions.length > 0) {
      generateNewPlan(analysisResult.actions);
      setSyncSuccessNotice(true);
      setTimeout(() => setSyncSuccessNotice(false), 4500);
    }
  };

  const renderSourceBadge = () => {
    const provider = analysisResult?.provider;

    if (provider === 'gemini-1') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(0, 240, 255, 0.08)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--accent-cyan)',
            letterSpacing: '0.04em'
          }}>
            AI ANALYSIS <span style={{ color: 'var(--color-success)', fontSize: '9px' }}>●</span> GEMINI 1
          </span>
          <span style={{ fontSize: '11px', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-success)' }} />
            AI ONLINE
          </span>
        </div>
      );
    }

    if (provider === 'gemini-2') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            fontSize: '11px',
            fontWeight: 700,
            color: '#818CF8',
            letterSpacing: '0.04em'
          }}>
            AI ANALYSIS <span style={{ color: 'var(--accent-cyan)', fontSize: '9px' }}>●</span> GEMINI 2
          </span>
          <span style={{ fontSize: '11px', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-success)' }} />
            AI ONLINE (FAILOVER #2)
          </span>
        </div>
      );
    }

    if (provider === 'gemini-3') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            fontSize: '11px',
            fontWeight: 700,
            color: '#818CF8',
            letterSpacing: '0.04em'
          }}>
            AI ANALYSIS <span style={{ color: 'var(--accent-cyan)', fontSize: '9px' }}>●</span> GEMINI 3
          </span>
          <span style={{ fontSize: '11px', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-success)' }} />
            AI ONLINE (FAILOVER #3)
          </span>
        </div>
      );
    }

    // Deterministic Rule Engine Fallback
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          fontSize: '11px',
          fontWeight: 700,
          color: 'var(--color-warning)',
          letterSpacing: '0.04em'
        }}>
          RULE-BASED ANALYSIS <span style={{ fontSize: '9px' }}>●</span> AI FALLBACK
        </span>
        <span style={{
          fontSize: '11px',
          color: 'var(--color-warning)',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          fontWeight: 600
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-warning)' }} />
          FALLBACK MODE
        </span>
        <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
          Decision support available via deterministic engine.
        </span>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <PageHeader
        title="AI Command Center & Decision Support"
        subtitle="Multi-API failover intelligence pipeline with explainable deterministic fallback"
        badge={
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Badge severity="info">Disaster Intelligence</Badge>
            <Badge severity="neutral">MULTI-API FAILOVER</Badge>
          </div>
        }
        breadcrumbs={['Command Hub', 'AI Command']}
      />

      {/* Sync Success Banner */}
      {syncSuccessNotice && (
        <div style={{
          padding: '12px 18px',
          background: 'var(--color-success-bg)',
          border: '1px solid var(--color-success-border)',
          borderRadius: 'var(--radius-md)',
          fontSize: '13px',
          color: 'var(--color-success)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          animation: 'fadeIn 200ms ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={16} />
            <span>AI prioritized directives successfully transferred to Incident Response Planner!</span>
          </div>
          <a href="/app/response" style={{ color: 'var(--text-primary)', fontWeight: 600, textDecoration: 'underline' }}>
            Open Planner →
          </a>
        </div>
      )}

      {/* Control & Capabilities Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        padding: '20px 24px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(99,102,241,0.2))',
            border: '1px solid var(--border-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-cyan)'
          }}>
            <Sparkles size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="font-display font-bold" style={{ fontSize: '16px', color: 'var(--text-primary)' }}>
                Gemini Multi-API Failover Pipeline
              </span>
              <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-success)', background: 'var(--color-success-bg)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
                READY
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Resilient Sequence: Gemini 1 → Gemini 2 → Gemini 3 → Explainable Vulnerability Engine
            </div>
          </div>
        </div>

        <Button
          variant="primary"
          icon={Sparkles}
          isLoading={pipelineState === 'analyzing'}
          loadingText="Synthesizing Intelligence..."
          onClick={handleRunAiAnalysis}
        >
          {pipelineState === 'result' ? 'Re-Run AI Analysis' : 'Run AI Analysis'}
        </Button>
      </div>

      {/* ============================================================
          1. IDLE STATE: Pre-Analysis Briefing
          ============================================================ */}
      {pipelineState === 'idle' && (
        <div className="surface-card" style={{ padding: '36px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(0, 240, 255, 0.08)',
            border: '1px solid var(--border-cyan-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-cyan)'
          }}>
            <Cpu size={28} />
          </div>

          <div style={{ maxWidth: '600px' }}>
            <h2 className="font-display font-bold" style={{ fontSize: '20px', color: 'var(--text-primary)' }}>
              Disaster Decision Support Engine Ready
            </h2>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '8px' }}>
              Click <strong>"Run AI Analysis"</strong> to generate real-time multi-hazard threat evaluations, evaluate systemic failure cascades across coastal infrastructure, and synthesize prioritized tactical directives.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px',
            width: '100%',
            maxWidth: '720px',
            marginTop: '8px'
          }}>
            <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', textAlign: 'left' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Target System</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>{scenario.name} (Cat {scenario.category})</div>
            </div>
            <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', textAlign: 'left' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Sustained Wind</div>
              <div className="font-mono text-cyan font-bold" style={{ fontSize: '13px', marginTop: '2px' }}>{activeSim.windSpeed} km/h</div>
            </div>
            <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', textAlign: 'left' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Storm Surge</div>
              <div className="font-mono text-cyan font-bold" style={{ fontSize: '13px', marginTop: '2px' }}>{activeSim.stormSurge} m</div>
            </div>
            <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', textAlign: 'left' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Failover Guarantee</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-success)', marginTop: '2px' }}>100% Resilient</div>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            icon={Sparkles}
            onClick={handleRunAiAnalysis}
            style={{ marginTop: '8px' }}
          >
            Initiate AI Multi-Hazard Analysis
          </Button>
        </div>
      )}

      {/* ============================================================
          2. ANALYZING STATE: 4-Stage Resilient Loader
          ============================================================ */}
      {pipelineState === 'analyzing' && (
        <div className="surface-card" style={{ padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            border: '3px solid rgba(0, 240, 255, 0.15)',
            borderTopColor: 'var(--accent-cyan)',
            animation: 'spin 1s linear infinite'
          }} />

          <div>
            <h3 className="font-display font-semibold text-cyan" style={{ fontSize: '17px' }}>
              Multi-API Intelligence Pipeline Active
            </h3>
            <p className="font-mono" style={{ fontSize: '13.5px', color: 'var(--text-primary)', marginTop: '8px' }}>
              {loadingStages[loadingStepIndex]}
            </p>
            {loadingStatusMessage && (
              <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '6px' }}>
                {loadingStatusMessage}
              </p>
            )}
          </div>

          {/* 4-Stage Progress Pills */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {loadingStages.map((_, i) => (
              <div
                key={i}
                style={{
                  width: '40px',
                  height: '4px',
                  borderRadius: '2px',
                  background: i <= loadingStepIndex ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.08)',
                  transition: 'background var(--transition-normal)'
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ============================================================
          3. RESULT STATE: Guaranteed Visible Structured Analysis
          ============================================================ */}
      {pipelineState === 'result' && analysisResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Executive Summary Card */}
          <div className="surface-card" style={{
            padding: '24px',
            borderLeft: '4px solid var(--accent-cyan)',
            background: 'radial-gradient(ellipse at top left, rgba(0, 240, 255, 0.04), transparent 70%), var(--bg-card)'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span className="font-display font-bold" style={{ fontSize: '16px', color: 'var(--text-primary)' }}>
                  AI Executive Threat Summary
                </span>
                {renderSourceBadge()}
              </div>

              {/* Confidence Display */}
              <div>
                {analysisResult.fallbackUsed ? (
                  <span className="font-mono text-cyan" style={{ fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.04em' }}>
                    RULE COVERAGE: HIGH ({analysisResult.confidence || 94}%)
                  </span>
                ) : (
                  <span className="font-mono text-cyan" style={{ fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.04em' }}>
                    AI CONFIDENCE: {analysisResult.confidence || 92}%
                  </span>
                )}
              </div>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.65 }}>
              {analysisResult.summary}
            </p>

            <div style={{
              marginTop: '16px',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.02)',
              fontSize: '11px',
              color: 'var(--text-dim)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <ShieldCheck size={14} color="var(--accent-cyan)" />
              <span>DISCLAIMER: AI decision support simulation only. Not an official authoritative emergency broadcast.</span>
            </div>
          </div>

          {/* Impact Cascade Chain */}
          <div className="surface-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div>
                <h2 className="font-display font-bold" style={{ fontSize: '18px', color: 'var(--text-primary)' }}>
                  Systemic Impact Cascade
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Chain of secondary failures from initial meteorological intensity to emergency response capacity limits
                </p>
              </div>
              <Badge severity="critical" pulse>6-Stage Failure Model</Badge>
            </div>

            <CascadeFlow steps={analysisResult.cascade || []} />
          </div>

          {/* Priority Containment Zones & Infrastructure Threats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {/* Priority Zones */}
            <div className="surface-card" style={{ padding: '24px' }}>
              <h2 className="font-display font-semibold" style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '16px' }}>
                Priority Containment Zones
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {analysisResult.priorityZones?.map((pz, idx) => (
                  <div key={idx} style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="font-mono text-cyan font-bold" style={{ fontSize: '13px' }}>
                        {pz.code || pz.name}
                      </span>
                      <Badge severity={pz.risk?.includes('CRITICAL') || pz.severity === 'CRITICAL' ? 'critical' : 'warning'}>
                        {pz.risk}
                      </Badge>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500 }}>
                      {pz.headline}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', background: 'rgba(0, 240, 255, 0.03)', padding: '6px 8px', borderRadius: 'var(--radius-xs)' }}>
                      <strong style={{ color: 'var(--accent-cyan)' }}>Immediate Action:</strong> {pz.recommendedImmediateAction}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Infrastructure Risks across Categories */}
            <div className="surface-card" style={{ padding: '24px' }}>
              <h2 className="font-display font-semibold" style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '16px' }}>
                Primary Infrastructure Threat Nodes
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {analysisResult.infrastructureRisks?.map((ir, idx) => (
                  <div key={idx} style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {ir.asset}
                      </span>
                      <Badge severity={ir.exposure >= 85 ? 'critical' : 'warning'}>
                        {ir.exposure}% Exposure
                      </Badge>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                      <span style={{
                        padding: '1px 6px',
                        borderRadius: 'var(--radius-xs)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--accent-cyan)',
                        fontWeight: 600
                      }}>
                        {ir.type || ir.category}
                      </span>
                      <span style={{ color: 'var(--text-dim)' }}>
                        Risk: {ir.risk || (ir.exposure >= 85 ? 'CRITICAL' : 'HIGH')}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {ir.consequence || ir.reason}
                    </div>
                    {ir.recommendation && (
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        <strong>Directives:</strong> {ir.recommendation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Recommended Response Actions Bar */}
          <div className="surface-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div>
                <h2 className="font-display font-semibold" style={{ fontSize: '16px', color: 'var(--text-primary)' }}>
                  Synthesized Tactical Actions
                </h2>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Ranked emergency response interventions ready to transfer into the Response Planner
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                icon={FileCheck}
                onClick={handleApplyToResponsePlan}
              >
                Sync with Response Planner
              </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {analysisResult.actions?.map((act, idx) => (
                <div key={idx} style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '14px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="font-mono font-bold text-cyan" style={{ fontSize: '13px' }}>
                      0{act.rank || idx + 1}
                    </span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {act.action}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Target: <span style={{ color: 'var(--text-secondary)' }}>{act.target}</span> • {act.reason}
                      </div>
                    </div>
                  </div>
                  <Badge severity={act.priority === 'P1' ? 'critical' : 'warning'}>
                    {act.priority || 'P1'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
