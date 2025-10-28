import { useState, useEffect, useRef } from 'react';

/**
 * Hook that creates a text scrambling effect
 * @param {string} finalText - The final text to settle on (e.g., "アトリエ")
 * @param {number} duration - Duration of scrambling in ms
 * @param {boolean} trigger - When to start the animation
 */
export const useTextScramble = (finalText, duration = 2000, trigger = true) => {
  const [displayText, setDisplayText] = useState(finalText);
  const intervalRef = useRef(null);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!trigger || completedRef.current) return;

    // Katakana character pool for scrambling
    // Atorie (Atelier, it katakana Japanese)
    const katakanaChars = [
      'ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ',
      'サ', 'シ', 'ス', 'セ', 'ソ', 'タ', 'チ', 'ツ', 'テ', 'ト',
      'ナ', 'ニ', 'ヌ', 'ネ', 'ノ', 'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
      'マ', 'ミ', 'ム', 'メ', 'モ', 'ヤ', 'ユ', 'ヨ', 'ラ', 'リ',
      'ル', 'レ', 'ロ', 'ワ', 'ヲ', 'ン'
    ];

    const chars = finalText.split('');
    const settled = new Array(chars.length).fill(false);
    const startTime = Date.now();
    const settleInterval = duration / chars.length;

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      // Settle characters progressively
      chars.forEach((char, i) => {
        if (elapsed > settleInterval * (i + 1)) {
          settled[i] = true;
        }
      });

      // Generate display text
      const scrambled = chars.map((char, i) => {
        if (settled[i]) {
          return char;
        }
        return katakanaChars[Math.floor(Math.random() * katakanaChars.length)];
      }).join('');

      setDisplayText(scrambled);

      // Complete animation
      if (progress >= 1) {
        setDisplayText(finalText);
        clearInterval(intervalRef.current);
        completedRef.current = true;
      }
    }, 50);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [finalText, duration, trigger]);

  return displayText;
};

/**
 * Component that displays scrambling text
 */
export const ScrambleText = ({ 
  finalText, 
  duration = 2000, 
  trigger = true,
  className = '',
  style = {}
}) => {
  const displayText = useTextScramble(finalText, duration, trigger);
  
  return (
    <span className={className} style={style}>
      {displayText}
    </span>
  );
};
