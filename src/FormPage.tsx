import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FetchConversationModal from './FetchConversationModal';
import VerificationModal from './VerificationModal';
import AwryDescriberModal from './AwryDescriberModal'; // Import the AwryDescriberModal component

function FormPage() {
  const [text, setText] = useState('');
  const [conversationJson, setConversationJson] = useState(null); // State to store the JSON response
  const [showFetchModal, setShowFetchModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showDescriberModal, setShowDescriberModal] = useState(false); // State to control the AwryDescriberModal
  const navigate = useNavigate();

  const handleSubmit = () => {
    setShowVerificationModal(true);
  };

  const handleFetchConversation = (conversationResponse: { text: string, json: any }) => {
    setText(conversationResponse.text); // Set the text for the textarea
    setConversationJson(conversationResponse.json); // Store the JSON response
    setShowFetchModal(false);
    setShowDescriberModal(true); // Open the AwryDescriberModal
  };

  const handleVerified = () => {
    navigate('/response', { state: { text: text } });
  };

  return (
    <div className="form-wrapper">
      <h1>Multi-Modal [M]ediator for [I]nterlocutive [N]oxiousness and [G]rievances</h1>
      <textarea
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <button onClick={handleSubmit}>Submit</button>
      <button onClick={() => setShowFetchModal(true)}>Fetch Conversation</button>

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

<AwryDescriberModal
  conversationData={conversationJson} // Changed from json to conversationData
  isOpen={showDescriberModal}
  onClose={() => setShowDescriberModal(false)}
/>
    </div>
  );
}

export default FormPage;
