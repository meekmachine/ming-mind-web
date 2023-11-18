import React, { useState, useEffect, useRef } from 'react';
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
  setSessionId: (id: string) => void;
}

const IdentifyInterlocutorsModal: React.FC<IdentifyInterlocutorsModalProps> = ({
  isOpen,
  onIdentificationComplete,
  text,
  setUserChoicePrompt,
  setSessionId,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [participants, setParticipants] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');
  const requestInProgress = useRef(false);

  useEffect(() => {
    if (isOpen && text && !requestInProgress.current) {
      requestInProgress.current = true;
      setLoading(true);

      const identifyInterlocutors = async () => {
        try {
          const response = await axios.post('http://localhost:8000/id-interlocutors', { text });
          const args = response.data.result.split("||");
          if (args.length === 3) {
            setParticipants([args[0], args[1]]);
            setMessage(args[2]);
            setSessionId(response.data.session_id);
          } else {
            throw new Error('Invalid data format');
          }
        } catch (error) {
          setError('Error identifying interlocutors.');
        } finally {
          setLoading(false);
          requestInProgress.current = false;
        }
      };

      identifyInterlocutors();
    }

    return () => {
      setLoading(false);
      setError(null);
      setParticipants([]);
      setMessage('');
      requestInProgress.current = false;
    };
  }, [isOpen, text, setSessionId]);

  const handleSelection = (selectedOption: string) => {
    setUserChoicePrompt(`You have selected: ${selectedOption}`);
    onIdentificationComplete(selectedOption);
  };

  const modalStyles = {
    content: {
      backgroundColor: '#2D3748',
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
