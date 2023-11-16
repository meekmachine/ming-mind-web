import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, VStack, HStack } from '@chakra-ui/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import FetchConversationModal from './FetchConversationModal';
import VerificationModal from './VerificationModal';
import AwryDescriberModal from './AwryDescriberModal';
import { useNavigation } from 'react-router-dom'; // Import useHistory

function FormPage() {
  const [text, setText] = useState('');
  const [conversationJson, setConversationJson] = useState<any>(null);
  const [showFetchModal, setShowFetchModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showDescriberModal, setShowDescriberModal] = useState(false);
  const quillRef = useRef(null);
  const navigate = useNavigate(); // Create the history object

  const handleSubmit = () => {
    setShowVerificationModal(true);
  };

  const handleFetchConversation = (conversationResponse: any) => {
    setText(conversationResponse.text);
    setConversationJson(conversationResponse.json);
    setShowFetchModal(false);
    setShowDescriberModal(true);
  };

  const handleVerificationComplete = (valid: boolean) => {
    setShowVerificationModal(false);
    if (valid) {
      navigate('/response', { state: { anlysis: text } }); // Navigate with the text state
    }
  };

  // Custom styles for ReactQuill editor
  const customStyles = {
    '.quill': { 
      border: 'none',
      fontFamily: "'Press Start 2P', monospace", // Apply the pixel font
    },
    '.ql-editor': {
      height: 'calc(100vh - 50px)', // Full height minus some space for buttons
      backgroundColor: '#4a4b52', // Background color
      color: 'white', // Text color
    },
    '.ql-toolbar': {
      display: 'none', // Hide the toolbar
    }
  };

  return (
    <Box
      w="100vw"
      h="100vh"
      bg="#4a4b52"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <VStack spacing={4} w="100%" h="100%">
        <Box sx={customStyles}>
          <ReactQuill 
            ref={quillRef}
            value={text}
            onChange={setText}
            readOnly={false}
            theme="snow"
          />
        </Box>
        <HStack position="absolute" bottom="20px">
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
      />

      <AwryDescriberModal
        isOpen={showDescriberModal}
        onClose={() => setShowDescriberModal(false)}
        conversationData={conversationJson}
      />
    </Box>
  );
}

export default FormPage;
