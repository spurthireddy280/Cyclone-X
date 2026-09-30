import React, { useEffect, useRef } from 'react';

export default function CycloneRadarCanvas({
  width = 440,
  height = 440,
  windSpeed = 145,
  stormName = "Cyclone Varuna"
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let sweepAngle = 0;
    const particles = [];
    const numParticles = 65;

    // Initialize spiral storm particles
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        distance: Math.random() * (width / 2 - 25) + 15,
        angle: Math.random() * Math.PI * 2,
        speed: (Math.random() * 0.015 + 0.008) * (windSpeed / 130),
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.7 + 0.3
      });
    }

    const render = () => {
      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(centerX, centerY) - 20;

      // Clear
      ctx.clearRect(0, 0, width, height);

      // Radar background glow
      const bgGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, maxRadius);
      bgGrad.addColorStop(0, 'rgba(0, 240, 255, 0.08)');
      bgGrad.addColorStop(0.5, 'rgba(14, 165, 233, 0.03)');
      bgGrad.addColorStop(1, 'rgba(6, 8, 13, 0.85)');
      ctx.fillStyle = bgGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
      ctx.fill();

      // Range rings
      const rings = [0.25, 0.5, 0.75, 1.0];
      rings.forEach((ratio, idx) => {
        const r = maxRadius * ratio;
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle = idx === 3 ? 'rgba(0, 240, 255, 0.35)' : 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Ring distance labels
        ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillText(`${Math.round(ratio * 200)}km`, centerX + 4, centerY - r + 12);
      });

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(centerX - maxRadius, centerY);
      ctx.lineTo(centerX + maxRadius, centerY);
      ctx.moveTo(centerX, centerY - maxRadius);
      ctx.lineTo(centerX, centerY + maxRadius);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.stroke();

      // Spiral arms (convective cyclone banding)
      const numArms = 3;
      for (let arm = 0; arm < numArms; arm++) {
        const armOffset = (arm * (Math.PI * 2)) / numArms;
        ctx.beginPath();
        for (let r = 18; r < maxRadius; r += 4) {
          const spiralAngle = sweepAngle * 0.4 + armOffset + (r / maxRadius) * 2.8;
          const x = centerX + Math.cos(spiralAngle) * r;
          const y = centerY + Math.sin(spiralAngle) * r;
          if (r === 18) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
        ctx.lineWidth = 4;
        ctx.stroke();
      }

      // Swirling rain particles
      particles.forEach(p => {
        p.angle += p.speed;
        const x = centerX + Math.cos(p.angle) * p.distance;
        const y = centerY + Math.sin(p.angle) * p.distance;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${p.opacity})`;
        ctx.fill();
      });

      // Radar Sweep line & trail
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, maxRadius, sweepAngle - 0.4, sweepAngle);
      ctx.lineTo(centerX, centerY);
      const sweepGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
      sweepGrad.addColorStop(0, 'rgba(0, 240, 255, 0.25)');
      sweepGrad.addColorStop(1, 'rgba(0, 240, 255, 0.02)');
      ctx.fillStyle = sweepGrad;
      ctx.fill();

      // Main sweep line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + Math.cos(sweepAngle) * maxRadius, centerY + Math.sin(sweepAngle) * maxRadius);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Storm Eye
      ctx.beginPath();
      ctx.arc(centerX, centerY, 9, 0, Math.PI * 2);
      ctx.fillStyle = '#06080D';
      ctx.fill();
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Pulsing eye ring
      const pulseSize = 12 + Math.sin(sweepAngle * 4) * 4;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();

      sweepAngle += 0.025;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [width, height, windSpeed]);

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: width, aspectRatio: '1 / 1', margin: '0 auto' }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          borderRadius: '50%',
          border: '1px solid rgba(0, 240, 255, 0.25)',
          boxShadow: '0 0 20px rgba(0, 240, 255, 0.12)',
          background: 'rgba(6, 8, 13, 0.95)'
        }}
      />
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '11px',
        color: 'var(--text-secondary)',
        background: 'rgba(6, 8, 13, 0.85)',
        padding: '3px 10px',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--border-subtle)',
        whiteSpace: 'nowrap'
      }}>
        <span className="font-mono text-cyan">RADAR DOPPLER</span> • {stormName}
      </div>
    </div>
  );
}
