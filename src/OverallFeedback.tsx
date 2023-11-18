import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface OverallFeedbackProps {
  interlocutor: string;
  text: string;
  sessionId: string; // Include session ID
}

interface FeedbackResponse { // Define this interface
  message: string;
}

const OverallFeedback: React.FC<OverallFeedbackProps> = ({ interlocutor, text, sessionId }) => {
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.post('http://localhost:8000/feedback', { interlocutor, text, session_id: sessionId });
        setFeedback(response.data.result);
      } catch (error) {
        setError('Failed to get feedback.');
      }
    };

    if (interlocutor && text && sessionId) {
      fetchFeedback();
    }
  }, [interlocutor, text, sessionId]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!feedback) {
    return <p>Loading feedback...</p>;
  }

  return (
    <div>
      <h2>Feedback</h2>
      <p>{feedback as any as string}</p>
    </div>
  );
};

export default OverallFeedback;
