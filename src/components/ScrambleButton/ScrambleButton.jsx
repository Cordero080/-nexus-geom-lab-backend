import React, { useState, useEffect, useRef } from 'react';
import { getScrambledText, scrambleText } from '../../utils/textScrambler';
import {
  createMouseMoveHandler,
  createClickHandler,
  createHoverHandlers,
} from './scrambleButtonHandlers';
import styles from './ScrambleButton.module.scss';
import '../../styles/shared.css';

const ScrambleButton = ({ 
  children, 
  className = '', 
  onClick, 
  type = 'button', 
  variant = 'primary' 
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [displayText, setDisplayText] = useState(children);
  const [ripples, setRipples] = useState([]);
  const originalText = useRef(children);
  const scrambleInterval = useRef(null);
  const buttonRef = useRef(null);
  const scrambleSpeed = 50; // ms between scramble updates
  const codeDisplayTime = 1500; // ms to display code snippet

  // Get handlers from local handlers file
  const handleMouseMove = createMouseMoveHandler(buttonRef);
  const handleClick = createClickHandler(buttonRef, setRipples, onClick);
  const hoverHandlers = createHoverHandlers(setIsHovering);

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

  return (
    <button
      ref={buttonRef}
      className={`${styles.scrambleButton} ${styles[variant]} ${className}`}
      {...hoverHandlers}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      type={type}
    >
      {/* Render ripple effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className={`${styles.ripple} ${styles[`${variant}Ripple`]}`}
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
        />
      ))}
      <span className={styles.scrambleText}>{displayText}</span>
    </button>
  );
};

export default ScrambleButton;
