import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Heading,
  Image,
  Skeleton,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { QrReader } from 'react-qr-reader';
import { useEffect, useRef, useState } from 'react';

import { IconBox } from '@/components/IconBox';
import { TicketIcon } from '@/components/Icons';
import { BoxWithShape } from '@/components/BoxWithShape';
import { CLOUDFLARE_IPFS } from '@/constants/common';
import {
  type TicketInfoMetadata,
  type TicketMetadataExtra,
  type FunderEventMetadata,
  type EventDrop,
} from '@/lib/eventsHelpers';
import { ViewFinder } from '@/components/ViewFinder';
import { LoadingOverlay } from '@/features/scanner/components/LoadingOverlay';
import keypomInstance from '@/lib/keypom';

import EventPrizeClaimedModal, { type EventPrizeModalContent } from './EventPrizeClaimedModal';
import { claimEventDrop } from './helpers';

interface StateRefObject {
  isScanning: boolean;
  isOnCooldown: boolean;
  isProcessing: boolean;
}

interface ScanningPageProps {
  eventInfo?: FunderEventMetadata;
  ticketInfo?: TicketInfoMetadata;
  ticketInfoExtra?: TicketMetadataExtra;
  dropInfo?: EventDrop;
  isLoading: boolean;
  eventId: string;
  funderId: string;
  accountId: string;
  tokensAvailable: string;
  setSelectedTab: any;
  secretKey: string;
}

