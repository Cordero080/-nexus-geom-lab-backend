import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { scrambleText } from './textScrambler';

const ScrambleLink = ({ to, children, className = '' }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [displayText, setDisplayText] = useState(children);
  const [isScrambling, setIsScrambling] = useState(false);
  const originalText = useRef(children);
  const scrambleInterval = useRef(null);
  const scrambleTimeout = useRef(null);
  const scrambleSpeed = 30; // ms between scramble updates
  const scrambleDuration = 300; // Scramble duration before showing original (faster)
  const originalDisplayTime = 800; // ms to show original text
  const linkRef = useRef(null);
  const [originalWidth, setOriginalWidth] = useState(null);

  // Capture original width after render
  useEffect(() => {
    if (linkRef.current && originalWidth === null) {
      requestAnimationFrame(() => {
        if (linkRef.current) {
          setOriginalWidth(linkRef.current.offsetWidth);
        }
      });
    }
  }, [originalWidth]);

  // Handle hover state with cycling scramble effect
  useEffect(() => {
    if (isHovering) {
      const textContent =
        typeof children === 'string' ? children : linkRef.current?.textContent || '';

      let iterationCount = 0;
      const scrambleIterations = Math.floor(scrambleDuration / scrambleSpeed);

      const runScrambleCycle = () => {
        setIsScrambling(true);
        iterationCount = 0;

        // Start scrambling
        scrambleInterval.current = setInterval(() => {
          iterationCount++;
          
          if (iterationCount >= scrambleIterations) {
            // Stop scrambling and show original
            clearInterval(scrambleInterval.current);
            scrambleInterval.current = null;
            setDisplayText(originalText.current);
            setIsScrambling(false);

            // After showing original, start scrambling again if still hovering
            scrambleTimeout.current = setTimeout(() => {
              if (isHovering) {
                runScrambleCycle();
              }
            }, originalDisplayTime);
          } else {
            // Continue scrambling
            setDisplayText(scrambleText(textContent));
          }
        }, scrambleSpeed);
      };

      runScrambleCycle();
    } else {
      // Cleanup and restore original when not hovering
      if (scrambleInterval.current) {
        clearInterval(scrambleInterval.current);
        scrambleInterval.current = null;
      }
      if (scrambleTimeout.current) {
        clearTimeout(scrambleTimeout.current);
        scrambleTimeout.current = null;
      }
      setIsScrambling(false);
      setDisplayText(originalText.current);
    }

    return () => {
      if (scrambleInterval.current) {
        clearInterval(scrambleInterval.current);
      }
      if (scrambleTimeout.current) {
        clearTimeout(scrambleTimeout.current);
      }
    };
  }, [isHovering, children]);

  // Update the ref if children changes
  useEffect(() => {
    originalText.current = children;
    if (!isHovering) {
      setDisplayText(children);
    }
  }, [children, isHovering]);

  return (
    <Link
      ref={linkRef}
      to={to}
      className={className}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        display: 'inline-block',
        minWidth: originalWidth ? `${originalWidth}px` : 'auto',
        textAlign: 'left',
      }}
    >
      {displayText}
    </Link>
  );
};

export default ScrambleLink;
