import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Button,
  Spinner,
} from '@chakra-ui/react';

interface IdentifyInterlocutorsModalProps {
  isOpen: boolean;
  onIdentificationComplete: (selectedOption: string) => void;
  text: string | null;
  setUserChoicePrompt: (message: string) => void;
}

const IdentifyInterlocutorsModal: React.FC<IdentifyInterlocutorsModalProps> = ({
  isOpen,
  onIdentificationComplete,
  text,
  setUserChoicePrompt,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [participants, setParticipants] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (isOpen && text) {
      identifyInterlocutors();
    } else {
      setLoading(false);
    }
  }, [isOpen, text]);

  const identifyInterlocutors = async () => {
    try {
      const response = await axios.post('http://localhost:8000/id-interlocutors', { text });
      const args = response.data.split("||");
      if (args.length === 3) {
        setParticipants([args[0], args[1]]);
        setMessage(args[2]);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      setError('Error identifying interlocutors.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelection = (selectedOption: string) => {
    setUserChoicePrompt(`You have selected: ${selectedOption}`);
    onIdentificationComplete(selectedOption);
  };

  // Vision UI styles
  const modalStyles = {
    content: {
      backgroundColor: '#2D3748', // Dark background
      color: 'white',
      borderRadius: '8px',
    },
    button: {
      margin: '5px',
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="lg" isCentered closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent style={modalStyles.content}>
        <ModalHeader>Identify Interlocutors</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <Spinner color='blue.500' size='lg' />
          ) : error ? (
            <Text>{error}</Text>
          ) : (
            <>
              <Text>{message}</Text>
              {participants.map((participant, index) => (
                <Button key={index} colorScheme="blue" style={modalStyles.button} onClick={() => handleSelection(participant)}>
                  {participant}
                </Button>
              ))}
              <Button colorScheme="blue" style={modalStyles.button} onClick={() => handleSelection('Neither')}>
                Neither
              </Button>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default IdentifyInterlocutorsModal;
