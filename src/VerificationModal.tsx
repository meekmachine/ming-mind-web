import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface VerificationModalProps {
    text: string;
    isOpen: boolean;
    onClose: () => void;
    onVerified: () => void;
}
const VerificationModal: React.FC<VerificationModalProps> = ({ text, isOpen, onClose, onVerified }) => {
    const [loading, setLoading] = useState(false);
    const [verificationResult, setVerificationResult] = useState({ status: '', message: '' });

    useEffect(() => {
        if (isOpen && text) {
            verifyConversation();
        }
    }, [isOpen, text]);

  const verifyConversation = async () => {
    setLoading(true);
    setVerificationResult({ status: '', message: '' }); // Reset verification result
    try {
      const response = await axios.post('http://localhost:8000/is-mingable', { text });
      setVerificationResult(response.data);
      if (response.data.status === 'success') {
        onVerified();
      }
    } catch (error) {
      console.error('Error verifying conversation:', error);
      setVerificationResult({ status: 'error', message: 'Failed to verify the conversation.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      {loading ? (
        <p>Verifying the conversation...</p>
      ) : (
        <div>
          <p>{verificationResult.message}</p>
          <button onClick={onClose}>Close</button>
        </div>
      )}
    </div>
  );
}

export default VerificationModal;
