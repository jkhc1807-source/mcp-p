import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Page.css';

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // 1. 초기 상태를 localStorage에서 가져옴 (없으면 기본 다크 모드)
    const savedTheme = localStorage.getItem('premium-theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    // 2. 테마 변경 시 localStorage에 저장
    localStorage.setItem('premium-theme', nextMode ? 'dark' : 'light');
  };

  useEffect(() => {
    // 3. 상태에 맞춰 body 클래스 제어
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [isDarkMode]);

  return (
    <div className="app-container">
      <div className="navbar-wrapper">
        <nav className="navbar">
          <Link to="/" className="nav-logo">REACT PREMIUM</Link>
          
          <div className="nav-right-group">
            <div className="nav-links">
              <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>Home</NavLink>
              <NavLink to="/features" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>Showcase</NavLink>
              <NavLink to="/about" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>About</NavLink>
              <NavLink to="/contact" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>Contact</NavLink>
            </div>
            
            {/* 세련된 선형 SVG 테마 버튼 */}
            <button className="theme-toggle-minimal" onClick={toggleTheme} aria-label="Toggle Theme">
              {isDarkMode ? (
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              )}
            </button>
          </div>

          <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Open Menu">
            <span></span><span></span><span></span>
          </button>
        </nav>
      </div>

      {/* 모바일 내비게이션 오버레이 (명시적 닫기 버튼 포함) */}
      <div className={`mobile-nav-overlay ${isMenuOpen ? 'open' : ''}`}>
        <button className="menu-close-btn" onClick={() => setIsMenuOpen(false)} aria-label="Close Menu">X</button>
        <NavLink to="/" className="mobile-nav-item" onClick={() => setIsMenuOpen(false)}>Home</NavLink>
        <NavLink to="/features" className="mobile-nav-item" onClick={() => setIsMenuOpen(false)}>Showcase</NavLink>
        <NavLink to="/about" className="mobile-nav-item" onClick={() => setIsMenuOpen(false)}>About</NavLink>
        <NavLink to="/contact" className="mobile-nav-item" onClick={() => setIsMenuOpen(false)}>Contact</NavLink>
      </div>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
