import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { scrambleText } from './textScrambler';

const ScrambleLink = ({ to, children, className = '' }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [displayText, setDisplayText] = useState(children);
  const originalText = useRef(children);
  const scrambleInterval = useRef(null);
  const scrambleTimeout = useRef(null);
  const scrambleSpeed = 50; // ms between scramble updates
  const scrambleDuration = 2000; // Stop scrambling after 2 seconds
  const linkRef = useRef(null);
  const [originalWidth, setOriginalWidth] = useState(null);

  // Capture original width after render
  useEffect(() => {
    if (linkRef.current && originalWidth === null) {
      // Wait a frame to ensure text is rendered
      requestAnimationFrame(() => {
        if (linkRef.current) {
          setOriginalWidth(linkRef.current.offsetWidth);
        }
      });
    }
  }, [originalWidth]);

  // Handle hover state
  useEffect(() => {
    if (isHovering) {
      // Get text content from children (handles JSX)
      const textContent =
        typeof children === 'string' ? children : linkRef.current?.textContent || '';

      // Start scrambling effect
      scrambleInterval.current = setInterval(() => {
        setDisplayText(scrambleText(textContent));
      }, scrambleSpeed);

      // Stop scrambling after duration and show original text
      scrambleTimeout.current = setTimeout(() => {
        clearInterval(scrambleInterval.current);
        scrambleInterval.current = null;
        setDisplayText(originalText.current);
      }, scrambleDuration);
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
  }, [isHovering]);

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
