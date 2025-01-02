import React, { useState, useEffect } from 'react';

const arabicLetters = [
  'ا', 'آ', 'أ', 'إ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 
  'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 
  'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 
  'ي', 'ى', 'ة', 'ؤ', 'ئ', '١','٢' ,"٣", "٤", "٥", "٦", "٧", "٨", "٩"];

const FallingArabicLetters = () => {
  const [letters, setLetters] = useState([]);

  useEffect(() => {
    const generateLetters = () => {
      const newLetters = Array.from({ length: 150 }, (_, index) => ({
        id: index,
        letter: arabicLetters[Math.floor(Math.random() * arabicLetters.length)],
        left: Math.random() * 100,
        top: -50,
        animationDuration: Math.random() * 5 + 5, // 5-15 seconds
        size: Math.random() * 30 + 15, // 15-45px
        delay: Math.random() * 10, // 0-10 seconds delay
        opacity: Math.random() * 0.3 + 0.1, // 0.1-0.4 opacity
        velocity: Math.random() * 0.5 + 0.5, // 0.5-1 speed multiplier
        rotationSpeed: (Math.random() - 0.5) * 2 // Random rotation direction and speed
      }));
      setLetters(newLetters);
    };

    generateLetters();
    const handleResize = () => generateLetters();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {letters.map((letter) => (
        <div
          key={letter.id}
          className="absolute text-gray-500 select-none transition-all duration-300 ease-in-out hover:scale-110"
          style={{
            left: `${letter.left}%`,
            top: `${letter.top}px`,
            fontSize: `${letter.size}px`,
            opacity: letter.opacity,
            animation: `fall ${letter.animationDuration / letter.velocity}s linear infinite`,
            transform: `scale(${letter.velocity})`,
            transformOrigin: 'center center'
          }}
        >
          {letter.letter}
        </div>
      ))}
      <style jsx global>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          100% {
            transform: translateY(150vh) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default FallingArabicLetters;