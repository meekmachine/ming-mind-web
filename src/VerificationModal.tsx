import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

interface VerificationModalProps {
  text: string;
  isOpen: boolean;
  onClose: () => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({
  text,
  isOpen,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState({
    status: '',
    message: '',
    valid: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && text) {
      verifyConversation();
    }
  }, [isOpen, text]);

  const verifyConversation = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/is-mingable', { text });
      const isValid = response.data.valid;
      setVerificationResult({
        status: isValid ? 'success' : 'error',
        message: isValid ? 'The conversation is mingable!' : 'Error: Validation failed. Reason: Content is not MINGable',
        valid: isValid,
      });
    } catch (error) {
      setVerificationResult({
        status: 'error',
        message: 'Failed to verify the conversation.',
        valid: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoToAnalysis = () => {
    if (verificationResult.valid) {
      navigate('/response', { state: { text: text } }); // Navigate with the text to the response page
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent style={{ backgroundColor: '#4a4b52', color: 'white', borderRadius: '8px' }}>
        <ModalHeader>Verification</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <>
              <Spinner style={{ color: 'blue' }} size="lg" />
              <Text mt={4}>Verifying the conversation...</Text>
            </>
          ) : (
            <Text>{verificationResult.message}</Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleGoToAnalysis} isDisabled={!verificationResult.valid}>
            Go to Analysis
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default VerificationModal;
