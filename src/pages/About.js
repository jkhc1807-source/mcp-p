import React from 'react';
import Layout from './Layout';
import './Page.css';

const About = () => {
  const values = [
    { title: 'Innovation', desc: '기존의 틀을 깨는 새로운 기술적 시도.', icon: '🚀' },
    { title: 'Precision', desc: '단 1px의 오차도 허용하지 않는 정교함.', icon: '🎯' },
    { title: 'Experience', desc: '사용자 중심의 직관적이고 매끄러운 흐름.', icon: '✨' }
  ];

  return (
    <Layout>
      <div className="premium-page-container">
        <section className="about-hero">
          <span className="subtitle">OUR STORY</span>
          <h1>Defining the <span className="text-gradient">Next Standard</span></h1>
          <p>우리는 기술과 예술의 경계에서 새로운 디지털 경험을 창조합니다.<br/>리액트를 통한 혁신, 그것이 우리의 시작입니다.</p>
        </section>

        <section className="values-grid">
          {values.map((v, i) => (
            <div key={i} className="value-card glass-panel">
              <div className="value-icon">{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </section>

        <section className="about-vision">
          <div className="vision-content glass-panel">
            <h2>Our Vision</h2>
            <p>"단순히 동작하는 코드를 넘어, 사용자에게 영감을 주는 인터페이스를 지향합니다."</p>
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
