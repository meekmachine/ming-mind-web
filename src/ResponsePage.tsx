import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Text, Container, Fade } from '@chakra-ui/react';
import IdentifyInterlocutorsModal from './IdentifyInterlocutorsModal';
import OverallFeedback from './OverallFeedback';
import Timeseries from './Timeseries';

function ResponsePage() {
    const location = useLocation();
    const state = location.state as { text?: string };
    const [convo, setConvo] = useState<string | null>(null);
    const [startLoading, setStartLoading] = useState<boolean>(false);
    const [selectedInterlocutor, setSelectedInterlocutor] = useState<string | null>(null);
    const [participants, setParticipants] = useState<string[]>([]);
    const [userChoicePrompt, setUserChoicePrompt] = useState<string>('');
    const [factors, setFactors] = useState<string[]>([]);

    useEffect(() => {
        if (state?.text) {
            setConvo(state.text);
        }
    }, [state]);

    const handleIdentificationComplete = (selectedOption: string, participantNames: string[], factorNames: string[]) => {
        setSelectedInterlocutor(selectedOption);
        setParticipants(participantNames);
        setFactors(factorNames); // Save the factor names in state
        setStartLoading(true);
    };

    const visionUIStyles = {
        pageContainer: {
            backgroundColor: '#1A202C',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        contentContainer: {
            backgroundColor: '#2D3748',
            color: '#fff',
            padding: '20px',
            borderRadius: '8px',
            margin: '20px',
            width: '100%',
            maxWidth: '600px',
        },
    };

    return (
        <Box style={visionUIStyles.pageContainer}>
            <Container style={visionUIStyles.contentContainer}>
                <Text>Conversation Analysis</Text>
                <Text>{userChoicePrompt}</Text>
                {!selectedInterlocutor && convo && (
                    <IdentifyInterlocutorsModal
                        text={convo}
                        isOpen={!selectedInterlocutor}
                        onIdentificationComplete={handleIdentificationComplete}
                        setUserChoicePrompt={setUserChoicePrompt}
                    />
                )}
                {startLoading && (
                    <>
                        <Fade in={true} unmountOnExit>
                            <OverallFeedback 
                                interlocutor={selectedInterlocutor}
                                text={convo}
                                setFactors={setFactors}
                            />
                        </Fade>
                        <Fade in={true} unmountOnExit>
                            <Timeseries 
                                participants={participants}
                                factors={factors}
                                text={convo}
                            />
                        </Fade>
                    </>
                )}
            </Container>
        </Box>
    );
}

export default ResponsePage;
