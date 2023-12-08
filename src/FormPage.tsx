import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, VStack, HStack } from '@chakra-ui/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import FetchConversationModal from './FetchConversationModal';
import VerificationModal from './VerificationModal';
import AwryDescriberModal from './AwryDescriberModal';
import useTypingEffect from './TypingEffect'; // Import the TypingEffect component
import FetchConversationModalClassic from './FetchConversationModalClassic';


function FormPage() {
  const [plainText, setPlainText] = useState('');
  const [formattedText, setFormattedText] = useState('');
  const [conversationJson, setConversationJson] = useState<any>(null);
  const [showFetchModal, setShowFetchModal] = useState(false);
  const [showClassicModal, setShowClassicModal] = useState(false); // New state
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showDescriberModal, setShowDescriberModal] = useState(false);
  const quillRef = useRef(null);
  const navigate = useNavigate();

  // Function to strip HTML tags
  const stripHtml = (htmlString: string) => {
    const temporalDivElement = document.createElement("div");
    temporalDivElement.innerHTML = htmlString;
    return temporalDivElement.textContent || temporalDivElement.innerText || "";
  };


  const handleEditorChange = (content: string) => {
    setFormattedText(content);
    setPlainText(prevState => {
      const plainTextContent = stripHtml(content);
      return plainTextContent;
    });
  };

  const handleSubmit = () => {
    setShowVerificationModal(true);
  };

  const handleFetchConversation = (conversationResponse: { plainText: React.SetStateAction<string>; formattedText: React.SetStateAction<string>; json: any; }) => {
    setPlainText(conversationResponse.plainText);
    setFormattedText(conversationResponse.formattedText);
    setConversationJson(conversationResponse.json);
    setShowFetchModal(false);
    setShowDescriberModal(true);
  };

  const customStyles = {
    '.quill': { border: 'none', fontFamily: "'Press Start 2P', monospace" },
    '.ql-editor': {
      height: 'calc(100vh - 50px)',
      backgroundColor: '#4a4b52',
      color: 'white',
    },
    '.ql-toolbar': { display: 'none' }
  };
  useTypingEffect(setFormattedText, formattedText.length);

  return (
    <Box w="100vw" h="100vh" bg="#4a4b52" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <VStack spacing={4} w="100%" h="100%">
        <Box sx={customStyles} w="100%" h="100%">
          <ReactQuill ref={quillRef} value={formattedText} onChange={handleEditorChange} readOnly={false} theme="snow" />
        </Box>
        <HStack position="absolute" bottom="20px">
          <Button colorScheme="green" onClick={handleSubmit}>MING this convo!</Button>
          <Button colorScheme="purple" onClick={() => setShowFetchModal(true)}>Enter the Noxious Nebula!</Button>
          <Button colorScheme="teal" onClick={() => setShowClassicModal(true)}>Load Random Convo from Corpus</Button> {/* New button */}
        </HStack>
      </VStack>
      <FetchConversationModal isOpen={showFetchModal} onClose={() => setShowFetchModal(false)} onFetchConversation={handleFetchConversation} />
      <FetchConversationModalClassic isOpen={showClassicModal} onClose={() => setShowClassicModal(false)} onFetchConversation={handleFetchConversation} /> {/* New modal */}
      <VerificationModal plainText={plainText} isOpen={showVerificationModal} onClose={() => setShowVerificationModal(false)} />
      <AwryDescriberModal isOpen={showDescriberModal} onClose={() => setShowDescriberModal(false)} conversationData={conversationJson} />
    </Box>
  );
}

export default FormPage;
