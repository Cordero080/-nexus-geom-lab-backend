{/* Scene 4: Superposition */}
        
import React from 'react';

export default function Scene({ id, isActive, backgroundClass, children }) {
  return (
    <section className={`quantum-scene${isActive ? ' active' : ''}`} id={id}>
      <div className={`scene-background ${backgroundClass}`}></div>
      <div className="scene-content">
        {children}
      </div>
    </section>
  );
}