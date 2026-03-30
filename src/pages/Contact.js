import React, { useState, useRef, useEffect } from 'react';
import Layout from './Layout';
import './Page.css';

const Contact = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    emailId: '', 
    emailDomain: '', 
    message: '' 
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isManual, setIsManual] = useState(false);
  const [status, setStatus] = useState('idle');
  const dropdownRef = useRef(null);

  const domains = ['gmail.com', 'naver.com', 'daum.net', 'kakao.com', '직접 입력'];

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDomainSelect = (domain) => {
    if (domain === '직접 입력') {
      setIsManual(true);
      setFormData({ ...formData, emailDomain: '' });
    } else {
      setIsManual(false);
      setFormData({ ...formData, emailDomain: domain });
    }
    setIsDropdownOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
      setFormData({ name: '', emailId: '', emailDomain: '', message: '' });
      setIsManual(false);
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
              <div className="input-wrapper">
                <input 
                  type="text" 
                  placeholder="홍길동" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
                {formData.name && (
                  <button type="button" className="btn-clear" onClick={() => setFormData({...formData, name: ''})}>X</button>
                )}
              </div>
            </div>
            
            <div className="form-group">
              <label>Email Address</label>
              <div className="email-split-container">
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    placeholder="ID" 
                    value={formData.emailId}
                    onChange={(e) => setFormData({...formData, emailId: e.target.value})}
                    required
                  />
                  {formData.emailId && (
                    <button type="button" className="btn-clear" onClick={() => setFormData({...formData, emailId: ''})}>X</button>
                  )}
                </div>
                <span className="at-symbol">@</span>
                
                <div className="custom-dropdown-wrapper" ref={dropdownRef}>
                  {isManual ? (
                    <div className="manual-input-wrapper">
                      <div className="input-wrapper">
                        <input 
                          type="text" 
                          placeholder="domain.com" 
                          value={formData.emailDomain}
                          onChange={(e) => setFormData({...formData, emailDomain: e.target.value})}
                          autoFocus
                          required
                        />
                        {formData.emailDomain && (
                          <button type="button" className="btn-clear" onClick={() => setFormData({...formData, emailDomain: ''})}>X</button>
                        )}
                      </div>
                      <button type="button" className="btn-back" onClick={() => setIsManual(false)}>↩</button>
                    </div>
                  ) : (
                    <div 
                      className={`custom-dropdown-selected ${isDropdownOpen ? 'open' : ''}`}
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      {formData.emailDomain || '선택하세요'}
                      <span className="dropdown-arrow"></span>
                    </div>
                  )}
                  
                  {isDropdownOpen && !isManual && (
                    <div className="custom-dropdown-list">
                      {domains.map((domain) => (
                        <div 
                          key={domain} 
                          className="custom-dropdown-item"
                          onClick={() => handleDomainSelect(domain)}
                        >
                          {domain}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Message</label>
              <div className="input-wrapper">
                <textarea 
                  placeholder="전달하고 싶은 메시지..."
                  rows="5"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                ></textarea>
                {formData.message && (
                  <button type="button" className="btn-clear" style={{top: '1.5rem', transform: 'none'}} onClick={() => setFormData({...formData, message: ''})}>X</button>
                )}
              </div>
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
