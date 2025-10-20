import React, { useEffect } from 'react';
import './CustomCursor.css';

/**
 * CustomCursor component for creating a custom mouse cursor
 * Replaces the default cursor with a custom SVG shape that follows mouse movement
 */
const CustomCursor = () => {
  useEffect(() => {
    const moveCursor = (e) => {
      const cursor = document.getElementById('custom-cursor');
      if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      }
    };
    document.addEventListener('mousemove', moveCursor);
    return () => document.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <div id="custom-cursor">
      <svg width="40" height="40" style={{ position: 'absolute', left: '-20px', top: '-20px', pointerEvents: 'none' }}>
        {/* Draw triangle above the circle, solid color, on top */}
        <polygon points="20,5 35,35 5,35" fill="#ff3366" stroke="#222" strokeWidth="2" />
        {/* Center circle */}
        <circle cx="20" cy="20" r="10" fill="#fff" stroke="#222" strokeWidth="2" />
      </svg>
    </div>
  );
};

export default CustomCursor;