import React, { useState, useEffect, useRef } from 'react';
import { scrambleText } from '../ScrambleLink/textScrambler';
import {
  createMouseMoveHandler,
  createClickHandler,
  createHoverHandlers,
} from './scrambleButtonHandlers';
import styles from './ScrambleButton.module.scss';

const ScrambleButton = ({
  children,
  className = '',
  onClick,
  type = 'button',
  variant = 'primary',
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [displayText, setDisplayText] = useState(children);
  const [ripples, setRipples] = useState([]);
  const originalText = useRef(children);
  const scrambleInterval = useRef(null);
  const buttonRef = useRef(null);
  const scrambleSpeed = 30; // ms between scramble updates

  // Get handlers from local handlers file
  const handleMouseMove = createMouseMoveHandler(buttonRef);
  const handleClick = createClickHandler(buttonRef, setRipples, onClick);
  const hoverHandlers = createHoverHandlers(setIsHovering);

  // Handle hover state
  useEffect(() => {
    if (isHovering) {
      // Scramble effect that cycles: scramble -> original -> scramble -> original
      let scrambleCount = 0;
      let showingOriginal = false;
      const scrambleDuration = 8; // Number of scramble iterations before showing original
      const originalDisplayTime = 1200; // ms to display original text

      scrambleInterval.current = setInterval(() => {
        scrambleCount++;

        // After some scrambles, show the original text
        if (scrambleCount >= scrambleDuration && !showingOriginal) {
          setDisplayText(originalText.current);
          showingOriginal = true;
          scrambleCount = 0;

          // Set a timer to start scrambling again
          setTimeout(() => {
            showingOriginal = false;
          }, originalDisplayTime);
        }
        // If we're not showing original, scramble the text
        else if (!showingOriginal) {
          setDisplayText(scrambleText(originalText.current.toString()));
        }
      }, scrambleSpeed);

      return () => {
        clearInterval(scrambleInterval.current);
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
      {ripples.map((ripple) => (
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
