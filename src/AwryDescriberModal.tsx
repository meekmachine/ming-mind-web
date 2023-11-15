import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Spinner,
  Text,
  Button,
  useColorModeValue,
  Slide,
} from '@chakra-ui/react';

type AwryDescriberModalProps = {
  isOpen: boolean;
  onClose: () => void;
  conversationData: any[];
};

const AwryDescriberModal = ({
  isOpen,
  onClose,
  conversationData,
}: AwryDescriberModalProps) => {
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audio] = useState(new Audio('window.mp3'));

  // Use useColorModeValue to set colors
  const primaryColor = useColorModeValue('primary.600', 'primary.200');
  const errorColor = 'red.500';

  useEffect(() => {
    if (isOpen && conversationData) {
      fetchDescription();
    }
  }, [isOpen, conversationData]);

  useEffect(() => {
    if (isOpen) {
      playAudio(0); // Play the audio from 0s when modal is opened
    } else {
      playAudio(2); // Play the audio from 2s when modal is closed
    }
  }, [isOpen]);

  const formatConversation = (conversationData: any[]) => {
    conversationData.sort((a, b) => a.timestamp - b.timestamp);
    return conversationData
      .map((msg) => `${msg.speaker}: ${msg.text}`)
      .join('\n\n');
  };

  const fetchDescription = async () => {
    setLoading(true);
    setError(null);
    let data = formatConversation(conversationData);
    try {
      const response = await axios.post(
        'http://localhost:8000/awry-describer',
        { data },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setLoading(false);
      setDescription(response.data);
    } catch (err) {
      if (err instanceof Error && 'message' in err) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      setLoading(false);
    }
  };

  const playAudio = (startTime: number) => {
    audio.currentTime = startTime;
    audio.play();
  };

  const modalStyle: React.CSSProperties = {
    position: 'fixed',
    top: isOpen ? '0' : '100%',
    left: '0',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    transition: 'top 2s', // Use CSS transition for animation
    opacity: isOpen ? 1 : 0,
    zIndex: isOpen ? 999 : -1,
  };

  const contentStyle: React.CSSProperties = {
    background: 'gray.800',
    padding: '1rem',
    borderRadius: 'md',
    boxShadow: 'lg',
    width: '100%',
    maxWidth: '100%',
    transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
    transition: 'transform 2s', // Slide up/down transition
  };

  return (
    <div style={modalStyle}>
      <div style={contentStyle}>
        <Text color={primaryColor} fontSize="xl" fontWeight="bold" mb={4}>
          Awry Description
        </Text>
        {loading ? (
          <Box textAlign="center">
            <Spinner color={primaryColor} />
            <Text>Loading description...</Text>
          </Box>
        ) : error ? (
          <Text color={errorColor}>Error: {error}</Text>
        ) : (
          <Text>
            {description ? description : 'No description available'}
          </Text>
        )}
        <Button
          colorScheme="blue"
          onClick={() => {
            onClose();
          }}
          mt={4}
          alignSelf="flex-end"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default AwryDescriberModal;
