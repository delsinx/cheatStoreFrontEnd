import { useState, useEffect } from 'react';

const TypewriterText = ({
  text,
  className = '',
  delay = 1000,
  speed = 250,
  showCursorDuringTyping = true,
  cursorColor = null // Nova prop para a cor do cursor
}) => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    // Aguarda o delay antes de começar a digitação
    const startDelay = setTimeout(() => {
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTypingComplete(true);
        }
      }, speed);

      return () => clearInterval(typingInterval);
    }, delay);

    return () => clearTimeout(startDelay);
  }, [text, delay, speed]);

  // Cursor pisca continuamente
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <span className={`typewriter-text ${className}`}>
      {displayText}
      {(showCursorDuringTyping || isTypingComplete) && (
        <span
          className={`typewriter-cursor ${showCursor ? 'opacity-100' : 'opacity-0'}`}
          style={{ transition: 'opacity 0.1s', color: cursorColor || undefined }}
        >
          |
        </span>
      )}
    </span>
  );
};

export default TypewriterText;

