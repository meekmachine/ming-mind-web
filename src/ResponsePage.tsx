import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Text, Container } from '@chakra-ui/react'; // Importing Container from Chakra UI
import IdentifyInterlocutorsModal from './IdentifyInterlocutorsModal';
import OverallFeedback from './OverallFeedback';

function ResponsePage() {
  const location = useLocation();
  const state = location.state as { text?: string };
  const [convo, setConvo] = useState<string | null>(null);
  const [selectedInterlocutor, setSelectedInterlocutor] = useState<string | null>(null);
  const [userChoicePrompt, setUserChoicePrompt] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    if (state?.text) {
      setConvo(state.text);
    }
  }, [state]);

  const handleIdentificationComplete = (selectedOption: string) => {
    setSelectedInterlocutor(selectedOption);
  };

  // Vision UI styles
  const visionUIStyles = {
    pageContainer: {
      backgroundColor: '#1A202C', // Darker background color
      minHeight: '100vh', // Full height
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    contentContainer: {
      backgroundColor: '#2D3748', // Content background color
      color: '#fff', // White text color
      padding: '20px',
      borderRadius: '8px',
      margin: '20px',
      width: '100%', // Standard width
      maxWidth: '600px', // Max width for larger screens
    },
    header: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '20px',
      textAlign: 'center',
    },
  };
  return (
    <Box style={visionUIStyles.pageContainer}>
      <Container style={visionUIStyles.contentContainer}>
        <Text>Conversation Analysis</Text>
        <Text>{userChoicePrompt}</Text>
        {!selectedInterlocutor && convo && (
          <IdentifyInterlocutorsModal
            text={convo}
            isOpen={!selectedInterlocutor}
            onIdentificationComplete={handleIdentificationComplete}
            setUserChoicePrompt={setUserChoicePrompt}
            setSessionId={setSessionId}
          />
        )}
        {selectedInterlocutor && convo && (
          <OverallFeedback 
            interlocutor={selectedInterlocutor} 
            text={convo}
            sessionId={sessionId}
          />
        )}
      </Container>
    </Box>
  );
}

export default ResponsePage;