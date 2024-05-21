import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Text,
  VStack,
  Flex,
  Box,
  Divider,
  Avatar,
} from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/system';
import QRCode from 'react-qr-code';

import { useConferenceContext } from '@/contexts/ConferenceContext';

interface ReceiveTokensModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReceiveTokensModal = ({ isOpen, onClose }: ReceiveTokensModalProps) => {
  const { eventInfo, accountId: curAccountId } = useConferenceContext();

  const modalBackground = useColorModeValue('white', 'gray.700');
  const modalPadding = { base: '6', md: '8' };

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay backdropFilter="blur(0px)" bg="blackAlpha.600" opacity="1" />
      <ModalContent bg={modalBackground} p="0" position="relative" textAlign="center">
        <ModalHeader>
          <Box>
            <VStack p={modalPadding} pb="4" spacing="1">
              <Text
                color={eventInfo.styles.h1.color}
                fontFamily={eventInfo.styles.h1.fontFamily}
                fontSize="3xl"
                fontWeight={eventInfo.styles.h1.fontWeight}
                textAlign="center"
              >
                Receive Tokens
              </Text>
            </VStack>
          </Box>
        </ModalHeader>
        <ModalBody>
          <Box p={modalPadding} pt="0">
            <VStack spacing="4">
              <Box textAlign="left" w="full">
                <VStack align="left" spacing="0" textAlign="left" w="full">
                  <Text
                    color={eventInfo.styles.h2.color}
                    fontFamily={eventInfo.styles.h2.fontFamily}
                    fontSize="xl"
                    fontWeight={eventInfo.styles.h2.fontWeight}
                  >
                    A. By QR Code
                  </Text>
                  <Text
                    color={eventInfo.styles.h3.color}
                    fontFamily={eventInfo.styles.h3.fontFamily}
                    fontSize="sm"
                    fontWeight={eventInfo.styles.h3.fontWeight}
                  >
                    Get scanned by someone:
                  </Text>
                </VStack>
                <Flex justifyContent="center" mt="2">
                  <Box border="1px solid" borderColor="gray.300" borderRadius="12px" p="5">
                    <QRCode id="QRCode" size={180} value={`profile:${curAccountId}`} />
                  </Box>
                </Flex>
              </Box>

              <Divider />

              <Box textAlign="left" w="full">
                <VStack align="left" spacing="0" textAlign="left" w="full">
                  <Text
                    color={eventInfo.styles.h2.color}
                    fontFamily={eventInfo.styles.h2.fontFamily}
                    fontSize="xl"
                    fontWeight={eventInfo.styles.h2.fontWeight}
                  >
                    B. By Username
                  </Text>
                  <Text
                    color={eventInfo.styles.h3.color}
                    fontFamily={eventInfo.styles.h3.fontFamily}
                    fontSize="sm"
                    fontWeight={eventInfo.styles.h3.fontWeight}
                  >
                    Have others enter your username:
                  </Text>
                </VStack>
                <Flex
                  align="center"
                  border="1px solid"
                  borderColor="gray.300"
                  borderRadius="12px"
                  mt="2"
                  p="3"
                  verticalAlign="center"
                >
                  <Avatar bg="blue.800" mr="3" name={curAccountId} size="sm" />
                  <Text
                    color={eventInfo?.styles.h2.color}
                    fontFamily={eventInfo?.styles.h2.fontFamily}
                    fontSize="2xl"
                    fontWeight={eventInfo?.styles.h2.fontWeight}
                  >
                    {curAccountId.split('.')[0]}
                  </Text>
                </Flex>
              </Box>
            </VStack>

            <Button
              backgroundColor="gray.800"
              color={eventInfo.styles.buttons.primary.color}
              fontFamily={eventInfo.styles.buttons.primary.fontFamily}
              fontSize={eventInfo.styles.buttons.primary.fontSize}
              fontWeight={eventInfo.styles.buttons.primary.fontWeight}
              h={eventInfo.styles.buttons.primary.h}
              mt="6"
              sx={eventInfo.styles.buttons.primary.sx}
              variant="outline"
              w="full"
              onClick={onClose}
            >
              Close
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ReceiveTokensModal;
