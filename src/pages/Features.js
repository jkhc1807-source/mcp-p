import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import './Features.css';

const Features = () => {
  const [theme, setTheme] = useState('mystic'); 
  const [intensity, setIntensity] = useState(50);
  const [btcPrice, setBtcPrice] = useState(null);

  const themes = {
    mystic: { primary: '#8b5cf6', secondary: '#ec4899', bg: '#05070a' },
    aurora: { primary: '#10b981', secondary: '#3b82f6', bg: '#020617' },
    vulcan: { primary: '#f43f5e', secondary: '#f59e0b', bg: '#0c0a09' }
  };

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
        const data = await response.json();
        setBtcPrice(data.bpi.USD.rate);
      } catch (error) {
        console.error('Failed to fetch price');
      }
    };
    fetchPrice();
    const interval = setInterval(fetchPrice, 10000); 
    return () => clearInterval(interval);
  }, []);

  const currentTheme = themes[theme];

  return (
    <Layout>
      <div className={`premium-container theme-${theme}`} style={{
        '--p-color': currentTheme.primary,
        '--s-color': currentTheme.secondary,
        '--bg-color': currentTheme.bg
      }}>
        <div className="mesh-gradient"></div>

        <section className="premium-hero">
          <div className="reveal-text">
            <span className="subtitle">TECHNOLOGY SHOWCASE</span>
            <h1>Real-time <span className="text-glow">Engine</span></h1>
            <p>리액트의 상태 관리가 빚어내는 가장 완벽하고 유연한 <br/>디지털 경험을 지금 바로 확인해 보세요.</p>
          </div>

          <div className="theme-switcher">
            {Object.keys(themes).map(t => (
              <button 
                key={t} 
                className={`theme-btn ${theme === t ? 'active' : ''}`}
                onClick={() => setTheme(t)}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </section>

        <div className="bento-grid">
          {/* Bitcoin Live Widget */}
          <div className="bento-item small glass-panel">
            <div className="bento-content">
              <span className="badge-live">LIVE DATA</span>
              <h3>BTC Market</h3>
              <div className="btc-value" style={{ color: 'var(--p-color)' }}>
                {btcPrice ? `$${btcPrice.split('.')[0]}` : 'Loading...'}
              </div>
              <p>실시간 암호화폐 API 연동 시연. (Sync every 10s)</p>
            </div>
          </div>

          <div className="bento-item large glass-panel">
            <div className="bento-content">
              <h3>Performance Rendering</h3>
              <p>수백 개의 노드를 지연 없이 제어하는 Virtual DOM의 위력.</p>
              <div className="visual-preview">
                <div className="wave-container">
                  {[...Array(24)].map((_, i) => (
                    <div 
                      key={i} 
                      className="wave-bar" 
                      style={{ 
                        height: `${Math.sin(i * 0.4) * 60 + 70}%`,
                        animationDelay: `${i * 0.05}s`,
                        backgroundColor: i % 2 === 0 ? 'var(--p-color)' : 'var(--s-color)'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bento-item small glass-panel">
            <div className="bento-content">
              <h3>Dynamic UX</h3>
              <div className="slider-wrapper">
                <input 
                  type="range" 
                  value={intensity} 
                  onChange={(e) => setIntensity(Number(e.target.value))} 
                />
                <div className="intensity-value" style={{ color: 'var(--p-color)' }}>{intensity}%</div>
              </div>
              <p>슬라이더 조절 시 즉각적으로 반영되는 UI 피드백.</p>
            </div>
          </div>

          <div className="bento-item wide glass-panel">
            <div className="bento-content split">
              <div className="text-side">
                <h3>Component Logic</h3>
                <p>독립적인 모듈들이 모여 거대한 시스템을 이루는 선언적 프로그래밍.</p>
              </div>
              <div className="code-preview-modern">
                <div className="code-dot"></div>
                <pre><code>{`const App = () => (\n  <Showcase data={realtime} />\n)`}</code></pre>
              </div>
            </div>
          </div>
        </div>

        <footer className="premium-footer">
          <div className="footer-line"></div>
          <p>© 2026 REACT POWERED SHOWCASE. ALL RIGHTS RESERVED.</p>
        </footer>
      </div>
    </Layout>
  );
};

export default Features;
