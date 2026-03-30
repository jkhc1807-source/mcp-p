import React from 'react';
import Layout from './Layout';
import { Link } from 'react-router-dom';
import './Page.css';

function Home() {
  return (
    <Layout>
      <div className="hero-card">
        <h1>Welcome to <br/><span style={{color: 'var(--primary)', fontWeight: '900'}}>The New Era</span></h1>
        <p>리액트의 강력한 상태 관리와 프리미엄 디자인의 완벽한 조화.<br/>지금 바로 우리의 혁신적인 쇼케이스를 경험해 보세요.</p>
        <div className="cta-group">
          <Link to="/features" className="btn btn-primary" style={{boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)'}}>Showcase 탐험하기</Link>
          <Link to="/about" className="btn btn-outline">서비스 소개</Link>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
