import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  VStack,
} from '@chakra-ui/react';

interface NFTModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
}

const NFTModal = ({ isOpen, onClose, name }: NFTModalProps) => {
  const title = 'NFT Claimed';
  const subtitle = `Successfully claimed ${name}.`;
  const showConfetti = true;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Text>{subtitle}</Text>
            {showConfetti && <Text>🎉 Confetti 🎉</Text>}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NFTModal;
