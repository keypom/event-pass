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
  Input,
} from '@chakra-ui/react';
import { useState } from 'react';

interface RaffleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  body: string;
  onConfirm: (tickets: number) => void;
}

const RaffleModal = ({ isOpen, onClose, title, subtitle, body, onConfirm }: RaffleModalProps) => {
  const [tickets, setTickets] = useState(1);

  const handleConfirm = () => {
    onConfirm(tickets);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Text>{subtitle}</Text>
            <Text>{body}</Text>
            <Input
              min="1"
              type="number"
              value={tickets}
              onChange={(e) => {
                setTickets(Number(e.target.value));
              }}
            />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleConfirm}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RaffleModal;
