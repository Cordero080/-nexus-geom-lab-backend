import React, { useState, useEffect, useRef } from 'react';
import { getScrambledText, scrambleText } from '../../utils/textScrambler';
import './ScrambleButton.css';

const ScrambleButton = ({ 
  children, 
  className = '', 
  onClick, 
  type = 'button', 
  variant = 'primary' 
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [displayText, setDisplayText] = useState(children);
  const originalText = useRef(children);
  const scrambleInterval = useRef(null);
  const buttonRef = useRef(null);
  const scrambleSpeed = 50; // ms between scramble updates
  const codeDisplayTime = 1500; // ms to display code snippet

  // Handle hover state
  useEffect(() => {
    if (isHovering) {
      // Start scrambling effect
      let scrambleCount = 0;
      let showingCode = false;
      let codeTimer = null;
      
      scrambleInterval.current = setInterval(() => {
        scrambleCount++;
        
        // After a few scrambles, show a code snippet
        if (scrambleCount > 5 && !showingCode) {
          const codeSnippet = getScrambledText();
          setDisplayText(codeSnippet);
          showingCode = true;
          
          // Set a timer to start scrambling again
          codeTimer = setTimeout(() => {
            showingCode = false;
          }, codeDisplayTime);
        } 
        // If we're not showing a code snippet, scramble the text
        else if (!showingCode) {
          setDisplayText(scrambleText(originalText.current.toString()));
        }
      }, scrambleSpeed);
      
      return () => {
        clearInterval(scrambleInterval.current);
        if (codeTimer) clearTimeout(codeTimer);
      };
    } else {
      // Restore original text when not hovering
      setDisplayText(originalText.current);
      if (scrambleInterval.current) {
        clearInterval(scrambleInterval.current);
      }
    }
  }, [isHovering]);

  // Update the ref if children changes
  useEffect(() => {
    originalText.current = children;
    if (!isHovering) {
      setDisplayText(children);
    }
  }, [children, isHovering]);

  // State for ripple effect
  const [ripples, setRipples] = useState([]);

  // Handle mouse movement for beam effect
  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top; // y position within the element
    
    // Update CSS variables for the beam position
    buttonRef.current.style.setProperty('--x', `${x}px`);
    buttonRef.current.style.setProperty('--y', `${y}px`);
  };
  
  // Handle click for ripple effect
  const handleClick = (e) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Create a new ripple with unique ID
    const id = Date.now();
    const newRipple = { id, x, y };
    
    setRipples(prev => [...prev, newRipple]);
    
    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, 1000);
    
    // Call the original onClick handler
    if (onClick) onClick(e);
  };

  return (
    <button
      ref={buttonRef}
      className={`scramble-button ${variant} ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      type={type}
    >
      {/* Render ripple effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className={`ripple ${variant}-ripple`}
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
        />
      ))}
      <span className="scramble-text">{displayText}</span>
    </button>
  );
};

export default ScrambleButton;
