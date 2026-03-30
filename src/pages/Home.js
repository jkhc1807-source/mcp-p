import React from 'react';
import Layout from './Layout';
import { Link } from 'react-router-dom';
import './Page.css';

function Home() {
  return (
    <Layout>
      <div className="hero-card">
        <h1>Welcome to <br/><span style={{color: 'var(--primary)'}}>The Future</span></h1>
        <p>최신 리액트 기술로 구축된 모던한 웹사이트입니다.<br/>반응형 디자인과 세련된 UI를 경험해 보세요.</p>
        <div className="cta-group">
          <Link to="/about" className="btn btn-primary">Get Started</Link>
          <Link to="/contact" className="btn btn-outline">Contact Us</Link>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
