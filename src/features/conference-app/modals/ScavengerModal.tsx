import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Text,
  VStack,
  Image,
  useColorModeValue,
  Box,
  Center,
} from '@chakra-ui/react';
import Confetti from 'react-confetti';

import { type FunderEventMetadata } from '@/lib/eventsHelpers';
import { CLOUDFLARE_IPFS } from '@/constants/common';
import { useConferenceContext } from '@/contexts/ConferenceContext';

interface ScavengerModalProps {
  isOpen: boolean;
  onClose: () => void;
  numFound: number;
  numRequired: number;
  image: string;
  tokenAmount?: string;
  eventInfo: FunderEventMetadata;
}

const ScavengerModal = ({
  isOpen,
  onClose,
  numFound,
  numRequired,
  tokenAmount,
  image,
  eventInfo,
}: ScavengerModalProps) => {
  const { onSelectTab } = useConferenceContext();
  let title = '';
  let subtitle = '';
  let body = '';
  const imageUrl = `${CLOUDFLARE_IPFS}/${image}`;
  let showConfetti = false;

  if (numFound === 1 && numRequired > 1) {
    // Case 2: Scavenger hunt started
    title = 'Scavenger Hunt Started';
    subtitle = `${numRequired - 1} piece(s) left.`;
    body = `When you find all the pieces, you'll receive ${
      tokenAmount ? `${tokenAmount} tokens!` : `an exclusive NFT!`
    }`;
    showConfetti = false;
  } else if (numFound < numRequired) {
    // Case 3: Piece found but scavenger hunt not completed
    title = 'Piece Found';
    subtitle = `Found ${numFound}/${numRequired} pieces. Keep going!`;
    showConfetti = false;
  } else if (numFound === numRequired) {
    // Case 4: Scavenger hunt completed
    title = 'Scavenger Hunt Completed';
    subtitle = 'Congratulations! You have found all the pieces!';
    body = `You've received ${tokenAmount ? `${tokenAmount} tokens!` : `an exclusive NFT!`}`;
    showConfetti = true;
  }

  const modalBackground = useColorModeValue('white', 'gray.700');
  const modalPadding = { base: '6', md: '8' };

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay backdropFilter="blur(0px)" bg="blackAlpha.600" opacity="1" />
      <ModalContent bg={modalBackground} mx={3} p={modalPadding} textAlign="center">
        {showConfetti && <Confetti />}
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
        <ModalBody>
          <VStack spacing={5}>
            <Center>
              <VStack>
                <Box mx="auto" textAlign="center">
                  <Image
                    alt="Scavenger Hunt Image"
                    borderRadius="md"
                    maxH={32} // Set a maximum height for the image
                    maxW="full"
                    objectFit="contain" // Keep the image's aspect ratio
                    src={imageUrl}
                  />
                </Box>

                <Text
                  color={eventInfo.styles.h3.color}
                  fontFamily={eventInfo.styles.h3.fontFamily}
                  fontSize="md"
                  fontWeight={eventInfo.styles.h3.fontWeight}
                  textAlign="center"
                >
                  {body}
                </Text>
              </VStack>
            </Center>
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
              onClick={() => {
                onSelectTab(1, 'scavengers');
              }}
            >
              MY ASSETS
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
              CLOSE
            </Button>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ScavengerModal;
