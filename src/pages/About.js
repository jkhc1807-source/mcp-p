import React from 'react';
import Layout from './Layout';
import './Page.css';

const About = () => {
  const sections = [
    {
      title: "Our Philosophy",
      subtitle: "VALUES",
      items: [
        { title: "Design First", desc: "기술은 아름다움을 통해 완성됩니다. 시각적 즐거움이 곧 성능입니다." },
        { title: "User Centric", desc: "사용자가 생각할 필요 없는 직관적인 흐름을 설계합니다." },
        { title: "Cutting Edge", desc: "가장 최신의 리액트 에코시스템을 활용하여 한계를 돌파합니다." }
      ]
    },
    {
      title: "Technical Excellence",
      subtitle: "STACK",
      items: [
        { title: "React 19+", desc: "최신 기능을 활용한 고성능 컴포넌트 설계." },
        { title: "Vercel Edge", desc: "전 세계 어디서든 0.1초의 응답 속도 보장." },
        { title: "Micro-Interactions", desc: "사용자 반응에 60fps로 응답하는 매끄러운 인터페이스." }
      ]
    }
  ];

  const milestones = [
    { year: "2024", event: "Project Innovation Award 수상" },
    { year: "2025", event: "전 세계 100만 사용자 돌파" },
    { year: "2026", event: "AI 기반 인터랙티브 엔진 도입" }
  ];

  return (
    <Layout>
      <div className="premium-page-container">
        {/* Background Blobs for Visual Continuity */}
        <div className="blob blob-1"></div>
        <div className="blob blob-2" style={{bottom: '0', top: 'auto'}}></div>

        <section className="about-hero">
          <span className="subtitle">THE ARCHITECTS OF EXPERIENCE</span>
          <h1>Creating the <span className="text-gradient">Next Standard</span></h1>
          <p>단순히 코드를 짜는 것을 넘어, 우리는 사용자에게 영감을 주는 예술적인 인터페이스를 창조합니다. <br/>기술과 디자인의 완벽한 결합, 그것이 우리의 사명입니다.</p>
        </section>

        {/* 1. Core Sections */}
        {sections.map((section, sIdx) => (
          <section key={sIdx} className="about-section">
            <span className="subtitle" style={{textAlign: 'center', display: 'block'}}>{section.subtitle}</span>
            <h2 className="section-title">{section.title}</h2>
            <div className="about-grid">
              {section.items.map((item, iIdx) => (
                <div key={iIdx} className="info-card glass-panel">
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* 2. Milestones (Timeline) */}
        <section className="about-section">
          <span className="subtitle" style={{textAlign: 'center', display: 'block'}}>JOURNEY</span>
          <h2 className="section-title">Our Milestones</h2>
          <div className="glass-panel opaque" style={{padding: '4rem'}}>
            <div className="milestone-list">
              {milestones.map((m, i) => (
                <div key={i} className="milestone-item" style={{display: 'flex', gap: '3rem', marginBottom: '2rem', alignItems: 'center'}}>
                  <strong style={{fontSize: '2rem', color: 'var(--primary)', minWidth: '100px'}}>{m.year}</strong>
                  <p style={{fontSize: '1.2rem', color: 'var(--text-main)'}}>{m.event}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Vision Summary */}
        <section className="about-vision" style={{marginTop: '10rem'}}>
          <div className="vision-content glass-panel">
            <h2>Our Infinite Vision</h2>
            <p>"단순히 동작하는 코드를 넘어, 전 세계 사용자에게 영감을 주는 압도적인 인터페이스를 지향합니다."</p>
            <div className="vision-stats">
              <div className="stat-item"><strong>99%</strong><span>Optimization</span></div>
              <div className="stat-item"><strong>24/7</strong><span>Availability</span></div>
              <div className="stat-item"><strong>∞</strong><span>Possibilities</span></div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;
