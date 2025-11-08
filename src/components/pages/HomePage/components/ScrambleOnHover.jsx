import React, { useEffect, useRef, useState } from 'react';

/**
 * Scrambling component for title text
 * Scrambles from originalText to finalText using katakana characters
 * @param {string} originalText - Initial text to display
 * @param {string} finalText - Final text after scramble effect
 * @param {number} delay - Delay before scramble starts (ms)
 */
export default function ScrambleOnHover({ originalText, finalText, delay = 3000 }) {
  const [displayText, setDisplayText] = useState(originalText);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  const katakanaChars = [
    'ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ',
    'サ', 'シ', 'ス', 'セ', 'ソ', 'タ', 'チ', 'ツ', 'テ', 'ト',
    'ナ', 'ニ', 'ヌ', 'ネ', 'ノ', 'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
    'マ', 'ミ', 'ム', 'メ', 'モ', 'ヤ', 'ユ', 'ヨ', 'ラ', 'リ',
    'ル', 'レ', 'ロ', 'ワ', 'ヲ', 'ン'
  ];

  useEffect(() => {
    if (isHovered) {
      // Start scrambling after delay
      timeoutRef.current = setTimeout(() => {
        const duration = 2000;
        const chars = finalText.split('');
        const settled = new Array(chars.length).fill(false);
        const startTime = Date.now();
        const settleInterval = duration / chars.length;
        let frameDelay = 50; // Start at 50ms

        intervalRef.current = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = elapsed / duration;
          
          // Speed up over time (crescendo effect)
          frameDelay = Math.max(10, 50 - (progress * 40)); // 50ms -> 10ms
          
          // Settle characters progressively
          chars.forEach((char, i) => {
            if (elapsed > settleInterval * (i + 1)) {
              settled[i] = true;
            }
          });

          // Generate scrambled text
          const scrambled = chars.map((char, i) => {
            if (settled[i]) return char;
            return katakanaChars[Math.floor(Math.random() * katakanaChars.length)];
          }).join('');

          setDisplayText(scrambled);

          // Complete
          if (elapsed >= duration) {
            setDisplayText(finalText);
            clearInterval(intervalRef.current);
          }
        }, frameDelay);
      }, delay);
    } else {
      // Reset on mouse leave
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplayText(originalText);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, originalText, finalText, delay]);

  return (
    <span 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="scramble-hover-span"
    >
      {displayText}
    </span>
  );
}
