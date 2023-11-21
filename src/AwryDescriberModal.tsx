import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Text, Slide, Spinner, Button, useTheme } from '@chakra-ui/react';

type AwryDescriberModalProps = {
  isOpen: boolean;
  onClose: () => void;
  conversationData: any[];
};

const AwryDescriberModal = ({ isOpen, onClose, conversationData }: AwryDescriberModalProps) => {
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [audio] = useState(new Audio('window.mp3'));
  const theme = useTheme();
  const [shouldSlideUp, setShouldSlideUp] = useState(false);

  useEffect(() => {
    if (isOpen && conversationData) {
      setLoading(true);
      fetchDescription();
    }
  }, [isOpen, conversationData]);

  useEffect(() => {
    if (description !== null) {
      setShouldSlideUp(true);
      playAudio(); // Play audio after description is set
    }
  }, [description]);

  const playAudio = () => {
    audio.currentTime = 0;
    audio.play();
  };

  const formatConversation = (conversationData: any[]) => {
    return conversationData.map((msg) => `${msg.speaker}: ${msg.text}`).join('\n');
  };

  const fetchDescription = async () => {
    try {
      const formattedData = formatConversation(conversationData);
      const response = await axios.post('http://localhost:8000/awry-describer', { data: formattedData });
      setDescription(response.data);
      setLoading(false);
    } catch (error) {
      setDescription("Failed to fetch the description.");
      setLoading(false);
    }
  };

  const closeAwryModal = () => {
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Slide direction="bottom" in={shouldSlideUp} style={{ zIndex: 99 }} unmountOnExit>
      <Box
        w="100vw"
        h="50vh"
        bg={theme.colors.gray[800]}
        color={theme.colors.gray[50]}
        p={4}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent={loading ? "center" : "start"}
        overflowY="auto"
        transition="all 0.5s ease-in-out"
      >
        {loading ? (
          <>
            <Spinner color="blue.500" />
            <Text>Loading description...</Text>
          </>
        ) : (
          <Box p={4} w="100%" maxW="600px">
            <Text fontSize="lg" mb={2}>Overview</Text>
            <Text mb={4}>{description}</Text>
            <Button colorScheme="blue" onClick={closeAwryModal}>
              Close
            </Button>
          </Box>
        )}
      </Box>
    </Slide>
  );
};

export default AwryDescriberModal;
