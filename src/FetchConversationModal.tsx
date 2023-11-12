import React from 'react';
import axios from 'axios';

type Props = {
  onClose: () => void;
  onFetchConversation: (conversation: string) => void;
};

function FetchConversationModal({ onClose, onFetchConversation }: Props) {
  const fetchConversation = async () => {
    try {
      const response = await axios.get('http://localhost:8000/get-convo');
      const formattedConversation = formatConversation(response.data);
      onFetchConversation(formattedConversation);
    } catch (error) {
      console.error('Error fetching conversation:', error);
    }
  };

  const formatConversation = (conversationData: any[]) => {
    return conversationData.map(msg => `${msg.speaker}: ${msg.text}`).join('\n');
  };

  return (
    <div className="modal">
      <button onClick={fetchConversation}>Fetch Conversation</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default FetchConversationModal;
