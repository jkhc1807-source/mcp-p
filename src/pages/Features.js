import React, { useState, useEffect, useRef, useCallback } from 'react';
import Layout from './Layout';
import './Features.css';

const Features = () => {
  const [activeCard, setActiveCard] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [vizIntensity, setVizIntensity] = useState(50);
  const [morphIntensity, setMorphIntensity] = useState(50);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-rotation for morphing shape
  useEffect(() => {
    const timer = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // 1. Particle Network Logic (React + Canvas Interaction)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    const currentMouse = { x: 0, y: 0 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.size = Math.random() * 2 + 1;
      }
      update(mX, mY) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        const dx = mX - this.x;
        const dy = mY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          this.x -= dx * 0.02;
          this.y -= dy * 0.02;
        }
      }
      draw() {
        ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < 60; i++) particles.push(new Particle());

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update(currentMouse.x, currentMouse.y);
        p.draw();
      });
      animationFrameId = requestAnimationFrame(render);
    };

    const handleInternalMouseMove = (e) => {
      currentMouse.x = e.clientX;
      currentMouse.y = e.clientY;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleInternalMouseMove);
    resize();
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleInternalMouseMove);
    };
  }, []);

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  const resetStates = () => {
    setVizIntensity(50);
    setMorphIntensity(50);
    setActiveCard(null);
  };

  return (
    <Layout>
      <div className="lab-page-wrapper" ref={containerRef} onMouseMove={handleMouseMove}>
        <canvas ref={canvasRef} className="lab-canvas-bg" />
        
        <header className="lab-hero animate-in">
          <div className="lab-badge">EXPERIMENTAL LAB v2.0</div>
          <h1 className="lab-title">Interactive <span className="gradient-text">Showcase</span></h1>
          <p className="lab-subtitle">프리미엄 프론트엔드 엔진의 실시간 상태 변화와 <br/>감각적인 인터랙션을 직접 경험해 보세요.</p>
        </header>

        {/* New Dedicated Control Bar Area */}
        <section className="lab-control-bar animate-in delay-1">
          <div className="control-item">
            <label>ENGINE SPEED</label>
            <input 
              type="range" 
              min="0" max="100" 
              value={vizIntensity} 
              onChange={(e) => setVizIntensity(parseInt(e.target.value))} 
            />
            <span className="val">{vizIntensity}%</span>
          </div>
          <div className="control-divider"></div>
          <div className="control-item">
            <label>SHAPE FLUIDITY</label>
            <input 
              type="range" 
              min="0" max="100" 
              value={morphIntensity} 
              onChange={(e) => setMorphIntensity(parseInt(e.target.value))} 
            />
            <span className="val">{morphIntensity}%</span>
          </div>
          <button className="btn-lab-reset" onClick={resetStates}>RESET</button>
        </section>

        <div className="lab-bento-grid">
          {/* Card 1: Magnetic Interaction */}
          <section 
            className={`lab-item magnetic-card ${activeCard === 1 ? 'active' : ''}`}
            onClick={() => setActiveCard(activeCard === 1 ? null : 1)}
            onMouseMove={(e) => {
              const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
              const x = (e.clientX - left - width/2) / 15;
              const y = (e.clientY - top - height/2) / 15;
              e.currentTarget.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-5px)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = '';
            }}
          >
            <div className="lab-card-content">
              <div className="card-header-row">
                <span className="icon">🧲</span>
                <h3>Perspective</h3>
              </div>
              <p>마우스 위치에 따라 실시간으로 변하는 <br/>3D 시점 변환 엔진입니다.</p>
              <div className="magnetic-visual">
                <div className="eye" style={{ transform: `translate(${(mousePos.x - 600)/60}px, ${(mousePos.y - 400)/60}px)` }}><div></div></div>
                <div className="eye" style={{ transform: `translate(${(mousePos.x - 600)/60}px, ${(mousePos.y - 400)/60}px)` }}><div></div></div>
              </div>
            </div>
          </section>

          {/* Card 2: Performance Visualizer */}
          <section className={`lab-item viz-card ${activeCard === 2 ? 'active' : ''}`} onClick={() => setActiveCard(2)}>
            <div className="lab-card-content">
              <div className="card-header-row">
                <span className="icon">📊</span>
                <h3>Performance</h3>
              </div>
              <div className="viz-container">
                {[...Array(20)].map((_, i) => (
                  <div 
                    key={i} 
                    className="viz-bar" 
                    style={{ 
                      height: `${Math.sin(i * 0.4 + Date.now() * 0.005) * (vizIntensity/2.5) + 50}%`,
                      opacity: 0.2 + (vizIntensity / 120),
                      backgroundColor: `rgba(var(--p-rgb), ${0.3 + (i/40)})`,
                      boxShadow: vizIntensity > 50 ? `0 0 15px rgba(var(--p-rgb), 0.2)` : 'none'
                    }}
                  />
                ))}
              </div>
              <p className="card-footer-text">Rendering Load: {vizIntensity}%</p>
            </div>
          </section>

          {/* Card 3: Morphing Shape */}
          <section className={`lab-item morph-card ${activeCard === 3 ? 'active' : ''}`} onClick={() => setActiveCard(3)}>
            <div className="lab-card-content">
              <div className="card-header-row">
                <span className="icon">🌊</span>
                <h3>Morphing</h3>
              </div>
              <div className="morph-container">
                <div className="morph-shape" style={{ 
                  borderRadius: `${morphIntensity}% ${100-morphIntensity}% ${morphIntensity}% ${100-morphIntensity}% / 50%`,
                  transform: `rotate(${rotation}deg) scale(${0.8 + morphIntensity/400})`,
                  background: `linear-gradient(${rotation}deg, var(--primary), var(--secondary))`,
                  filter: `hue-rotate(${morphIntensity}deg) blur(${10 - morphIntensity/10}px)`
                }}></div>
              </div>
            </div>
          </section>

          {/* Card 4: Dynamic Engine Code */}
          <section className="lab-item code-card">
            <div className="lab-card-content">
              <div className="terminal-header">
                <span></span><span></span><span></span>
                <div className="terminal-title">LIVE_STATE_HOOK.js</div>
              </div>
              <div className="code-display">
                <pre><code>{`// 실시간 상태 반영 엔진
const Engine = () => {
  const [speed] = useState(${vizIntensity});
  const [fluid] = useState(${morphIntensity});
  
  return (
    <Renderer 
      config={{
        power: "\${speed}%",
        mode: "\${fluid > 50 ? 'Liquid' : 'Solid'}"
      }}
    />
  );
}`}</code></pre>
              </div>
              <div className="engine-status">
                <span className="pulse-dot"></span>
                CORE STABLE | ID: 0x{vizIntensity.toString(16).toUpperCase()}{morphIntensity.toString(16).toUpperCase()}
              </div>
            </div>
          </section>
        </div>

        <footer className="lab-footer animate-in delay-3">
          <div className="footer-line-gradient"></div>
          <p>DESIGNED BY PREMIUM FRONT-END ENGINEER © 2026</p>
        </footer>
      </div>
    </Layout>
  );
};

export default Features;
