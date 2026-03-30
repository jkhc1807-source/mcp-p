import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Page.css';

const Layout = ({ children }) => (
  <div className="app-container">
    <nav className="navbar">
      <Link to="/" className="nav-logo">REACT DEV</Link>
      <div className="nav-links">
        <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>Home</NavLink>
        <NavLink to="/about" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>About</NavLink>
        <NavLink to="/contact" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>Contact</NavLink>
      </div>
    </nav>
    <main className="main-content">
      {children}
    </main>
  </div>
);

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
