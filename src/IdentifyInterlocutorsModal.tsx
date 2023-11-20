import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Text,
    Button,
    Spinner,
    useColorModeValue,
    Alert,
    AlertIcon
} from '@chakra-ui/react';

interface IdentifyInterlocutorsModalProps {
    isOpen: boolean;
    onIdentificationComplete: (selectedOption: string, participants: string[], factors: string[]) => void;
    text: string | null;
    setUserChoicePrompt: (message: string) => void;
}

const IdentifyInterlocutorsModal: React.FC<IdentifyInterlocutorsModalProps> = ({
    isOpen,
    onIdentificationComplete,
    text,
    setUserChoicePrompt,
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [participants, setParticipants] = useState<string[]>([]);
    const [factors, setFactors] = useState<string[]>([]); // New state for factors
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        if (isOpen && text) {
            setLoading(true);
            identifyInterlocutors();
        }
        return () => {
            if (!isOpen) {
                setLoading(false);
                setError(null);
                setParticipants([]);
                setFactors([]); // Reset factors on close
                setMessage('');
            }
        };
    }, [isOpen, text]);

    const identifyInterlocutors = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/id-interlocutors', { text });
            const data = response.data.result.split('||');
            if (data.length >= 4) {
                setParticipants([data[0], data[1]]);
                setFactors([data[2], data[3]]); // Set factors
                setMessage(data[4]);
            } else {
                throw new Error('Error parsing response data.');
            }
        } catch (error) {
            setError('Error identifying interlocutors.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelection = (selectedOption: string) => {
        setUserChoicePrompt(`You have selected: ${selectedOption}`);
        onIdentificationComplete(selectedOption, participants, factors);
    };

    // Vision UI styles
    const modalBgColor = useColorModeValue('#2D3748', '#1A202C');
    const textColor = useColorModeValue('#FFFFFF', '#E2E8F0');
    const buttonStyle = {
        backgroundColor: '#4A5568',
        color: 'white',
        margin: '5px',
        _hover: { bg: '#718096' },
    };

    return (
        <Modal isOpen={isOpen} onClose={() => {}} size="lg" isCentered closeOnOverlayClick={false}>
            <ModalOverlay />
            <ModalContent bg={modalBgColor}>
                <ModalHeader color={textColor}>Identify Interlocutors</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {loading ? (
                        <Spinner color='blue.500' size='lg' />
                    ) : error ? (
                        <Alert status="error">
                            <AlertIcon />
                            {error}
                        </Alert>
                    ) : (
                        <>
                            <Text color={textColor}>{message}</Text>
                            {participants.map((participant, index) => (
                                <Button key={index} colorScheme="blue" style={buttonStyle} onClick={() => handleSelection(participant)}>
                                    {participant}
                                </Button>
                            ))}
                            <Button colorScheme="blue" style={buttonStyle} onClick={() => handleSelection('Neither')}>
                                Neither
                            </Button>
                        </>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default IdentifyInterlocutorsModal;
