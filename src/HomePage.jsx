import React from 'react';
import './bg.css';

export default function HomePage({ onEnter }) {
  console.log('HomePage rendered, onEnter is:', onEnter);
  
  const handleClick = () => {
    console.log('Button clicked inside HomePage!');
    if (onEnter) {
      console.log('Calling onEnter...');
      onEnter();
    } else {
      console.log('ERROR: onEnter is undefined!');
    }
  };
  
  return (
    <div className="bg-gradient-purple" style={{ minHeight: '100vh', minWidth: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{
        background: 'rgba(20, 10, 40, 0.7)',
        borderRadius: '2rem',
        padding: '3rem 2.5rem',
        boxShadow: '0 8px 40px 0 #000a, 0 1.5px 0 #fff2',
        textAlign: 'center',
        maxWidth: 420,
        width: '90%',
        border: '1.5px solid #fff2',
        backdropFilter: 'blur(8px) saturate(180%)',
      }}>
        <h1 style={{
          fontSize: '2.8rem',
          fontWeight: 700,
          letterSpacing: '0.04em',
          color: '#fff',
          marginBottom: '1.2rem',
          textShadow: '0 2px 16px #980ae4cc, 0 1px 0 #fff2',
        }}>
          Welcome to <span style={{ color: '#980ae4' }}>React Three.js Playground</span>
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: '#e0e0ff',
          marginBottom: '2.2rem',
          lineHeight: 1.6,
        }}>
          Explore interactive 3D geometry, futuristic wireframes, and vibrant environments.<br />
          <span style={{ color: '#980ae4', fontWeight: 600 }}>Built with React, Three.js, and CSS magic.</span>
        </p>
        <button
          onClick={handleClick}
          style={{
            fontSize: '1.2rem',
            fontWeight: 600,
            padding: '0.9rem 2.5rem',
            borderRadius: '2rem',
            background: 'linear-gradient(90deg, #980ae4 0%, #033867 100%)',
            color: '#fff',
            border: 'none',
            boxShadow: '0 2px 16px #980ae4cc',
            cursor: 'pointer',
            letterSpacing: '0.04em',
            transition: 'background 0.2s, box-shadow 0.2s',
          }}
        >
          Enter Playground
        </button>
      </div>
      <div style={{ position: 'absolute', bottom: 24, color: '#fff8', fontSize: '1rem', letterSpacing: '0.03em' }}>
        &copy; {new Date().getFullYear()} Futuristic Geometry Playground
      </div>
    </div>
  );
}