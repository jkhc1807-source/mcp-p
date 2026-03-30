import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { Link } from 'react-router-dom';
import './Page.css';

function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    // 1. Spotlight Tracking
    setMousePos({ x: e.clientX, y: e.clientY });

    // 2. Card Tilt
    const card = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - card.left) / card.width;
    const y = (e.clientY - card.top) / card.height;
    setTilt({ x: (y - 0.5) * -15, y: (x - 0.5) * 15 });
  };

  return (
    <Layout>
      <div className="premium-page-container" onMouseMove={handleMouseMove}>
        {/* 마우스를 따라다니는 빛 효과 (Spotlight) */}
        <div 
          className="spotlight" 
          style={{ 
            transform: `translate(${mousePos.x - 300}px, ${mousePos.y - 300}px)` 
          }}
        ></div>

        <div className="hero-card" style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
          <span className="subtitle">THE NEW ERA OF WEB</span>
          <h1>Experience <br/><span className="text-gradient">Pure Interaction</span></h1>
          <p>리액트의 강력한 상태 관리로 구현된 부드러운 움직임과 <br/>최상급 프리미엄 디자인의 조화를 직접 경험해 보세요.</p>
          
          <div className="cta-group">
            <Link to="/features" className="btn btn-primary">Showcase 탐험하기</Link>
            <Link to="/about" className="btn btn-outline">서비스 소개</Link>
          </div>
        </div>

        <section style={{marginTop: '15rem'}}>
          <h2 className="section-title">Why Premium?</h2>
          <div className="about-grid">
            <div className="info-card">
              <h4>Smoothness</h4>
              <p>60프레임의 끊김 없는 애니메이션을 통해 사용자에게 쾌적한 경험을 제공합니다.</p>
            </div>
            <div className="info-card">
              <h4>Responsive</h4>
              <p>어떤 기기에서도 동일한 고품격 디자인을 유지하도록 세밀하게 설계되었습니다.</p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default Home;
