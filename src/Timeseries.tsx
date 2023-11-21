import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryTooltip, VictoryVoronoiContainer } from 'victory';
import { Box, Switch, FormControl, FormLabel, Text, useColorModeValue } from '@chakra-ui/react';

// Define interfaces
interface UtteranceData {
  participant: string;
  utterance: number;
  [key: string]: number | string; // Adding an index signature
}

interface TimeSeriesData {
  data: UtteranceData[];
}

interface TimeseriesProps {
    participants: string[];
    factors: string[];
    text: string | null;
}

const Timeseries: React.FC<TimeseriesProps> = ({ participants, text, factors }) => {
    const [selectedFactorIndex, setSelectedFactorIndex] = useState(0);
    const [timeSeriesData, setTimeSeriesData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [parsedUtterances, setParsedUtterances] = useState<string[]>([]);

    useEffect(() => {
        // Function to parse text into utterances
        const parseText = (text:string) => {
            console.log(text)
            return text.split(':').map(l=>l.replace(participants[0], '').replace(participants[1], ''));
}

        if (text) {
            setParsedUtterances(parseText(text));
        }

        const fetchData = async () => {
            try {
                const response = await axios.post('http://localhost:8000/timeseries', {
                    participant1: participants[0],
                    participant2: participants[1],
                    factor1: factors[0],
                    factor2: factors[1],
                    text
                });
                setTimeSeriesData(JSON.parse(response.data) as TimeSeriesData);
                setError(null);
            } catch (error) {
                setError('Failed to load data. Please try again later.');
                console.error(error);
            }
        };

        if (participants.length && text) {
            fetchData();
        }
    }, [participants, text, selectedFactorIndex]);

    const handleSwitchChange = () => {
        setSelectedFactorIndex(prevIndex => (prevIndex === 0 ? 1 : 0));
    };
    // Clear plot data from state when page reloads
    window.onbeforeunload = () => {
        setTimeSeriesData(null);
        setParsedUtterances([] )
    };

    const bgColor = useColorModeValue('#2D3748', '#1A202C');
    const textColor = useColorModeValue('#FFFFFF', '#E2E8F0');
    console.log(timeSeriesData);
    // Update plot data to include utterances
    console.log(parsedUtterances)
    const plotData = timeSeriesData ? timeSeriesData.data
        .map((d:UtteranceData, index:number) => ({
            x: d.utterance,
            y: d[factors[selectedFactorIndex].trim()],
            participant: d.participant,
            label: parsedUtterances[index] || '' // Adding utterance as label
        })) : [];
        console.log(...factors);

    console.log(plotData);
    return (
        <Box bg={bgColor} p={4} borderRadius="lg">
            <FormControl display="flex" alignItems="center" mb={4}>
                <FormLabel htmlFor="factor-switch" mb="0" color={textColor}>
                    Toggle between {factors[0]} and {factors[1]}
                </FormLabel>
                <Switch id="factor-switch" onChange={handleSwitchChange} />
            </FormControl>
            {error ? (
                <Text color="red.500">{error}</Text>
            ) : timeSeriesData ? (
                <>
                    <Text color={textColor} fontSize="xl" mb={4}>
                        Plotting: {factors[selectedFactorIndex]}
                    </Text>
                    <VictoryChart
                        domainPadding={20}
                        containerComponent={
                            <VictoryVoronoiContainer
                                labels={({ datum }) => datum.label}
                                labelComponent={<VictoryTooltip cornerRadius={3} flyoutStyle={{ fill: "white" }} />}
                            />
                        }
                    >
                        <VictoryAxis style={{ axis: { stroke: textColor }, tickLabels: { fill: textColor } }} />
                        <VictoryAxis dependentAxis style={{ axis: { stroke: textColor }, tickLabels: { fill: textColor } }} />
                        {participants.map((participant, idx) => (
                            <VictoryLine
                                key={idx}
                                data={plotData.filter((d :UtteranceData) => d.participant.trim() == participant)}
                                style={{ data: { stroke: idx === 0 ? "#FF6347" : "#4682B4" } }}
                            />
                        ))}
                    </VictoryChart>
                </>
            ) : (
                <Text color={textColor}>Loading...</Text>
            )}
        </Box>
    );
};

export default Timeseries;
