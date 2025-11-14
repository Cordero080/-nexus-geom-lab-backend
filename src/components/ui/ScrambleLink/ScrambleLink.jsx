import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { scrambleText } from '../../../utils/textScrambler';

const ScrambleLink = ({ to, children, className = '' }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [displayText, setDisplayText] = useState(children);
  const originalText = useRef(children);
  const scrambleInterval = useRef(null);
  const scrambleSpeed = 50; // ms between scramble updates
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

      return () => {
        clearInterval(scrambleInterval.current);
      };
    } else {
      // Restore original children when not hovering
      setDisplayText(originalText.current);
      if (scrambleInterval.current) {
        clearInterval(scrambleInterval.current);
      }
    }
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
