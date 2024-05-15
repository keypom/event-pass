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
  useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';

import { type FunderEventMetadata } from '@/lib/eventsHelpers';

interface ProfileTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  body: string;
  onConfirm: (amount: string) => void;
  eventInfo: FunderEventMetadata;
}

const ProfileTransferModal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  body,
  onConfirm,
  eventInfo,
}: ProfileTransferModalProps) => {
  const [amount, setAmount] = useState('');

  const handleConfirm = () => {
    onConfirm(amount);
    onClose();
  };

  const modalBackground = useColorModeValue('white', 'gray.700');
  const modalPadding = { base: '6', md: '8' };

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay backdropFilter="blur(0px)" bg="blackAlpha.600" opacity="1" />
      <ModalContent bg={modalBackground} mx={3} p={modalPadding} textAlign="center">
        <ModalHeader pb={2} pt={6}>
          <VStack pb="2" spacing="0">
            <Text
              color={eventInfo.styles.h1.color}
              fontFamily={eventInfo.styles.h1.fontFamily}
              fontSize="2xl"
              fontWeight={eventInfo.styles.h1.fontWeight}
              textAlign="center"
            >
              {title}
            </Text>

            <Text
              color={eventInfo.styles.h3.color}
              fontFamily={eventInfo.styles.h3.fontFamily}
              fontSize="md"
              fontWeight={eventInfo.styles.h3.fontWeight}
              textAlign="center"
            >
              {subtitle}
            </Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Text
              color={eventInfo.styles.h3.color}
              fontFamily={eventInfo.styles.h3.fontFamily}
              fontSize={eventInfo.styles.h3.fontSize}
              fontWeight={eventInfo.styles.h3.fontWeight}
              textAlign="center"
            >
              {body}
            </Text>
            <Input
              placeholder="Enter amount to transfer"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
            />
          </VStack>
        </ModalBody>
        <ModalFooter flexDirection="column" pb={6} pt={0}>
          <VStack spacing="3" w="full">
            <Button
              backgroundColor={eventInfo.styles.buttons.primary.bg}
              color={eventInfo.styles.buttons.primary.color}
              fontFamily={eventInfo.styles.buttons.primary.fontFamily}
              fontSize={eventInfo.styles.buttons.primary.fontSize}
              fontWeight={eventInfo.styles.buttons.primary.fontWeight}
              h={eventInfo.styles.buttons.primary.h}
              sx={eventInfo.styles.buttons.primary.sx}
              variant="outline"
              w="full"
              onClick={handleConfirm}
            >
              Confirm
            </Button>
            <Button
              backgroundColor="gray.800"
              color={eventInfo.styles.buttons.primary.color}
              fontFamily={eventInfo.styles.buttons.primary.fontFamily}
              fontSize={eventInfo.styles.buttons.primary.fontSize}
              fontWeight={eventInfo.styles.buttons.primary.fontWeight}
              h={eventInfo.styles.buttons.primary.h}
              sx={eventInfo.styles.buttons.primary.sx}
              variant="outline"
              w="full"
              onClick={onClose}
            >
              Close
            </Button>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProfileTransferModal;
