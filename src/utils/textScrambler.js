// Text scrambling utilities for button effects

const SCRAMBLE_CHARS = "!@#$%^&*()_+-={}[]|;:,.<>?/~`0123456789";

/**
 * Scrambles text by replacing characters with random symbols
 * @param {string} text - The text to scramble
 * @returns {string} - The scrambled text
 */
export const scrambleText = (text) => {
  return text
    .split("")
    .map((char) => {
      if (char === " ") return " ";
      return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
    })
    .join("");
};

/**
 * Returns a random code snippet for display
 * @returns {string} - A random code snippet
 */
export const getScrambledText = () => {
  const codeSnippets = [
    "func(x)",
    "{id: 42}",
    "x => y",
    "[...arr]",
    "async/await",
    "0x1A2B",
    "{ ...obj }",
    "return π",
  ];

  return codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
};
