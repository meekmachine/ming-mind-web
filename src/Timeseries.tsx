import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { VictoryLine, VictoryChart, VictoryAxis } from 'victory';
import { Box, Switch, FormControl, FormLabel, Text, useColorModeValue } from '@chakra-ui/react';

// Define interfaces
interface UtteranceData {
  participant: string;
  utterance: number;
  [key: string]: number | string; // Adding an index signature
}

interface TimeSeriesData {
  factors: string[];
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
    const [plotParticipants, setPlotParticipants] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response =   await axios.post('http://localhost:8000/timeseries', { 
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
      }
    };

    if (participants.length && text) {
      fetchData();
    }
  }, [participants, text]);

  const handleSwitchChange = () => {
    setSelectedFactorIndex(prevIndex => (prevIndex === 0 ? 1 : 0));
  };

  const bgColor = useColorModeValue('#2D3748', '#1A202C');
  const textColor = useColorModeValue('#FFFFFF', '#E2E8F0');

  console.log(timeSeriesData);
  const plotData = timeSeriesData ? timeSeriesData.data
    // .filter((d: { participant: string; }) => participants.includes(d.participant))
    .map((d: { [x: string]: any; utterance: any; participant: any; }) => ({
      x: d.utterance,
      y: d[timeSeriesData.factors[selectedFactorIndex] as keyof UtteranceData], // Type assertion for factor index
      participant: d.participant
    })) : [];

  return (
    <Box bg={bgColor} p={4} borderRadius="lg">
      <FormControl display="flex" alignItems="center" mb={4}>
        <FormLabel htmlFor="factor-switch" mb="0" color={textColor}>
          Toggle between {timeSeriesData?.factors[0]} and {timeSeriesData?.factors[1]}
        </FormLabel>
        <Switch id="factor-switch" onChange={handleSwitchChange} />
      </FormControl>
      {error ? (
        <Text color="red.500">{error}</Text>
      ) : timeSeriesData ? (
        <>
          <Text color={textColor} fontSize="xl" mb={4}>
            Plotting: {timeSeriesData.factors[selectedFactorIndex]}
          </Text>
          <VictoryChart scale={{ x: 'linear' }} domainPadding={20}>
            <VictoryAxis style={{ axis: { stroke: textColor }, tickLabels: { fill: textColor } }} />
            <VictoryAxis dependentAxis style={{ axis: { stroke: textColor }, tickLabels: { fill: textColor } }} />
            {participants.map((participant, idx) => (
              <VictoryLine
                key={idx}
                data={plotData.filter((d: { participant: string; }) => d.participant === participant)}
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