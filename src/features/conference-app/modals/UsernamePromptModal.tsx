import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  VStack,
  useDisclosure,
  useColorModeValue,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';

import { useConferenceContext } from '@/contexts/ConferenceContext';

import ProfileTransferModal from './ProfileTransferModal'; // Import the ProfileTransferModal

const UsernamePromptModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const {
    eventInfo,
    accountId: curAccountId,
    secretKey,
    factoryAccount,
    setTriggerRefetch,
  } = useConferenceContext();
  const [username, setUsername] = useState('');
  const {
    isOpen: isTransferModalOpen,
    onOpen: openTransferModal,
    onClose: closeTransferModal,
  } = useDisclosure();

  const handleContinue = () => {
    openTransferModal();
  };

  const modalBackground = useColorModeValue('white', 'gray.700');
  const modalPadding = { base: '6', md: '8' };
  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropFilter="blur(0px)" bg="blackAlpha.600" opacity="1" />
        <ModalContent
          bg={modalBackground}
          mx={3}
          p={modalPadding}
          position="relative"
          textAlign="center"
        >
          <ModalHeader pb={2} pt={6}>
            <VStack pb="2" spacing="1">
              <Text
                color={eventInfo.styles.h1.color}
                fontFamily={eventInfo.styles.h1.fontFamily}
                fontSize="2xl"
                fontWeight={eventInfo.styles.h1.fontWeight}
                textAlign="center"
              >
                Send Tokens
              </Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleContinue}>
              Continue
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ProfileTransferModal with relevant props */}
      <ProfileTransferModal
        isOpen={isTransferModalOpen}
        sendTo={username} // Provide the recipient account
        title="Send Tokens"
        onClose={closeTransferModal}
      />
    </>
  );
};

export default UsernamePromptModal;
