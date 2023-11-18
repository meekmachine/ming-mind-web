import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { VictoryLine, VictoryChart, VictoryAxis } from 'victory';
import { Box, Switch, FormControl, FormLabel, Text, useColorModeValue } from '@chakra-ui/react';

interface TimeseriesProps {
  participants: string[];
  factors: string[];
  text: string | null; // Include text in the props
}

const Timeseries: React.FC<TimeseriesProps> = ({ participants, factors, text }) => {
  const [selectedFactorIndex, setSelectedFactorIndex] = useState(0);
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Include text in the request parameters
        const response = await axios.post('/timeseries', { 
          params: { participants, factors, text } 
        });
        setTimeSeriesData(response.data);
        setError(null); // Reset error state on successful fetch
      } catch (error) {
        setError('Failed to load data. Please try again later.');
      }
    };

    fetchData();
  }, [participants, factors, text]); // Include text in the dependencies array

  const handleSwitchChange = () => {
    setSelectedFactorIndex(prevIndex => (prevIndex === 0 ? 1 : 0));
  };

  const bgColor = useColorModeValue('#2D3748', '#1A202C');
  const textColor = useColorModeValue('#FFFFFF', '#E2E8F0');

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
      ) : timeSeriesData.length > 0 ? (
        <VictoryChart scale={{ x: 'time' }} domainPadding={20}>
          <VictoryAxis style={{ axis: { stroke: textColor }, tickLabels: { fill: textColor } }} />
          <VictoryAxis dependentAxis style={{ axis: { stroke: textColor }, tickLabels: { fill: textColor } }} />
          {participants.map((participant, idx) => (
            <VictoryLine
              key={idx}
              data={timeSeriesData[idx][factors[selectedFactorIndex]]}
              style={{ data: { stroke: idx === 0 ? "#FF6347" : "#4682B4" } }}
            />
          ))}
        </VictoryChart>
      ) : (
        <Text color={textColor}>Loading...</Text>
      )}
    </Box>
  );
};

export default Timeseries;
