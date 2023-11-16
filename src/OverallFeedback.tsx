import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface OverallFeedbackProps {
  interlocutor: string;
  text: string;
}

interface FeedbackResponse {
  message: string;
}

const OverallFeedback: React.FC<OverallFeedbackProps> = ({ interlocutor, text }) => {
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.post('http://localhost:8000/feedback', { interlocutor, text });
        setFeedback(response.data);
      } catch (error) {
        setError('Failed to get feedback.');
      }
    };

    if (interlocutor && text) {
      fetchFeedback();
    }
  }, [interlocutor, text]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!feedback) {
    return <p>Loading feedback...</p>;
  }

  return (
    <div>
      <h2>Feedback</h2>
      <p>{feedback.message}</p>
    </div>
  );
};

export default OverallFeedback;
