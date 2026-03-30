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

function About() {
  return (
    <Layout>
      <div className="hero-card">
        <h1>About Us</h1>
        <p>우리는 혁신적인 웹 경험을 창조합니다.<br/>심플하지만 강력한 결과물을 지향합니다.</p>
        <div className="cta-group">
          <Link to="/" className="btn btn-outline">Back to Home</Link>
        </div>
      </div>
    </Layout>
  );
}

export default About;
