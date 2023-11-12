import React, { useEffect, useState } from 'react';
import axios from 'axios';

function VerificationModal({ text, isOpen, onClose, onVerified }: { text: string, isOpen: boolean, onClose: () => void, onVerified: () => void }) {

    function VerificationModal({ text, isOpen, onClose, onVerified }: { text: string, isOpen: boolean, onClose: () => void, onVerified: () => void }) {
        const [loading, setLoading] = useState(false);
        const [verificationResult, setVerificationResult] = useState<{ status: string, message: string } | null>(null);

        const verifyConversation = async () => {
            setLoading(true);
            try {
                const response = await axios.post('http://localhost:8000/verify-conversation', { text });
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

        useEffect(() => {
            if (isOpen && text) {
                verifyConversation();
            }
        }, [isOpen, text]);

        if (!isOpen) return null;

        return (
            <div className="modal">
                {loading ? (
                    <p>Verifying the conversation...</p>
                ) : (
                    <div>
                        <p>{verificationResult?.message}</p>
                        <button onClick={onClose}>Close</button>
                    </div>
                )}
            </div>
        );
    }

    export default VerificationModal;
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
                    <p>{verificationResult?.message}</p>
                    <button onClick={onClose}>Close</button>
                </div>
            )}
        </div>
    );
}

export default VerificationModal;
