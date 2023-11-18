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
    onIdentificationComplete: (selectedOption: string, participants: string[]) => void;
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
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [participants, setParticipants] = useState<string[]>([]);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        // Perform the API call only when the modal is opened and text is available
        if (isOpen && text) {
            setLoading(true);
            identifyInterlocutors();
        }

        // Reset states when the modal is closed
        return () => {
            if (!isOpen) {
                setLoading(false);
                setError(null);
                setParticipants([]);
                setMessage('');
            }
        };
    }, [isOpen, text]); // Depend only on isOpen and text

    const identifyInterlocutors = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/id-interlocutors', { text });
            const data = response.data.result.split('||');
            setParticipants([data[0], data[1]]);
            setMessage(data[2]);

        } catch (error) {
            setError('Error identifying interlocutors.');
        } finally {
            setLoading(false);
            setIsFetching(false);
        }
    };

    const handleSelection = (selectedOption: string, participants: string[]) => {
        setUserChoicePrompt(`You have selected: ${selectedOption}`);
        onIdentificationComplete(selectedOption, participants); // Include participants here
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
        <Modal isOpen={isOpen} onClose={() => { }} size="lg" isCentered closeOnOverlayClick={false}>
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
                                <Button key={index} colorScheme="blue" style={buttonStyle} onClick={() => handleSelection(participants[index], participants)}>
                                    {participant}
                                </Button>
                            ))}
                            <Button colorScheme="blue" style={buttonStyle} onClick={() => handleSelection('Neither', participants)}>
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
