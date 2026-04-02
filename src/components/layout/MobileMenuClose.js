import React from 'react';
import './MobileMenuClose.css';

const MobileMenuClose = ({ onClick }) => {
  return (
    <button className="mobile-menu-close" onClick={onClick} aria-label="Close menu">
      <div className="close-icon">
        <span></span>
        <span></span>
      </div>
      <span className="close-text">CLOSE</span>
    </button>
  );
};

export default MobileMenuClose;
