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
  plainText: string;
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;  // New prop for session ID
}

const VerificationModal: React.FC<VerificationModalProps> = ({
  plainText,
  isOpen,
  onClose,
  sessionId,  // Use the session ID in the component
}) => {
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState({
    status: '',
    message: '',
    valid: false,
  });
  const navigate = useNavigate();

  const verifyConversation = async () => {
    setLoading(true);
    try {
      // Include session ID in the request if available
      const response = await axios.post('http://localhost:8000/is-mingable', { 
        text: plainText, 
        session_id: sessionId 
      });
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

  useEffect(() => {
    if (isOpen && plainText) {
      verifyConversation();
    }
  }, [isOpen, plainText]);

  const handleGoToAnalysis = () => {
    if (verificationResult.valid) {
      navigate('/response', { 
        state: { text: plainText, session_id: sessionId } // Pass session ID to the response page
      });
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
