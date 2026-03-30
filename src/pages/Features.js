import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import './Features.css';

const Features = () => {
  const [theme, setTheme] = useState('mystic'); // mystic, aurora, vulcan
  const [intensity, setIntensity] = useState(50);
  const [btcPrice, setBtcPrice] = useState(null);

  const themes = {
    mystic: { primary: '#8b5cf6', secondary: '#ec4899', bg: '#09090b' },
    aurora: { primary: '#10b981', secondary: '#3b82f6', bg: '#020617' },
    vulcan: { primary: '#f43f5e', secondary: '#f59e0b', bg: '#0c0a09' }
  };

  // 실시간 비트코인 가격 연동 (리액트의 데이터 패칭 시연)
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
    const interval = setInterval(fetchPrice, 10000); // 10초마다 갱신
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
            <span className="subtitle">EXPERIENCE THE POWER</span>
            <h1>The Art of <span className="text-glow">React State</span></h1>
            <p>단순한 코드 그 이상의 가치. 리액트의 상태 관리가 빚어내는 <br/>가장 매혹적이고 유연한 사용자 경험을 만나보세요.</p>
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
          {/* Real-time Data Card */}
          <div className="bento-item small glass-panel">
            <div className="bento-content">
              <h3>Live Market Data</h3>
              <div className="btc-value" style={{ color: 'var(--p-color)' }}>
                {btcPrice ? `$${btcPrice.split('.')[0]}` : 'Loading...'}
              </div>
              <p>Bitcoin 실시간 시세 (10s sync). 외부 API와 리액트 상태의 실시간 동기화.</p>
            </div>
          </div>

          <div className="bento-item large glass-panel">
            <div className="bento-content">
              <h3>High-Velocity Rendering</h3>
              <p>수백 개의 동적 노드를 초당 60프레임으로 제어하는 리액트의 압도적 효율성.</p>
              <div className="visual-preview">
                <div className="wave-container">
                  {[...Array(20)].map((_, i) => (
                    <div 
                      key={i} 
                      className="wave-bar" 
                      style={{ 
                        height: `${Math.sin(i * 0.5) * 50 + 60}%`,
                        animationDelay: `${i * 0.1}s`,
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
              <h3>Dynamic Intensity</h3>
              <div className="slider-wrapper">
                <input 
                  type="range" 
                  value={intensity} 
                  onChange={(e) => setIntensity(e.target.value)} 
                />
                <div className="intensity-value" style={{ color: 'var(--p-color)' }}>{intensity}%</div>
              </div>
              <p>상태 변화에 따른 즉각적인 UI 피드백 루프.</p>
            </div>
          </div>

          <div className="bento-item small glass-panel">
            <div className="bento-content">
              <div className="comp-icons">
                <div className="icon-box" style={{ borderColor: 'var(--p-color)' }}>🧩</div>
                <div className="icon-box" style={{ borderColor: 'var(--s-color)' }}>✨</div>
              </div>
              <h3>Component Magic</h3>
              <p>독립적인 조각들이 모여 완성되는 유기적인 인터페이스.</p>
            </div>
          </div>

          <div className="bento-item wide glass-panel">
            <div className="bento-content split">
              <div className="text-side">
                <h3>Declarative Purity</h3>
                <p>복잡한 명령 대신 결과에 집중합니다. 이것이 리액트가 현대 웹의 표준이 된 이유입니다.</p>
              </div>
              <div className="code-preview-modern">
                <div className="code-dot"></div>
                <pre>
                  <code>{`view = state => (\n  <div theme={theme}>\n    {state.data}\n  </div>\n)`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        <footer className="premium-footer">
          <div className="footer-line"></div>
          <p>© 2026 REACT POWERED SHOWCASE. CRAFTED WITH PASSION.</p>
        </footer>
      </div>
    </Layout>
  );
};

export default Features;
