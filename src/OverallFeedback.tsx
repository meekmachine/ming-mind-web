import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Text, Spinner, Alert, AlertIcon, AlertDescription } from '@chakra-ui/react';

interface OverallFeedbackProps {
  interlocutor: string | null;
  text: string | null;
  factors: string[]; // New prop
}

interface FeedbackResponse {
  message: string;
}

const OverallFeedback: React.FC<OverallFeedbackProps> = ({ interlocutor, text, factors }) => {
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchFeedback = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post('http://localhost:8000/feedback', {
          interlocutor: interlocutor,
          text: text,
          factor1: factors[0],
          factor2: factors[1] // Using the factors prop
        });
        const responseData = response.data.result;
        if (responseData.length >= 3) {
          setFeedback({ message: responseData });
        } else {
          throw new Error('Invalid feedback data format');
        }
      } catch (error) {
        setError('Failed to get feedback.');
      }
      setIsLoading(false);
    };

    if (interlocutor && text && factors.length) {
      fetchFeedback();
    }
  }, [interlocutor, text, factors]);

  return (
    <Box
      bg="#2D3748"
      color="#fff"
      p={4}
      borderRadius="lg"
      my={4}
    >
      {isLoading ? (
        <Spinner color="blue.500" />
      ) : error ? (
        <Alert status="error">
          <AlertIcon />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <>
          <Text fontSize="xl" fontWeight="bold" mb={4}>Feedback</Text>
          {feedback && feedback.message.split('\n')
            .filter(line => line.trim() !== '')
            .map((line, index) => <Text key={index}>{line}</Text>)
          }
        </>
      )}
    </Box>
  );
};

export default OverallFeedback;
