import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CycloneRadarCanvas from '../../components/visualization/CycloneRadarCanvas';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import {
  Shield,
  ArrowRight,
  Sparkles,
  Activity,
  Layers,
  Sliders,
  CheckCircle2,
  Building2,
  Zap,
  Waves,
  Navigation,
  Globe,
  Radio,
  FileText
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const revealRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.15 }
    );

    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <nav className="landing-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: 'var(--radius-sm)',
            background: 'linear-gradient(135deg, #00F0FF, #0077FF)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#06080D',
            boxShadow: '0 0 16px rgba(0, 240, 255, 0.4)'
          }}>
            <Shield size={20} strokeWidth={2.5} />
          </div>
          <div>
            <span className="font-display font-bold" style={{ fontSize: '17px', letterSpacing: '0.04em' }}>
              CYCLONE <span className="text-cyan">X</span>
            </span>
            <span style={{ fontSize: '9px', color: 'var(--text-dim)', display: 'block', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Disaster Intelligence Platform
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/login" className="btn btn-ghost btn-sm">
            Sign In
          </Link>
          <Link to="/app" className="btn btn-primary btn-sm">
            Enter Command Center
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-section" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
        alignItems: 'center',
        gap: '40px'
      }}>
        {/* Left Column: Heading & Value Proposition */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 12px', borderRadius: 'var(--radius-full)', background: 'rgba(0, 240, 255, 0.08)', border: '1px solid rgba(0, 240, 255, 0.25)', width: 'fit-content' }}>
            <span className="pulse-dot" style={{ color: 'var(--accent-cyan)' }} />
            <span className="font-mono text-cyan" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em' }}>
              NEXT-GEN DISASTER INTELLIGENCE & CASCADE REASONING
            </span>
          </div>

          <h1 className="font-display font-bold" style={{ fontSize: 'clamp(32px, 5vw, 48px)', lineHeight: 1.1, letterSpacing: '-0.03em' }}>
            Understand the storm.<br />
            <span className="text-cyan">Predict the impact.</span><br />
            Act before it escalates.
          </h1>

          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '540px' }}>
            Don't just predict the cyclone. Predict what the cyclone will disrupt, how secondary failures cascade across power grids, hospitals, and access causeways, and what first responders must prioritize next.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px', paddingTop: '8px' }}>
            <Button
              variant="primary"
              size="lg"
              iconRight={ArrowRight}
              onClick={() => navigate('/app')}
            >
              Enter Command Center
            </Button>
            <Button
              variant="secondary"
              size="lg"
              icon={Sliders}
              onClick={() => navigate('/app/simulator')}
            >
              Explore the Simulation
            </Button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', fontSize: '12px', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} color="var(--accent-cyan)" />
              <span>Deterministic Explainability</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} color="var(--accent-cyan)" />
              <span>Multi-Point Cascade Analysis</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} color="var(--accent-cyan)" />
              <span>Interactive Simulator</span>
            </div>
          </div>
        </div>

        {/* Right Column: Abstract Cyclone Visualization */}
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <div style={{
            position: 'absolute',
            inset: -20,
            background: 'radial-gradient(circle, rgba(0, 240, 255, 0.12), transparent 70%)',
            filter: 'blur(30px)',
            zIndex: 0
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <CycloneRadarCanvas width={420} height={420} windSpeed={145} stormName="Cyclone Varuna" />
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '36px 40px'
      }}>
        <div style={{
          maxWidth: '1360px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
          textAlign: 'center'
        }}>
          <div>
            <div className="font-display font-bold text-cyan" style={{ fontSize: '36px' }}>
              8.4h
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Forecast Landfall Horizon
            </div>
          </div>
          <div>
            <div className="font-display font-bold text-cyan" style={{ fontSize: '36px' }}>
              96,000+
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Citizens in Critical Surge Delta
            </div>
          </div>
          <div>
            <div className="font-display font-bold text-cyan" style={{ fontSize: '36px' }}>
              6 Stages
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Multi-Point Cascade Failure Depth
            </div>
          </div>
          <div>
            <div className="font-display font-bold text-cyan" style={{ fontSize: '36px' }}>
              100%
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Explainable Deterministic Formulas
            </div>
          </div>
        </div>
      </section>

      {/* Problem -> Intelligence -> Action: Three Pillars */}
      <section style={{ padding: '100px 40px', maxWidth: '1360px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="font-mono text-cyan" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            OPERATIONAL ARCHITECTURE
          </span>
          <h2 className="font-display font-bold" style={{ fontSize: '34px', color: 'var(--text-primary)', marginTop: '8px' }}>
            From Meteorological Threat to Tactical Action
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '580px', margin: '8px auto 0' }}>
            Traditional weather warnings broadcast wind speeds. Cyclone X transforms atmospheric parameters into infrastructure disruption vectors.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {/* Pillar 01 */}
          <div ref={addToRefs} className="reveal-element surface-card" style={{ padding: '32px', position: 'relative' }}>
            <span className="font-mono text-cyan font-bold" style={{ fontSize: '36px', opacity: 0.35 }}>
              01
            </span>
            <h3 className="font-display font-bold" style={{ fontSize: '20px', color: 'var(--text-primary)', margin: '12px 0 8px' }}>
              See the Threat
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Live Doppler sweep tracking sustained eye wall velocity (145 km/h), barometric central depression (964 hPa), and hydrodynamic surge wave propagation (+3.2m).
            </p>
            <Link to="/app/storm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '20px', fontSize: '12px', color: 'var(--accent-cyan)', fontWeight: 600 }}>
              <span>Explore Storm Monitor</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Pillar 02 */}
          <div ref={addToRefs} className="reveal-element surface-card" style={{ padding: '32px', position: 'relative' }}>
            <span className="font-mono text-cyan font-bold" style={{ fontSize: '36px', opacity: 0.35 }}>
              02
            </span>
            <h3 className="font-display font-bold" style={{ fontSize: '20px', color: 'var(--text-primary)', margin: '12px 0 8px' }}>
              Understand the Impact
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Explainable Vulnerability Engine translates atmospheric stress into 5 tactical zones. Identifies where floodwaters breach seawalls and isolate medical trauma centers.
            </p>
            <Link to="/app/risk" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '20px', fontSize: '12px', color: 'var(--accent-cyan)', fontWeight: 600 }}>
              <span>Inspect Vulnerability Engine</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Pillar 03 */}
          <div ref={addToRefs} className="reveal-element surface-card" style={{ padding: '32px', position: 'relative' }}>
            <span className="font-mono text-cyan font-bold" style={{ fontSize: '36px', opacity: 0.35 }}>
              03
            </span>
            <h3 className="font-display font-bold" style={{ fontSize: '20px', color: 'var(--text-primary)', margin: '12px 0 8px' }}>
              Prioritize the Response
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              AI synthesis formats ranked directives: mandatory evacuation routes, Tiger Dam barrier deployment around Substation 07, and emergency shelter dispatch.
            </p>
            <Link to="/app/response" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '20px', fontSize: '12px', color: 'var(--accent-cyan)', fontWeight: 600 }}>
              <span>Open Response Planner</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* Simulator Preview Banner */}
      <section style={{
        background: 'radial-gradient(ellipse at center, rgba(0, 240, 255, 0.08), transparent 75%), var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '80px 40px'
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px'
        }}>
          <Badge severity="warning">WHAT-IF SIMULATION ENGINE</Badge>
          <h2 className="font-display font-bold" style={{ fontSize: '36px', color: 'var(--text-primary)' }}>
            What happens if the storm intensifies to Category 4?
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '640px', lineHeight: 1.6 }}>
            Adjust wind speed from 145 to 175 km/h or surge from 3.2 to 4.1 meters. Watch how risk escalates by +26 points, exposing 31,000 additional residents and flooding arterial Highway R14.
          </p>
          <Button
            variant="primary"
            size="lg"
            icon={Sliders}
            onClick={() => navigate('/app/simulator')}
          >
            Launch Scenario Simulator
          </Button>
        </div>
      </section>

      {/* Final Call to Action */}
      <section style={{ padding: '100px 40px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <h2 className="font-display font-bold" style={{ fontSize: '38px', color: 'var(--text-primary)' }}>
          Enter Cyclone X Command Center
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', margin: '14px 0 28px', lineHeight: 1.6 }}>
          Pre-loaded with demo credentials and the active Cyclone Varuna simulation. No external setup required.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
          <Button
            variant="primary"
            size="lg"
            iconRight={ArrowRight}
            onClick={() => navigate('/login')}
          >
            Sign In with Demo Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-subtle)',
        padding: '30px 40px',
        background: 'var(--bg-primary)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        fontSize: '12px',
        color: 'var(--text-dim)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="font-display font-bold text-cyan" style={{ fontSize: '14px' }}>
            CYCLONE X
          </span>
          <span>•</span>
          <span>AI-Powered Disaster Intelligence & Response Platform</span>
        </div>

        <div>
          <span>Simulated Decision Support System • Hackathon Edition</span>
        </div>
      </footer>
    </div>
  );
}
