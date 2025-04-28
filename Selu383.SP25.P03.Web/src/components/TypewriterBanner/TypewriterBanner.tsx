import React, { useEffect, useState } from "react";
import "./TypewriterBanner.css";

const TypewriterBanner: React.FC = () => {
  const phrases = ["Welcome to Lion's Den", "Find Your Next Seat"];
  const [currentPhrase, setCurrentPhrase] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const typeAnimation = () => {
      const current = phraseIndex % phrases.length;
      const fullPhrase = phrases[current];

      const updatedText = isDeleting
        ? fullPhrase.substring(0, currentPhrase.length - 1)
        : fullPhrase.substring(0, currentPhrase.length + 1);

      setCurrentPhrase(updatedText);

      if (!isDeleting && updatedText === fullPhrase) {
        setTimeout(() => setIsDeleting(true), 1500);
        setTypingSpeed(150);
      } else if (isDeleting && updatedText === "") {
        setIsDeleting(false);
        setPhraseIndex(phraseIndex + 1);
        setTypingSpeed(150);
      } else {
        setTypingSpeed(isDeleting ? 100 : 150);
      }
    };

    const timer = setTimeout(typeAnimation, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentPhrase, isDeleting, phraseIndex, phrases, typingSpeed]);

  return (
    <div className="typewriter-banner">
      <div className="logo-container">
        <i className="movie-icon">🎬</i>
      </div>
      <div className="typewriter-container">
        <span className="typewriter-text">{currentPhrase}</span>
        <span className="cursor"></span>
      </div>
    </div>
  );
};

export default TypewriterBanner;
