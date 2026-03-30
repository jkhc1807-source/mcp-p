import React, { useState } from 'react';
import Layout from './Layout';
import './Page.css';

const Contact = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    emailId: '', 
    emailDomain: '', 
    message: '' 
  });
  const [status, setStatus] = useState('idle');

  const handleDomainChange = (e) => {
    setFormData({ ...formData, emailDomain: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
      setFormData({ name: '', emailId: '', emailDomain: '', message: '' });
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
            
            {/* 이메일 분리 입력창 (수정됨) */}
            <div className="form-group">
              <label>Email Address</label>
              <div className="email-split-container">
                <input 
                  type="text" 
                  placeholder="ID" 
                  value={formData.emailId}
                  onChange={(e) => setFormData({...formData, emailId: e.target.value})}
                  required
                />
                <span className="at-symbol">@</span>
                <input 
                  type="text" 
                  placeholder="domain.com" 
                  value={formData.emailDomain}
                  onChange={(e) => setFormData({...formData, emailDomain: e.target.value})}
                  required
                />
                <select className="domain-select" onChange={handleDomainChange} value={formData.emailDomain}>
                  <option value="">직접 입력</option>
                  <option value="naver.com">naver.com</option>
                  <option value="gmail.com">gmail.com</option>
                  <option value="daum.net">daum.net</option>
                  <option value="kakao.com">kakao.com</option>
                </select>
              </div>
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
