import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import './Page.css';

function Contact() {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // [확실] 제출 완료 상태 추가
  const [formData, setFormData] = useState({
    name: '',
    emailUser: '',
    emailDomain: 'gmail.com',
    message: ''
  });
  const [showDomains, setShowDomains] = useState(false);
  const domainRef = useRef(null);

  const domains = ['gmail.com', 'naver.com', 'daum.net', 'hanmail.net', 'icloud.com', 'outlook.com', 'kakao.com'];

  useEffect(() => {
    function handleClickOutside(event) {
      if (domainRef.current && !domainRef.current.contains(event.target)) {
        setShowDomains(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClear = (name) => {
    setFormData(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const selectDomain = (domain) => {
    setFormData(prev => ({ ...prev, emailDomain: domain }));
    setShowDomains(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // [확실] alert 대신 상태 변경으로 성공 메시지 표시
    setIsSubmitted(true);
    // 실제 서버 전송 로직이 있다면 여기서 수행
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setShowForm(false);
    setFormData({ name: '', emailUser: '', emailDomain: 'gmail.com', message: '' });
  };

  return (
    <Layout>
      <div className="hero-card">
        <h1>Contact Us</h1>
        <p>궁금한 점이 있으신가요? 언제든 연락주세요.<br/>새로운 프로젝트 제안은 항상 환영입니다.</p>
        
        <div className="cta-container">
          {!isSubmitted ? (
            <>
              <div className="cta-group">
                <button 
                  onClick={() => setShowForm(!showForm)} 
                  className={`btn ${showForm ? 'btn-outline' : 'btn-primary'}`}
                >
                  {showForm ? 'Close Form' : 'Send Message'}
                </button>
                {!showForm && <Link to="/" className="btn btn-outline">Home</Link>}
              </div>

              <div className={`contact-form-wrapper ${showForm ? 'visible' : ''}`}>
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <div className="input-wrapper">
                      <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                      {formData.name && (
                        <button type="button" className="clear-btn" onClick={() => handleClear('name')}>&times;</button>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="email-split-container">
                      <div className="input-wrapper user-part">
                        <input
                          type="text"
                          name="emailUser"
                          placeholder="Email ID"
                          value={formData.emailUser}
                          onChange={handleChange}
                          required
                        />
                        {formData.emailUser && (
                          <button type="button" className="clear-btn" onClick={() => handleClear('emailUser')}>&times;</button>
                        )}
                      </div>
                      <span className="at-symbol">@</span>
                      <div className="domain-selector-wrapper" ref={domainRef}>
                        <button 
                          type="button" 
                          className="domain-select-btn"
                          onClick={() => setShowDomains(!showDomains)}
                        >
                          <span className="selected-text">{formData.emailDomain}</span>
                          <span className={`chevron ${showDomains ? 'open' : ''}`}>▾</span>
                        </button>
                        {showDomains && (
                          <div className="domain-dropdown-container">
                            <ul className="domain-dropdown">
                              {domains.map(d => (
                                <li key={d} onClick={() => selectDomain(d)}>
                                  <span className="domain-dot"></span>
                                  {d}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="input-wrapper">
                      <textarea
                        name="message"
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="4"
                      ></textarea>
                      {formData.message && (
                        <button type="button" className="clear-btn" onClick={() => handleClear('message')}>&times;</button>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                      Submit Message
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="success-message-ui">
              <div className="success-icon">🌸</div>
              <h2>전송 완료!</h2>
              <p>메시지가 성공적으로 전달되었습니다.<br/>최대한 빨리 답변 드릴게요!</p>
              <div className="cta-group" style={{ marginTop: '2rem' }}>
                <button onClick={resetForm} className="btn btn-primary">확인</button>
                <Link to="/" className="btn btn-outline">Home</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Contact;
