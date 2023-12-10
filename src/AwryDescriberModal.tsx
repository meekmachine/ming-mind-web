import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Text, Slide, Spinner, Button, useTheme } from '@chakra-ui/react';

type AwryDescriberModalProps = {
  onClose: () => void;
  conversationData: any[];
};

const AwryDescriberModal = ({ onClose, conversationData }: AwryDescriberModalProps) => {
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoOpen, setAutoOpen] = useState(false);
  const [audio] = useState(new Audio('window.mp3'));
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
    audio.play();
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
      setDescription(response.data.result);
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
    <Slide direction="bottom" in={autoOpen} style={{ zIndex: 99 }} unmountOnExit>
      {/* Rest of the modal content */}
    </Slide>
  );
};

export default AwryDescriberModal;
