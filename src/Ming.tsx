import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box } from '@chakra-ui/react';

const EmojiComponent = ({ isShown, setIsShown }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleClick = () => setIsShown(!isShown); // Toggle show/hide

  const slideAnimation = {
    y: isShown ? 0 : 500, // Slide in/out based on isShown
    opacity: isShown ? 0.7 : 0,
    transition: { type: 'spring', stiffness: 300 }
  };

  return (
    <Box position="fixed" right="0" bottom="0" p="4" onClick={handleClick}>
      <motion.strong
        style={{ transform: `rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`, fontSize: '2em' }}
        animate={slideAnimation}
      >
        😊
      </motion.strong>
    </Box>
  );
};

export default EmojiComponent;