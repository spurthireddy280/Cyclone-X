import React, { useState, useEffect, useRef } from 'react';
import { useScenario } from '../../context/ScenarioContext';
import { useResponse } from '../../context/ResponseContext';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import {
  FileText,
  Printer,
  Plus,
  Eye,
  Calendar,
  ShieldAlert,
  Download,
  CheckCircle2,
  FileCheck2,
  Trash2
} from 'lucide-react';

export default function IncidentReportsPage() {
  const { scenario, baselineRisk, activeSimRisk, activeSim } = useScenario();
  const { tasks } = useResponse();

  const [reports, setReports] = useState(() => {
    try {
      const saved = localStorage.getItem('cyclonex_reports');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }

    return [
      {
        id: "rep-001",
        title: "Pre-Landfall Multi-Hazard Assessment — Cyclone Varuna",
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        scenarioName: "Cyclone Varuna (Cat 3)",
        riskScore: 61,
        severity: "HIGH",
        windSpeed: 145,
        rainfall: 420,
        stormSurge: 3.2,
        priorityZones: ["Zone 04 (Delta Settlement)", "Zone 02 (Maritime Industrial)", "Zone 03 (Metropolitan Central)"],
        summary: "Cyclone Varuna maintaining sustained Category 3 gale velocity. Primary failure thresholds concentrated along the southern coastal delta, where astronomical tide will overtop earthen levees by +0.4m. Urgent protective action required for Route R14.",
        recommendedActions: [
          "Enforce mandatory evacuation of Zone 04 before surge peak at 04:00",
          "Deploy Tiger Dam cofferdams around 220kV Substation 07",
          "Stage amphibious extraction units along elevated Expressway E02"
        ]
      }
    ];
  });

  const [activeReport, setActiveReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const reportBodyRef = useRef(null);

  // Force scroll position to top whenever a report opens or changes
  useEffect(() => {
    if (activeReport && reportBodyRef.current) {
      reportBodyRef.current.scrollTo({
        top: 0,
        behavior: "instant"
      });
      reportBodyRef.current.scrollTop = 0;
    }
  }, [activeReport]);

  useEffect(() => {
    try {
      localStorage.setItem('cyclonex_reports', JSON.stringify(reports));
    } catch (e) {
      console.error(e);
    }
  }, [reports]);

  const handleGenerateReport = async () => {
    setIsGenerating(true);

    try {
      const apiBase = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiBase}/api/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioName: `${scenario.name} Tactical Impact Briefing`,
          stormParameters: {
            wind: `${activeSim.windSpeed} km/h`,
            rainfall: `${activeSim.rainfall} mm`,
            surge: `${activeSim.stormSurge} m`
          },
          riskScore: activeSimRisk.score,
          severity: activeSimRisk.severity,
          priorityZones: scenario.zones.slice(0, 3).map(z => `${z.code} (${z.name})`),
          aiSummary: `Comprehensive tactical assessment generated for ${scenario.name}. Risk Index currently evaluated at ${activeSimRisk.score}/100 (${activeSimRisk.severity}). Multi-point failure expected if surge overtopping exceeds 3.5m.`,
          actions: tasks.slice(0, 4).map(t => t.title),
          analysisSource: "Multi-API AI & Deterministic Engine"
        })
      });

      const data = await response.json();
      if (data && data.success && data.report) {
        setReports(prev => [data.report, ...prev]);
        setActiveReport(data.report);
      }
    } catch (err) {
      console.warn("Backend report generation failed, creating locally:", err);
      const localReport = {
        id: `rep-${Date.now().toString().slice(-4)}`,
        title: `${scenario.name} Comprehensive Operational Assessment`,
        timestamp: new Date().toISOString(),
        scenarioName: scenario.name,
        riskScore: activeSimRisk.score,
        severity: activeSimRisk.severity,
        windSpeed: activeSim.windSpeed,
        rainfall: activeSim.rainfall,
        stormSurge: activeSim.stormSurge,
        priorityZones: ["Zone 04 (Southern Delta)", "Zone 02 (Industrial Harbor)", "Zone 03 (Metropolitan)"],
        summary: `Deterministic impact briefing for ${scenario.name}. Sustained atmospheric wind of ${activeSim.windSpeed} km/h paired with ${activeSim.stormSurge}m surge wave. Tactical teams instructed to prioritize critical utility reinforcement and evacuation of coastal lowlands.`,
        recommendedActions: tasks.slice(0, 4).map(t => t.title),
        analysisSource: "Deterministic Rule Engine (Local Active)"
      };
      setReports(prev => [localReport, ...prev]);
      setActiveReport(localReport);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDeleteReport = (id, e) => {
    e.stopPropagation();
    setReports(prev => prev.filter(r => r.id !== id));
    if (activeReport?.id === id) setActiveReport(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <PageHeader
        title="Incident Reports & Tactical Briefings"
        subtitle="Formal situation reports, hazard dossiers, and multi-agency briefings ready for PDF export and distribution"
        breadcrumbs={['Command Hub', 'Incident Reports']}
        actions={
          <Button
            variant="primary"
            icon={Plus}
            isLoading={isGenerating}
            loadingText="Generating Briefing..."
            onClick={handleGenerateReport}
          >
            Generate New Report
          </Button>
        }
      />

      {/* Reports Feed */}
      {reports.length === 0 ? (
        <div className="surface-card" style={{ padding: '64px', textAlign: 'center' }}>
          <FileText size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <h3 className="font-display font-semibold" style={{ fontSize: '18px', color: 'var(--text-primary)' }}>
            No active incident reports yet
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px', maxWidth: '420px', margin: '6px auto 20px' }}>
            Generate a formal situation report to capture current storm parameters, zone exposures, and AI tactical priorities.
          </p>
          <Button
            variant="primary"
            icon={Plus}
            onClick={handleGenerateReport}
          >
            Generate First Report
          </Button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
          {reports.map((report) => (
            <div
              key={report.id}
              className="surface-card interactive cursor-pointer"
              onClick={() => setActiveReport(report)}
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span className="font-mono text-cyan" style={{ fontSize: '11px', fontWeight: 600 }}>
                    {report.id.toUpperCase()}
                  </span>
                  <Badge severity={report.severity}>
                    Risk {report.riskScore}/100
                  </Badge>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                  {report.title || report.scenarioName}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', fontSize: '11px', color: 'var(--text-dim)', marginTop: '6px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={12} />
                    <span>{new Date(report.timestamp).toLocaleString()}</span>
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--accent-cyan)', background: 'rgba(0, 240, 255, 0.06)', padding: '2px 7px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-cyan-subtle)' }}>
                    {report.analysisSource || "Deterministic Rule Engine"}
                  </span>
                </div>

                <p style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  marginTop: '12px',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {report.summary}
                </p>
              </div>

              <div style={{
                paddingTop: '14px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '12px', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Eye size={14} />
                  <span>View Full Report</span>
                </span>

                <button
                  onClick={(e) => handleDeleteReport(report.id, e)}
                  style={{ color: 'var(--text-dim)', padding: '4px', cursor: 'pointer' }}
                  title="Delete Report"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View & Print Report Modal */}
      <Modal
        isOpen={!!activeReport}
        onClose={() => setActiveReport(null)}
        title={activeReport?.title || activeReport?.scenarioName || "Situation Report"}
        subtitle={`Generated: ${activeReport ? new Date(activeReport.timestamp).toLocaleString() : ''}`}
        maxWidth="min(900px, calc(100vw - 48px))"
        reportBodyRef={reportBodyRef}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', width: '100%' }}>
            <Button
              variant="secondary"
              onClick={() => setActiveReport(null)}
            >
              Close
            </Button>
            <Button
              variant="primary"
              icon={Printer}
              onClick={handlePrint}
            >
              Print / Save as PDF
            </Button>
          </div>
        }
      >
        {activeReport && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Print Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Document ID</div>
                <div className="font-mono font-bold text-cyan" style={{ fontSize: '14px' }}>{activeReport.id}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Classification</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>TACTICAL UNCLASSIFIED</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Analysis Source</div>
                <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                  {activeReport.analysisSource || "Deterministic Rule Engine"}
                </div>
              </div>
              <Badge severity={activeReport.severity}>
                Risk {activeReport.riskScore} ({activeReport.severity})
              </Badge>
            </div>

            {/* Storm Parameters */}
            <div className="surface-card" style={{ padding: '16px' }}>
              <span className="font-display font-semibold" style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                Storm Parameters at Generation
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '10px', textAlign: 'center' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Wind Velocity</div>
                  <div className="font-mono font-bold text-cyan" style={{ fontSize: '14px', marginTop: '2px' }}>
                    {activeReport.windSpeed || activeReport.stormParameters?.wind || "145 km/h"}
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Precipitation</div>
                  <div className="font-mono font-bold text-cyan" style={{ fontSize: '14px', marginTop: '2px' }}>
                    {activeReport.rainfall || activeReport.stormParameters?.rainfall || "420 mm"}
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Storm Surge</div>
                  <div className="font-mono font-bold text-cyan" style={{ fontSize: '14px', marginTop: '2px' }}>
                    {activeReport.stormSurge || activeReport.stormParameters?.surge || "3.2 m"}
                  </div>
                </div>
              </div>
            </div>

            {/* Executive Summary */}
            <div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Executive Assessment
              </span>
              <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.6, marginTop: '6px' }}>
                {activeReport.summary}
              </p>
            </div>

            {/* Priority Zones */}
            {activeReport.priorityZones && (
              <div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Critical Priority Corridors
                </span>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px', listStyle: 'none' }}>
                  {activeReport.priorityZones.map((pz, idx) => (
                    <li key={idx} style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-critical)' }} />
                      <span>{pz}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommended Actions */}
            {activeReport.recommendedActions && (
              <div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Operational Directives
                </span>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px', listStyle: 'none' }}>
                  {activeReport.recommendedActions.map((act, idx) => (
                    <li key={idx} style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={13} color="var(--color-success)" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Print Disclaimer */}
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
              CYCLONE X PLATFORM • Simulated Emergency Decision Support Artifact • Official distribution only.
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
