import React, { useState } from 'react';
import axios from 'axios';
import { scaleLinear } from 'd3-scale';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  ModalFooter,
} from '@chakra-ui/react';
import TopicGraph from './TopicGraph/TopicGraph';

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
  const colorScale = scaleLinear<string>()
    .domain([0, 1])
    .range(['aqua', 'magenta']);

  const handleNodeClick = async (nodeId: string) => {
    try {
      const response = await axios.get(`http://localhost:8000/get-convo-by-id/${nodeId}`);
      const conversationData = response.data;
      const formattedConversation = formatConversation(conversationData);
      const plainTextConversation = conversationData.map((msg: { speaker: any; text: any; }) => `${msg.speaker}: ${msg.text}`).join('\n');

      onFetchConversation({
        formattedText: formattedConversation,
        plainText: plainTextConversation,
        json: conversationData
      });
    } catch (error) {
      console.error('Error fetching conversation:', error);
    }
  };

  const formatConversation = (conversationData: any[]): string => {
    return conversationData.map(msg => {
      const toxicColor = colorScale(msg['meta.toxicity']);
      const attackStyle = msg['meta.comment_has_personal_attack'] ? 'font-weight: bold;' : '';
      return `<p><span style="color: ${toxicColor}; ${attackStyle}"><b>${msg.speaker}:</b> ${msg.text}</span></p>`;
    }).join('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Fetch Conversation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Text fontSize="md">``
              This tool fetches conversations from the Conversations Gone Awry (CGA) corpus...
            </Text>
            <TopicGraph onFetchConversation={onFetchConversation} onNodeClick={handleNodeClick} />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue">Fetch</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default FetchConversationModal;
