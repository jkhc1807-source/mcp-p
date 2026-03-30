import React, { useState } from 'react';
import Layout from './Layout';
import './Page.css';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, sending, success

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    // 실제 서버 전송 시뮬레이션
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
      setFormData({ name: '', email: '', message: '' });
    }, 2000);
  };

  return (
    <Layout>
      <div className="premium-page-container">
        <section className="contact-hero">
          <span className="subtitle">CONNECT</span>
          <h1>Let's Create <span className="text-gradient">Something Iconic</span></h1>
          <p>새로운 영감, 협업 문의, 혹은 단순한 인사를 환영합니다.<br/>당신의 아이디어를 들려주세요.</p>
        </section>

        <div className="contact-grid">
          <div className="contact-info glass-panel">
            <h3>Get in Touch</h3>
            <div className="info-item">
              <span className="icon">📧</span>
              <div>
                <strong>Email</strong>
                <p>contact@react-premium.com</p>
              </div>
            </div>
            <div className="info-item">
              <span className="icon">📍</span>
              <div>
                <strong>Location</strong>
                <p>Digital Nomad Space, Seoul</p>
              </div>
            </div>
            <div className="social-links">
              <span>Follow us:</span>
              <div className="social-icons">🔗 GitHub 🔗 LinkedIn 🔗 Twitter</div>
            </div>
          </div>

          <form className="contact-form glass-panel" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input 
                type="text" 
                placeholder="홍길동" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="your@email.com" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea 
                placeholder="전달하고 싶은 메시지..."
                rows="5"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                required
              ></textarea>
            </div>
            <button className={`btn-submit ${status}`} disabled={status !== 'idle'}>
              {status === 'idle' && 'Send Message'}
              {status === 'sending' && 'Sending...'}
              {status === 'success' && '✓ Sent Successfully'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
