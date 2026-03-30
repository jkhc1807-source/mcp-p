import React from 'react';
import Layout from './Layout';
import { Link } from 'react-router-dom';
import './Page.css';

function Home() {
  return (
    <Layout>
      <div className="hero-card">
        <h1>Welcome to <br/><span style={{color: 'var(--primary)'}}>The Future</span></h1>
        <p>리액트의 강력한 상태 관리와 고성능 렌더링을 직접 확인해 보세요.<br/>단순한 페이지를 넘어선 인터랙티브한 경험을 선사합니다.</p>
        <div className="cta-group">
          <Link to="/features" className="btn btn-primary">Showcase 보기</Link>
          <Link to="/about" className="btn btn-outline">더 알아보기</Link>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
