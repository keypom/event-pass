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
  Heading,
} from '@chakra-ui/react';

import { CLOUDFLARE_IPFS } from '@/constants/common'; // Import the constant

interface ScavengerModalProps {
  isOpen: boolean;
  onClose: () => void;
  numFound: number;
  numRequired: number;
  image: string;
  tokenAmount?: string;
}

const ScavengerModal = ({
  isOpen,
  onClose,
  numFound,
  numRequired,
  tokenAmount,
  image,
}: ScavengerModalProps) => {
  let title = '';
  let subtitle = '';
  let body = '';
  const imageUrl = `${CLOUDFLARE_IPFS}/${image}`;

  if (numFound === 1 && numRequired > 1) {
    title = 'Scavenger Hunt Started';
    subtitle = `${numRequired - 1} piece(s) left.`;
    body = `When you find all the pieces, you'll receive ${
      tokenAmount ? `${tokenAmount} tokens!` : `an exclusive NFT!`
    }`;
  } else if (numFound < numRequired) {
    title = 'Piece Found';
    subtitle = `Found ${numFound}/${numRequired} pieces. Keep going!`;
  } else if (numFound === numRequired) {
    title = 'Scavenger Hunt Completed';
    subtitle = 'Congratulations! You have found all the pieces!';
    body = `You've received ${tokenAmount ? `${tokenAmount} tokens!` : `an exclusive NFT!`}`;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Heading size="md">{subtitle}</Heading>
            <Text>{body}</Text>
            <Text>
              Found {numFound}/{numRequired} pieces
            </Text>
            <Image alt="Scavenger Hunt Image" src={imageUrl} />
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

export default ScavengerModal;
