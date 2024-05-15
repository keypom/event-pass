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

interface ProfileTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  body: string;
  onConfirm: (amount: string) => void;
}

const ProfileTransferModal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  body,
  onConfirm,
}: ProfileTransferModalProps) => {
  const [amount, setAmount] = useState('');

  const handleConfirm = () => {
    onConfirm(amount);
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
              placeholder="Enter amount to transfer"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
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

export default ProfileTransferModal;
