import React, { useState } from 'react';
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

function Contact() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`메시지가 전송되었습니다!\n이름: ${formData.name}\n이메일: ${formData.email}\n내용: ${formData.message}`);
    setShowForm(false);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <Layout>
      <div className="hero-card">
        <h1>Contact Us</h1>
        <p>궁금한 점이 있으신가요? 언제든 연락주세요.<br/>새로운 프로젝트 제안은 항상 환영입니다.</p>
        
        {!showForm ? (
          <div className="cta-group">
            <button 
              onClick={() => setShowForm(true)} 
              className="btn btn-primary"
              style={{ border: 'none', cursor: 'pointer', fontSize: '1rem' }}
            >
              Send Message
            </button>
            <Link to="/" className="btn btn-outline">Home</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
              ></textarea>
            </div>
            <div className="cta-group">
              <button type="submit" className="btn btn-primary" style={{ border: 'none', cursor: 'pointer' }}>Submit</button>
              <button 
                type="button" 
                onClick={() => setShowForm(false)} 
                className="btn btn-outline"
                style={{ cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
}

export default Contact;
