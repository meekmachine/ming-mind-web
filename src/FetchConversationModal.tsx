import React, { useState } from 'react';
import axios from 'axios';

type FetchConversationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onFetchConversation: (conversation: string) => void;
};

function FetchConversationModal({ isOpen, onClose, onFetchConversation }: FetchConversationModalProps) {
  const [minToxicity, setMinToxicity] = useState(0);
  const [minMessages, setMinMessages] = useState(0);
  const [hasPersonalAttack, setHasPersonalAttack] = useState(false);

  const fetchConversation = async () => {
    try {
      const response = await axios.get('http://localhost:8000/get-convo', {
        params: {
          'min-toxicity': minToxicity,
          'min-messages': minMessages,
          'has-personal-attack': hasPersonalAttack
        }
      });
      const formattedConversation = formatConversation(response.data);
      onFetchConversation(formattedConversation);
    } catch (error) {
      console.error('Error fetching conversation:', error);
    }
  };

  const formatConversation = (conversationData: any[]) => {
    conversationData.sort((a, b) => a.timestamp - b.timestamp);
    return conversationData.map(msg => `${msg.speaker}: ${msg.text}`).join('\n\n');
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <div>
        <label>Min Toxicity: {minToxicity}</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={minToxicity}
          onChange={(e) => setMinToxicity(parseFloat(e.target.value))}
        />
      </div>
      <div>
        <label>Min Messages: {minMessages}</label>
        <input
          type="range"
          min="0"
          max="50"
          step="1"
          value={minMessages}
          onChange={(e) => setMinMessages(parseInt(e.target.value))}
        />
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={hasPersonalAttack}
            onChange={(e) => setHasPersonalAttack(e.target.checked)}
          />
          Has Personal Attack
        </label>
      </div>
      <button onClick={fetchConversation}>Fetch Conversation</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default FetchConversationModal;
