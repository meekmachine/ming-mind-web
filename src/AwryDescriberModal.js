import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AwryDescriberModal = ({ isOpen, onClose, conversationData }) => {
    const [description, setDescription] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && conversationData) {
            fetchDescription();
        }
    }, [isOpen, conversationData]);

    const formatConversation = (conversationData) => {
        conversationData.sort((a, b) => a.timestamp - b.timestamp);
        return conversationData.map(msg => `${msg.speaker}: ${msg.text}`).join('\n\n');
    };


  const fetchDescription = async () => {
    setLoading(true);
    setError(null);
    let data = ` ${formatConversation(conversationData) }`
    try {
      const response = await axios.post('http://localhost:8000/awry-describer', { data }, { headers: {
        'Content-Type': 'application/json'
      }});
      setDescription(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      {loading ? (
        <p>Loading description...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div>
          <h2>Awry Description</h2>
          <p>{description ? description : 'No description available'}</p>
          <button onClick={onClose}>Close</button>
        </div>
      )}
    </div>
  );
};

export default AwryDescriberModal;
