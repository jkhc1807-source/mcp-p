import React from 'react';
import Layout from './Layout';
import { Link } from 'react-router-dom';
import './Page.css';

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
