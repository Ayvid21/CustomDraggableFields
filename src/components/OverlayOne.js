// src/Overlay.js
import React, { useEffect } from 'react';
import './Overlay.css';

const Overlay = ({ show, onClose }) => {
  const handleOutsideClick = (e) => {
    // Close the overlay if you click outside of the content area
    if (e.target.className === 'overlay') {
      onClose();
    }
  };

  useEffect(() => {
    if (show) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    // Cleanup the event listener when the component is unmounted or hidden
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [show]);

  if (!show) {
    return null;
  }

  return (
    <div className="overlay">
      <div className="overlay-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Overlay Content</h2>
        <p>This is an overlay. Click outside or the close button to dismiss it.</p>
      </div>
    </div>
  );
};

export default Overlay;
