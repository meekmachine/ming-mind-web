import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  VictoryLine,
  VictoryChart,
  VictoryAxis,
  VictoryTooltip,
  VictoryVoronoiContainer,
  VictoryLegend
} from 'victory';
import { Box, Switch, FormControl, FormLabel, Text, useColorModeValue } from '@chakra-ui/react';

// Define interfaces
interface UtteranceData {
  participant: string;
  utterance: number;
  [key: string]: number | string;
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
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:8000/timeseries', {
          participant1: participants[0],
          participant2: participants[1],
          factor1: factors[0],
          factor2: factors[1],
          text
        });
        setTimeSeriesData(JSON.parse(response.data.trim())); // Assuming response.data is already the correct format
        setError(null);
      } catch (error) {
        setError('Failed to load data. Please try again later.');
        console.error(error);
      }
    };

    if (participants.length && text) {
      fetchData();
    }
  }, [participants, text, factors]);

  const handleSwitchChange = () => {
    setSelectedFactorIndex(prevIndex => (prevIndex === 0 ? 1 : 0));
  };

  const bgColor = useColorModeValue('#2D3748', '#1A202C');
  const textColor = useColorModeValue('#FFFFFF', '#E2E8F0');

  const plotData = timeSeriesData ? timeSeriesData.data.map((d: UtteranceData) => ({
    x: d.utterance,
    y: d[factors[selectedFactorIndex].trim()],
    participant: d.participant,
    label: `${d.participant}: ${d[factors[selectedFactorIndex].trim()]}`
  })) : [];

  return (
    <Box bg={bgColor} p={4} borderRadius="lg" width="100%">
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
          <VictoryChart
            domainPadding={20}
            containerComponent={
              <VictoryVoronoiContainer
                labels={({ datum }) => datum.label}
                labelComponent={
                  <VictoryTooltip
                    cornerRadius={5}
                    flyoutStyle={{ fill: "white", stroke: textColor, strokeWidth: 1 }}
                    flyoutPadding={{ top: 10, bottom: 10, left: 15, right: 15 }}
                    style={{ fontSize: 10, fill: textColor }} // Tooltip text color
                  />
                }
              />
            }
          >
            <VictoryLegend
              x={125} y={10} // Adjusted position to be higher
              title="Participants"
              centerTitle
              orientation="horizontal"
              gutter={20}
              style={{ border: { stroke: "none" }, title: { fontSize: 10, fill: textColor } }} // No border, white text
              data={[
                { name: participants[0], symbol: { fill: "#FF6347" } },
                { name: participants[1], symbol: { fill: "#4682B4" } }
              ]}
            />
            <VictoryAxis style={{ axis: { stroke: textColor }, tickLabels: { fill: textColor } }} />
            <VictoryAxis dependentAxis style={{ axis: { stroke: textColor }, tickLabels: { fill: textColor } }} />
            {participants.map((participant, idx) => (
              <VictoryLine
                key={idx}
                data={plotData.filter((d) => d.participant.trim() === participant)}
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
