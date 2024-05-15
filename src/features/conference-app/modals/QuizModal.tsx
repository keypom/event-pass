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
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';
import { useState } from 'react';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  body: string;
  questions: string[];
  onConfirm: (answer: string) => void;
}

const QuizModal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  body,
  questions,
  onConfirm,
}: QuizModalProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState('');

  const handleConfirm = () => {
    onConfirm(selectedAnswer);
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
            <RadioGroup value={selectedAnswer} onChange={setSelectedAnswer}>
              <Stack direction="column">
                {questions.map((question, index) => (
                  <Radio key={index} value={question}>
                    {question}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
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

export default QuizModal;
