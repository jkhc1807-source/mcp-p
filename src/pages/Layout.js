import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Page.css';

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="app-container">
      <div className="navbar-wrapper">
        <nav className="navbar">
          <Link to="/" className="nav-logo">REACT DEV</Link>
          
          <div className="nav-links desktop-only">
            <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>Home</NavLink>
            <NavLink to="/about" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>About</NavLink>
            <NavLink to="/contact" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>Contact</NavLink>
          </div>

          {/* 모바일 햄버거 버튼: 닫기 상태에서도 보이도록 z-index를 최상단으로 올림 */}
          <button 
            className={`mobile-menu-btn ${isMenuOpen ? 'open' : ''}`} 
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>
      </div>

      {/* 모바일 전체화면 메뉴 오버레이: 배경 클릭 시 닫힘 */}
      <div className={`mobile-overlay ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
        <div className="mobile-nav-links" onClick={(e) => e.stopPropagation()}>
          <NavLink to="/" className="mobile-nav-item" onClick={toggleMenu}>Home</NavLink>
          <NavLink to="/about" className="mobile-nav-item" onClick={toggleMenu}>About</NavLink>
          <NavLink to="/contact" className="mobile-nav-item" onClick={toggleMenu}>Contact</NavLink>
        </div>
      </div>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