export default function ScanningPage({
  eventInfo,
  ticketInfoExtra,
  dropInfo,
  ticketInfo,
  isLoading,
  eventId,
  funderId,
  accountId,
  tokensAvailable,
  setSelectedTab,
  secretKey,
}: ScanningPageProps) {
  const toast = useToast();

  const [facingMode, setFacingMode] = useState('user'); // default to rear camera
  const [isScanning, setIsScanning] = useState(false);
  const [isOnCooldown, setIsOnCooldown] = useState(false); // New state to manage cooldown
  const [scanStatus, setScanStatus] = useState<'success' | 'error'>();
  const [statusMessage, setStatusMessage] = useState('');
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<EventPrizeModalContent>({
    title: '',
    subtitle: '',
    image: ``,
    name: '',
    body: '',
    showConfetti: false,
    showAssetsButton: false,
  });

  const stateRef = useRef<StateRefObject>({
    isScanning: false,
    isOnCooldown: false,
    isProcessing: false,
  });

  const enableCooldown = () => {
    setIsOnCooldown(true); // Activate cooldown
    setTimeout(() => {
      setIsOnCooldown(false); // Deactivate cooldown after 3000 milliseconds (3 seconds)
    }, 1000);
  };

  useEffect(() => {
    stateRef.current.isScanning = isScanning;
    stateRef.current.isOnCooldown = isOnCooldown;
    // Update other state variables in stateRef.current as needed
  }, [isScanning, isOnCooldown]);

  useEffect(() => {
    if (scanStatus) {
      toast({
        title: scanStatus === 'success' ? 'Success' : 'Error',
        description: statusMessage,
        status: scanStatus,
        duration: 5000,
        isClosable: true,
      });
      // Reset the status after showing the message
      setTimeout(() => {
        setScanStatus(undefined);
      }, 5000);
    }
  }, [scanStatus, statusMessage, toast]);

  // Helper function to process the claim event drop
  async function processClaimEventDrop(qrDataSplit, setModalContent, setClaimModalOpen) {
    const { shouldBreak, isScavenger, numFound, numRequired, name, image, amount } =
      await claimEventDrop({
        dropInfo,
        qrDataSplit,
        accountId,
        setScanStatus,
        setStatusMessage,
        secretKey,
      });

    if (shouldBreak) {
      return true;
    }

    const tokenAmount: string | undefined = amount ? keypomInstance.yoctoToNear(amount) : undefined;

    const content = {
      title: '',
      subtitle: '',
      image: `${CLOUDFLARE_IPFS}/${image as string}`,
      name,
      body: '',
      showConfetti: false,
      showAssetsButton: false,
      showCloseButton: true, // Default to show only close button
    };

    if (isScavenger) {
      if (numFound === 1 && numRequired > 1) {
        // Case 2: Scavenger hunt started
        content.title = 'Scavenger Hunt Started';
        content.subtitle = `${parseInt(numRequired) - 1} piece(s) left.`;
        content.body = `When you find all the pieces, you'll receive ${
          tokenAmount ? `${tokenAmount} tokens!` : `an exclusive NFT!`
        }`;
        content.showConfetti = false;
      } else if (numFound < numRequired) {
        // Case 3: Piece found but scavenger hunt not completed
        content.title = 'Piece Found';
        content.subtitle = `Found ${Number(numFound)}/${numRequired as string} pieces. Keep going!`;
        content.showConfetti = false;
      } else if (numFound === numRequired) {
        // Case 4: Scavenger hunt completed
        content.title = 'Scavenger Hunt Completed';
        content.subtitle = 'Congratulations! You have found all the pieces!';
        content.body = `You've received ${
          tokenAmount ? `${tokenAmount} tokens!` : `an exclusive NFT!`
        }`;
        content.showConfetti = true;
        content.showAssetsButton = true; // Assume they get rewards that can be viewed on assets page
      }
    } else {
      if (amount) {
        // Case 5: Tokens claimed with no scavenger involvement
        content.title = 'Tokens Claimed';
        content.subtitle = `Successfully claimed ${keypomInstance.yoctoToNear(amount)} tokens.`;
        content.showConfetti = true;
        content.showAssetsButton = true; // Link to assets page as tokens are involved
      } else {
        // Case 1: NFT claimed with no scavenger involvement
        content.title = 'NFT Claimed';
        content.subtitle = `Successfully claimed ${name as string}.`;
        content.showAssetsButton = true;
        content.showConfetti = true; // Celebratory confetti for claiming an NFT
      }
    }

    setModalContent(content);
    setClaimModalOpen(true);

    return false;
  }

  // The refactored handleScanResult function
  const handleScanResult = async (result) => {
    if (result && !stateRef.current.isScanning && !stateRef.current.isOnCooldown) {
      setIsScanning(true);
      setScanStatus(undefined);

      try {
        const qrData = result.getText();
        console.log('QR Data: ', qrData);

        const qrDataSplit = qrData.split(':');
        const type = qrDataSplit[0];
        const data = qrDataSplit[1];

        if (!type || !data) {
          throw new Error('QR data format is incorrect');
        }

        if (type === 'token' || type === 'nft') {
          await processClaimEventDrop(qrDataSplit, setModalContent, setClaimModalOpen);
        } else if (type === 'food') {
          console.log('Handling food type with data:', data);
          // Handle food type logic here
        } else if (type === 'merch') {
          console.log('Handling merch type with data:', data);
          // Handle merch type logic here
        } else {
          console.error('Unhandled QR data type:', type);
          throw new Error('Invalid QR data type');
        }
      } catch (error) {
        console.error('Scan failed', error);
        setScanStatus('error');
        setStatusMessage('Error scanning item');
      } finally {
        setIsScanning(false);
        enableCooldown();
      }
    }
  };

  return (
    <>
      <EventPrizeClaimedModal
        eventInfo={eventInfo}
        isOpen={claimModalOpen}
        modalContent={modalContent}
        onAssetsClicked={() => setSelectedTab(1)}
        onClose={() => {
          setClaimModalOpen(false);
        }}
      />
      <Center>
        <VStack gap={{ base: 'calc(24px + 8px)', md: 'calc(32px + 10px)' }}>
          <Skeleton fadeDuration={1} isLoaded={!isLoading}>
            <Heading
              fontSize={{ base: '2xl', md: '3xl' }}
              fontWeight="500"
              paddingBottom="0"
              textAlign="center"
            >
              {isLoading ? (
                'Loading ticket...'
              ) : (
                <VStack>
                  <Heading
                    color={eventInfo?.qrPage?.title?.color}
                    fontFamily={eventInfo?.qrPage?.title?.fontFamily}
                    fontSize={{ base: '6xl', md: '8xl' }}
                    fontWeight="500"
                    textAlign="center"
                  >
                    Scan
                  </Heading>
                </VStack>
              )}
            </Heading>
          </Skeleton>

          <IconBox
            bg={eventInfo?.qrPage?.content?.border || 'border.box'}
            icon={
              <Skeleton isLoaded={!isLoading}>
                {eventInfo?.qrPage?.boxIcon?.image ? (
                  <Image
                    height={{ base: '10', md: '12' }}
                    src={`${CLOUDFLARE_IPFS}/${eventInfo.qrPage.boxIcon.image}`}
                    width={{ base: '10', md: '12' }}
                  />
                ) : (
                  <TicketIcon height={{ base: '8', md: '10' }} width={{ base: '8', md: '10' }} />
                )}
              </Skeleton>
            }
            iconBg={eventInfo?.qrPage?.boxIcon?.bg || 'blue.100'}
            iconBorder={eventInfo?.qrPage?.boxIcon?.border || 'border.round'}
            maxW="345px"
            minW={{ base: '90vw', md: '345px' }}
            p="0"
            pb="0"
            w="90vh"
          >
            <Box h="full">
              <BoxWithShape bg="white" borderTopRadius="8xl" showNotch={false} w="full">
                {isLoading ? (
                  <Skeleton height="200px" width="full" />
                ) : (
                  <Flex
                    align="center"
                    flexDir="column"
                    pb={{ base: '3', md: '5' }}
                    pt={{ base: '10', md: '16' }}
                    px={{ base: '10', md: '8' }}
                  >
                    <VStack w="100%">
                      <VStack
                        alignItems="center"
                        borderColor="gray.200"
                        borderRadius="24px"
                        borderWidth="2px"
                        h="100%"
                        maxHeight="500px"
                        maxW="500px"
                        overflow="hidden"
                        position="relative" // Ensure this container is positioned relatively
                        spacing={4}
                        w="full"
                      >
                        <QrReader
                          constraints={{ facingMode }}
                          containerStyle={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '24px',
                          }}
                          scanDelay={1000}
                          ViewFinder={() => (
                            <ViewFinder style={{ border: '20px solid rgba(0, 0, 0, 0.3)' }} />
                          )}
                          onResult={handleScanResult}
                        />
                        {/* Overlay Component */}
                        <LoadingOverlay
                          isVisible={isOnCooldown || isScanning}
                          status={scanStatus}
                        />
                      </VStack>
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
                        onClick={() => {
                          setFacingMode((prevMode) =>
                            prevMode === 'environment' ? 'user' : 'environment',
                          );
                        }}
                      >
                        FLIP
                      </Button>
                    </VStack>
                  </Flex>
                )}
              </BoxWithShape>
              <Flex
                align="center"
                bg="gray.50"
                borderBottomRadius="8xl"
                flexDir="column"
                pb="2"
                pt="2"
                px="6"
              >
                <Text
                  color="#844AFF"
                  fontFamily="denverBody"
                  fontWeight="600"
                  size={{ base: 'xl', md: '2xl' }}
                  textAlign="center"
                >
                  Scan to participate
                </Text>
                {/* Start of the grid for Spork Details */}
                <Grid
                  gap={6} // Space between grid items
                  py={2} // Padding on the top and bottom
                  templateColumns={{ base: 'repeat(2, 1fr)' }} // Responsive grid layout
                  width="full" // Full width of the parent container
                >
                  {/* Left column for earning methods */}
                  <Box>
                    <Text
                      color="black"
                      fontFamily="denverBody"
                      fontSize="lg"
                      fontWeight="500"
                      mb={0}
                      textAlign="left"
                    >
                      To Earn:
                    </Text>
                    <VStack align="stretch" spacing={1} textAlign="left">
                      <Text color="black" fontFamily="denverBody" fontSize="sm" fontWeight="400">
                        Attend talks
                      </Text>
                      <Text color="black" fontFamily="denverBody" fontSize="sm" fontWeight="400">
                        Visit booths
                      </Text>
                      <Text color="black" fontFamily="denverBody" fontSize="sm" fontWeight="400">
                        Scavenger hunts
                      </Text>
                      <Text color="black" fontFamily="denverBody" fontSize="sm" fontWeight="400">
                        Sponsor quizzes
                      </Text>
                    </VStack>
                  </Box>

                  {/* Right column for spending methods */}
                  <Box>
                    <Text
                      color="black"
                      fontFamily="denverBody"
                      fontSize="lg"
                      fontWeight="500"
                      mb={0}
                      textAlign="right"
                    >
                      Spend On:
                    </Text>
                    <VStack align="stretch" spacing={1} textAlign="right">
                      <Text color="black" fontFamily="denverBody" fontSize="sm" fontWeight="400">
                        Food Trucks
                      </Text>
                      <Text color="black" fontFamily="denverBody" fontSize="sm" fontWeight="400">
                        Merch Booths
                      </Text>
                      <Text color="black" fontFamily="denverBody" fontSize="sm" fontWeight="400">
                        Raffles
                      </Text>
                      <Text color="black" fontFamily="denverBody" fontSize="sm" fontWeight="400">
                        NFTs
                      </Text>
                    </VStack>
                  </Box>
                </Grid>
                <Text
                  _hover={{
                    textDecoration: 'underline', // Underline on hover like a typical hyperlink
                    color: 'blue.600', // Optional: Change color on hover for better user feedback
                  }}
                  color="gray.600" // Use your theme's blue or any color that indicates interactivity
                  cursor="pointer" // Makes the text behave like a clickable link
                  textDecoration="underline" // Remove underline from text
                  transition="color 0.2s, text-decoration 0.2s" // Smooth transition for hover effects
                  onClick={() => setSelectedTab(0)}
                >
                  View Profile QR Code
                </Text>
              </Flex>
            </Box>
          </IconBox>
        </VStack>
      </Center>
    </>
  );
}
