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
        try {
            const response = await axios.post('http://localhost:8000/is-mingable', { text });
            if (response.data.valid === 1) {
              setVerificationResult({ status: 'success', message: 'The conversation is mingable!' });
                onVerified();
            } else {
              setVerificationResult({ status: 'error', message: 'Error: Validation failed. Reason: Content is not MINGable' });
            }
        } catch (error) {
            console.error('Error verifying conversation:', error);
            setVerificationResult({ status: 'error', message: 'Failed to verify the conversation.' });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setVerificationResult({ status: '', message: '' }); // Reset verification result on close
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            {loading ? (
                <p>Verifying the conversation...</p>
            ) : (
                <div>
                    <p>{verificationResult.message}</p>
                    <button onClick={handleClose}>Close</button>
                </div>
            )}
        </div>
    );
}

export default VerificationModal;
