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
} from '@chakra-ui/react';
import { useState } from 'react';

import ProfileTransferModal from './ProfileTransferModal'; // Import the ProfileTransferModal

const UsernamePromptModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [username, setUsername] = useState('');
  const {
    isOpen: isTransferModalOpen,
    onOpen: openTransferModal,
    onClose: closeTransferModal,
  } = useDisclosure();

  const handleContinue = () => {
    openTransferModal();
  };

  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter Username</ModalHeader>
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
