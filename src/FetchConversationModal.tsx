import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  Slider,
  SliderTrack,
  SliderThumb,
  SliderFilledTrack,
  VStack,
} from '@chakra-ui/react'; // Import Chakra UI components

type FetchConversationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onFetchConversation: (conversation: { text: string; json: any }) => void;
};

function FetchConversationModal({
  isOpen,
  onClose,
  onFetchConversation,
}: FetchConversationModalProps) {
  const [minToxicity, setMinToxicity] = useState(0);
  const [minMessages, setMinMessages] = useState(0);
  const [hasPersonalAttack, setHasPersonalAttack] = useState(false);

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
      onFetchConversation({ text: formattedConversation, json: response.data });
    } catch (error) {
      console.error('Error fetching conversation:', error);
    }
  };

  const formatConversation = (conversationData: any[]) => {
    conversationData.sort((a, b) => a.timestamp - b.timestamp);
    return conversationData.map((msg) => `${msg.speaker}: ${msg.text}`).join('\n\n');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        bg="gray.800"
        color="white"
        borderRadius="md"
        p={4}
        boxShadow="lg"
        maxW="lg"
      >
        <ModalHeader fontSize="2xl" mb={2}>
          Meet Ming
        </ModalHeader>
        <ModalCloseButton _hover={{ color: 'red.500' }} />
        <ModalBody>
          <Text mb={4}>
            Ming is an exploration of AI's capabilities in conflict mediation, using The
            Cornell University Social Dynamics Lab's "Conversations Gone Awry" corpora for
            demonstration purposes. We've added enhanced capabilities for exploring the
            data.
          </Text>
          <Text mb={4}>
            Use the sliders and checkboxes below to filter the conversations, and click
            "Fetch Conversation" to get a conversation that matches your criteria. Then,
            click "Submit" to see Ming's analysis of the conversation.
          </Text>
          <VStack spacing={4}>
            <Text>Min Toxicity: {minToxicity}</Text>
            <Slider
              min={0}
              max={1}
              step={0.1}
              value={minToxicity}
              onChange={(value) => setMinToxicity(value)}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <Text>Min Messages: {minMessages}</Text>
            <Slider
              min={0}
              max={50}
              step={1}
              value={minMessages}
              onChange={(value) => setMinMessages(value)}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <Checkbox
              isChecked={hasPersonalAttack}
              onChange={(e) => setHasPersonalAttack(e.target.checked)}
            >
              Has Personal Attack
            </Checkbox>
          </VStack>
        </ModalBody>
        <Button
          colorScheme="blue"
          onClick={fetchConversation}
          mt={4}
          _hover={{ bg: 'blue.500' }}
        >
          Fetch Conversation
        </Button>
      </ModalContent>
    </Modal>
  );
}

export default FetchConversationModal;
