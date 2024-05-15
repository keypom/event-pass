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

interface SponsorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  body: string;
  onConfirm: (data: string) => void;
}

const SponsorModal = ({ isOpen, onClose, title, subtitle, body, onConfirm }: SponsorModalProps) => {
  const [data, setData] = useState('');

  const handleConfirm = () => {
    onConfirm(data);
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
              placeholder="Enter required information"
              value={data}
              onChange={(e) => {
                setData(e.target.value);
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

export default SponsorModal;
