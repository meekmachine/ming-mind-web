import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FetchConversationModal from './FetchConversationModal';

function FormPage() {
  const [text, setText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate('/response', { state: { text: text } });
  };

  const handleFetchConversation = (conversation: React.SetStateAction<string>) => {
    setText(conversation); // Set the fetched conversation in the textarea
    setShowModal(false); // Close the modal after fetching the conversation
  };

  return (
    <div className="form-wrapper">
      <h1>Multi-Modal [M]ediator for [I]nterloclative [N]oxiousness and [G]rienvences</h1>
      <textarea
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <button onClick={handleSubmit}>Submit</button>
      <button onClick={() => setShowModal(true)}>Fetch Conversation</button>
      {showModal && (
        <FetchConversationModal
          onClose={() => setShowModal(false)}
          onFetchConversation={handleFetchConversation}
        />
      )}
    </div>
  );
}

export default FormPage;
