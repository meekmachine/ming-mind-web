import React, { useState } from 'react';
import axios from 'axios';

const StarRating: React.FC<{ initialRating: number }> = ({ initialRating }) => {
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const handleStarClick = async (clickedRating: number) => {
    setRating(clickedRating);

    try {
      const response = await axios.post('http://localhost:8000/submit-rating', {
        rating: clickedRating,
      });

      console.log('Rating submitted successfully:', response.data);
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const handleStarHover = (star: number) => {
    setHoveredRating(star);
  };

  const handleStarLeave = () => {
    setHoveredRating(null);
  };

  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => handleStarHover(star)}
          onMouseLeave={handleStarLeave}
          style={{
            fontSize: '2rem',
            cursor: 'pointer',
            transition: 'transform 0.2s, opacity 0.2s',
            transform: `scale(${hoveredRating === star ? 1.2 : 1})`,
            opacity: hoveredRating !== null ? (hoveredRating >= star ? 1 : 0.5) : 1,
          }}
        >
          ⭐
        </span>
      ))}
      <p>Selected Rating: {rating}</p>
    </div>
  );
};

export default StarRating;
