import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FetchConversationModal from './FetchConversationModal';
import VerificationModal from './VerificationModal'; // Import the VerificationModal component

function FormPage() {
  const [text, setText] = useState('');
  const [showFetchModal, setShowFetchModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    setShowVerificationModal(true); // Show verification modal on submit
  };

  const handleFetchConversation = (conversation: React.SetStateAction<string>) => {
    setText(conversation); // Set the fetched conversation in the textarea
    setShowFetchModal(false); // Close the fetch modal
  };

  const handleVerified = () => {
    navigate('/response', { state: { text: text } }); // Navigate on successful verification
  };

  return (
    <div className="form-wrapper">
      <h1>Multi-Modal [M]ediator for [I]nterloclative [N]oxiousness and [G]rienvences</h1>
      <textarea
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <button onClick={handleSubmit}>Submit</button>
      <button onClick={() => setShowFetchModal(true)}>Fetch Conversation</button>

      {/* Fetch Conversation Modal */}
      <FetchConversationModal
        isOpen={showFetchModal}
        onClose={() => setShowFetchModal(false)}
        onFetchConversation={handleFetchConversation}
      />

      {/* Verification Modal */}
      <VerificationModal
        text={text}
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onVerified={handleVerified}
      />
    </div>
  );
}

export default FormPage;
