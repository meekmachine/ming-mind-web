import React, { useState } from 'react';
import axios from 'axios';
import { scaleLinear } from 'd3-scale';
import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Slider,
  SliderTrack,
  SliderThumb,
  SliderFilledTrack,
  Text,
  VStack,
  ModalFooter,
} from '@chakra-ui/react';

type FetchConversationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onFetchConversation: (conversation: { formattedText: string; plainText: string; json: any }) => void;
};

function FetchConversationModal({
  isOpen,
  onClose,
  onFetchConversation,
}: FetchConversationModalProps) {
  const [minToxicity, setMinToxicity] = useState(0);
  const [minMessages, setMinMessages] = useState(0);
  const [hasPersonalAttack, setHasPersonalAttack] = useState(false);

  const colorScale = scaleLinear<string>()
    .domain([0, 1])
    .range(['aqua', 'magenta']);

  const fetchConversation = async () => {
    try {
      const response = await axios.get('http://localhost:8000/get-convo', {
        params: {
          'min-toxicity': minToxicity,
          'min-messages': minMessages,
          'has-personal-attack': hasPersonalAttack,
        },
      });
      const formattedConversation = formatConversation(response.data);
      const plainTextConversation = response.data.map((msg: { speaker: any; text: any; }) => `${msg.speaker}: ${msg.text}`).join('\n');

      onFetchConversation({ 
        formattedText: formattedConversation, 
        plainText: plainTextConversation,
        json: response.data 
      });
    } catch (error) {
      console.error('Error fetching conversation:', error);
    }
  };

  const formatConversation = (conversationData: any[]) => {
    return conversationData.map(msg => {
      const toxicColor = colorScale(msg["meta.toxicity"]);
      const attackStyle = msg["meta.comment_has_personal_attack"] ? 'font-weight: bold;' : '';
      return `<p><span style="color: ${toxicColor}; ${attackStyle}"><b>${msg.speaker}:</b> ${msg.text}</span></p>`;
    }).join('');
  };

  // Custom Vision UI Styles
  const visionUIStyles = {
    modalContent: {
      backgroundColor: '#333', // Dark background
      color: 'white', // Light text color
      borderRadius: '8px', // Smooth edges
    },
    header: {
      borderBottom: '1px solid #444', // Subtle separation
      paddingBottom: '0.5rem',
    },
    footer: {
      borderTop: '1px solid #444',
      paddingTop: '0.5rem',
    },
    sliderTrack: {
      backgroundColor: '#555', // Dark track
    },
    sliderFilled: {
      backgroundColor: '#4A90E2', // Accent color for filled part
    },
    sliderThumb: {
      backgroundColor: '#4A90E2', // Matching thumb color
    },
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent sx={visionUIStyles.modalContent}>
        <ModalHeader sx={visionUIStyles.header}>Fetch Conversation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Text fontSize="md">
              This tool fetches conversations from the Conversations Gone Awry (CGA) corpus, 
              a dataset used to study how online interactions can escalate into toxic or harmful exchanges.
            </Text>
            <Text>Minimum Toxicity Score (0 to 1):</Text>
            <Slider
              value={minToxicity}
              onChange={setMinToxicity}
              min={0}
              max={1}
              step={0.1}>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>

            <Text>Minimum Number of Messages:</Text>
            <Slider
              value={minMessages}
              onChange={setMinMessages}
              min={0}
              max={100}
              step={1}>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>

            <Checkbox
              isChecked={hasPersonalAttack}
              onChange={(e) => setHasPersonalAttack(e.target.checked)}>
              Include Personal Attacks
            </Checkbox>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={fetchConversation}>
            Fetch
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default FetchConversationModal;
