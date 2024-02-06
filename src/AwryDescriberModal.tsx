import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Text, Slide, Spinner, Button, IconButton, VStack, useTheme, CloseButton } from '@chakra-ui/react';

type AwryDescriberModalProps = {
  onClose: () => void;
  conversationData: any[];
};

const AwryDescriberModal = ({ onClose, conversationData }: AwryDescriberModalProps) => {
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoOpen, setAutoOpen] = useState(false);
  // Correctly reference the audio file from the public directory
  const [audio] = useState(new Audio(process.env.PUBLIC_URL + '/Window.mp3'));
  const theme = useTheme();

  useEffect(() => {
    if (conversationData.length > 0) {
      setLoading(true);
      fetchDescription();
    }
  }, [conversationData]);

  useEffect(() => {
    if (autoOpen) {
      playAudio(0, 1800); // Play audio for 1800ms when the modal opens
    }
  }, [autoOpen]);

  const playAudio = (start: number, duration: number) => {
    audio.currentTime = start;
    audio.play().catch((error) => console.error("Audio play error:", error));
    if (duration) {
      setTimeout(() => {
        audio.pause();
      }, duration);
    }
  };

  const fetchDescription = async () => {
    try {
      const formattedData = formatConversation(conversationData);
      const response = await axios.post('http://localhost:8000/awry-describer', { text: formattedData });
      if (typeof response.data === 'string') {
        setDescription(response.data);
      } else {
        setDescription(JSON.stringify(response.data));
      }
      setLoading(false);
      setAutoOpen(true);
    } catch (error) {
      setDescription("Failed to fetch the description.");
      setLoading(false);
    }
  };

  const formatConversation = (conversationData: any[]) => {
    return conversationData.map((msg) => `${msg.speaker}: ${msg.text}`).join('\n');
  };

  const closeAwryModal = () => {
    onClose();
    playAudio(2.1, 0); // Play audio from 2.1s when closing the modal
    setAutoOpen(false);
  };

  return (
    <Slide direction="bottom" in={autoOpen} style={{ zIndex: 10 }} unmountOnExit>
      <Box
        width="100%"
        minHeight="200px"
        bg="#4a4b52"
        p={4}
        boxShadow="md"
        margin="0 auto"
        display="flex"
        flexDirection="column"
        position="relative"
      >
        <CloseButton
          aria-label="Close modal"
          size="sm"
          position="absolute"
          right="8px"
          top="8px"
          onClick={closeAwryModal}
        />
        <VStack spacing={4} overflowY="auto" maxHeight="300px" width="100%">
          {loading ? (
            <Spinner />
          ) : (
            <Text fontSize="md" color="white">{description}</Text>
          )}
        </VStack>
      </Box>
    </Slide>
  );
};

export default AwryDescriberModal;
