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
  Image,
  useColorModeValue,
  Box,
  Center,
} from '@chakra-ui/react';
import Confetti from 'react-confetti';

export interface EventPrizeModalContent {
  title: string;
  subtitle: string;
  image: string;
  name: string;
  showConfetti: boolean;
  body?: string;
  showAssetsButton?: boolean;
  amount?: string;
}

interface EventPrizeClaimedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssetsClicked: () => void;
  eventInfo: any;
  modalContent: EventPrizeModalContent;
}

const EventPrizeClaimedModal = ({
  eventInfo,
  isOpen,
  onAssetsClicked,
  onClose,
  modalContent,
}: EventPrizeClaimedModalProps) => {
  const modalBackground = useColorModeValue('white', 'gray.700');
  const closeButtonColor = useColorModeValue('gray.500', 'gray.200');
  const modalPadding = { base: '6', md: '8' };
  const imageBoxSize = { base: '70%', md: '50%', lg: '40%' }; // Responsive image sizing

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay backdropFilter="blur(0px)" bg="blackAlpha.600" opacity="1" />
      <ModalContent bg={modalBackground} mx={3} p={modalPadding} textAlign="center">
        {modalContent.showConfetti && <Confetti />}
        <ModalCloseButton color={closeButtonColor} />
        <ModalHeader pb={2} pt={6}>
          <VStack pb="2" spacing="0">
            <Text
              color="#844AFF"
              fontFamily="denverBody"
              fontWeight="600"
              size={{ base: '2xl', md: '2xl' }}
              textAlign="center"
            >
              {modalContent.title}
            </Text>

            <Text
              color="black"
              fontFamily="denverBody"
              fontSize="md"
              fontWeight="400"
              textAlign="center"
            >
              {modalContent.subtitle}
            </Text>
          </VStack>
        </ModalHeader>
        <ModalBody>
          <VStack spacing={5}>
            {modalContent.image && (
              <Center>
                <VStack>
                  <Box mx="auto" w={imageBoxSize}>
                    <Image
                      alt={modalContent.name}
                      borderRadius="md"
                      maxH={32} // Set a maximum height for the image
                      maxW="full"
                      objectFit="contain" // Keep the image's aspect ratio
                      src={modalContent.image}
                    />
                  </Box>

                  <Text
                    color="black"
                    fontFamily="denverBody"
                    fontSize="sm"
                    fontWeight="400"
                    textAlign="left"
                  >
                    {modalContent.name}
                  </Text>
                </VStack>
              </Center>
            )}

            {modalContent.body && (
              <Text color="black" fontFamily="denverBody" fontSize="sm" fontWeight="400">
                {modalContent.body}
              </Text>
            )}
            {modalContent.amount && (
              <Text fontWeight="semibold">{`${modalContent.amount} tokens`}</Text>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter flexDirection="column" pb={6} pt={0}>
          <VStack spacing="3" w="full">
            {modalContent.showAssetsButton && (
              <Button
                backgroundColor={eventInfo?.qrPage?.content?.sellButton?.bg}
                color={eventInfo?.qrPage?.content?.sellButton?.color}
                fontFamily={eventInfo?.qrPage?.content?.sellButton?.fontFamily}
                fontSize={eventInfo?.qrPage?.content?.sellButton?.fontSize}
                fontWeight={eventInfo?.qrPage?.content?.sellButton?.fontWeight}
                h={eventInfo?.qrPage?.content?.sellButton?.h}
                sx={eventInfo?.qrPage?.content?.sellButton?.sx}
                variant="outline"
                w="full"
                onClick={onAssetsClicked}
              >
                MY ASSETS
              </Button>
            )}
            <Button
              backgroundColor="gray.800"
              color={eventInfo?.qrPage?.content?.sellButton?.color}
              fontFamily={eventInfo?.qrPage?.content?.sellButton?.fontFamily}
              fontSize={eventInfo?.qrPage?.content?.sellButton?.fontSize}
              fontWeight={eventInfo?.qrPage?.content?.sellButton?.fontWeight}
              h={eventInfo?.qrPage?.content?.sellButton?.h}
              sx={eventInfo?.qrPage?.content?.sellButton?.sx}
              variant="outline"
              w="full"
              onClick={onClose}
            >
              CLOSE
            </Button>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default EventPrizeClaimedModal;
