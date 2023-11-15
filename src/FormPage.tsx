import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Textarea,
  VStack,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import FetchConversationModal from './FetchConversationModal';
import VerificationModal from './VerificationModal';
import AwryDescriberModal from './AwryDescriberModal';

function FormPage() {
  const [text, setText] = useState('');
  const [conversationJson, setConversationJson] = useState<any>(null); // Replace 'any' with the appropriate type
  const [showFetchModal, setShowFetchModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showDescriberModal, setShowDescriberModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    setShowVerificationModal(true);
  };

  const handleFetchConversation = (conversationResponse: any) => {
    setText(conversationResponse.text);
    setConversationJson(conversationResponse.json);
    setShowFetchModal(false);
    setShowDescriberModal(true);
  };

  const handleVerified = () => {
    navigate('/response', { state: { text } });
  };

  const bgColor = useColorModeValue('gray.900', 'gray.800'); // Darker background color

  const formStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    height: '100vh', // Take up full viewport height
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const modalStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: showDescriberModal ? '0' : '-50%',
    left: '0',
    width: '100%',
    height: '50%',
    transition: 'bottom 2s ease-in-out',
  };

  return (
    <Box style={formStyle}>
      <VStack spacing={4}>
        <Textarea
          placeholder="Enter your text here"
          value={text}
          onChange={(e) => setText(e.target.value)}
          size="lg"
          height="100%" // Take up full height of the component
          width="80vw" // Set the width to 80% of the viewport width
          bg="gray.700" // Darker background for the textarea
        />
        <HStack>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Submit
          </Button>
          <Button colorScheme="green" onClick={() => setShowFetchModal(true)}>
            Fetch Conversation
          </Button>
        </HStack>
      </VStack>

      <FetchConversationModal
        isOpen={showFetchModal}
        onClose={() => setShowFetchModal(false)}
        onFetchConversation={handleFetchConversation}
      />

      <VerificationModal
        text={text}
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onVerified={handleVerified}
      />

      <div style={modalStyle}>
        <AwryDescriberModal
          conversationData={conversationJson}
          isOpen={showDescriberModal}
          onClose={() => setShowDescriberModal(false)}
        />
      </div>
    </Box>
  );
}

export default FormPage;
