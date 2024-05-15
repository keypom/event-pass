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

import ScavengerModal from './modals/ScavengerModal';
import MerchModal from './modals/MerchModal';
import RaffleModal from './modals/RaffleModal';
import SponsorModal from './modals/SponsorModal';
import ProfileTransferModal from './modals/ProfileTransferModal';
import { claimEventDrop } from './helpers';
import NFTModal from './modals/NFTModal';
import TokenModal from './modals/TokenModal';

interface StateRefObject {
  isScanning: boolean;
  isOnCooldown: boolean;
  isProcessing: boolean;
}

interface ScanningPageProps {
  eventInfo: FunderEventMetadata;
  ticketInfo: TicketInfoMetadata;
  ticketInfoExtra: TicketMetadataExtra;
  dropInfo: EventDrop;
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

  const [modalOpen, setModalOpen] = useState(true);
  const [modalType, setModalType] = useState('token');
  const [modalProps, setModalProps] = useState<any>({});

  const stateRef = useRef<StateRefObject>({
    isScanning: false,
    isOnCooldown: false,
    isProcessing: false,
  });

  const enableCooldown = () => {
    setIsOnCooldown(true); // Activate cooldown
    setTimeout(() => {
      setIsOnCooldown(false); // Deactivate cooldown after 1000 milliseconds (1 second)
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

  const handleScanResult = async (result: any) => {
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

        switch (type) {
          case 'token':
          case 'nft': {
            const { alreadyClaimed, isScavenger, numFound, numRequired, name, image, amount } =
              await claimEventDrop({
                dropInfo,
                qrDataSplit,
                accountId,
                setScanStatus,
                setStatusMessage,
                secretKey,
              });

            if (alreadyClaimed) {
              return;
            }

            const tokenAmount = amount ? keypomInstance.yoctoToNear(amount) : undefined;

            if (isScavenger) {
              setModalType('scavenger');
              setModalProps({ numFound, numRequired, tokenAmount, image, name });
            } else if (amount) {
              setModalType('token');
              setModalProps({ tokenAmount });
            } else {
              setModalType('nft');
              setModalProps({ name });
            }
            break;
          }
          case 'food':
            setModalType('merch');
            setModalProps({
              title: 'Food Purchase',
              subtitle: `You are purchasing food`,
              body: `How much $NCON would you like to transfer to the vendor?`,
            });
            break;
          case 'merch':
            setModalType('merch');
            setModalProps({
              title: 'Merch Purchase',
              subtitle: `You are purchasing merchandise`,
              body: `How much $NCON would you like to transfer to the vendor?`,
            });
            break;
          case 'raffle':
            setModalType('raffle');
            setModalProps({
              title: 'Raffle Entry',
              subtitle: `Enter the raffle for a chance to win`,
              body: `How many tickets would you like to purchase?`,
            });
            break;
          case 'profile':
            setModalType('profileTransfer');
            setModalProps({
              title: 'Transfer $NCON',
              subtitle: `Send $NCON to another user`,
              body: `How much $NCON would you like to transfer?`,
            });
            break;
          case 'sponsor':
            setModalType('sponsor');
            setModalProps({
              title: 'Sponsor Quiz',
              subtitle: `Answer the quiz to earn rewards`,
              body: `Fill in the details to earn an NFT!`,
              questions: [
                'Question 1: What is NEAR?',
                'Question 2: What is the latest NEAR feature?',
                'Question 3: What is NEARCON?',
              ],
            });
            break;
          default:
            console.error('Unhandled QR data type:', type);
            throw new Error('Invalid QR data type');
        }

        setModalOpen(true);
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
      <ScavengerModal
        isOpen={modalOpen && modalType === 'scavenger'}
        onClose={() => {
          setModalOpen(false);
        }}
        {...modalProps}
      />
      <NFTModal
        isOpen={modalOpen && modalType === 'nft'}
        onClose={() => {
          setModalOpen(false);
        }}
        {...modalProps}
      />
      <TokenModal
        isOpen={modalOpen && modalType === 'token'}
        onClose={() => {
          setModalOpen(false);
        }}
        {...modalProps}
      />
      <MerchModal
        isOpen={modalOpen && modalType === 'merch'}
        onClose={() => {
          setModalOpen(false);
        }}
        {...modalProps}
      />
      <RaffleModal
        isOpen={modalOpen && modalType === 'raffle'}
        onClose={() => {
          setModalOpen(false);
        }}
        {...modalProps}
      />
      <SponsorModal
        isOpen={modalOpen && modalType === 'sponsor'}
        onClose={() => {
          setModalOpen(false);
        }}
        {...modalProps}
      />
      <ProfileTransferModal
        isOpen={modalOpen && modalType === 'profileTransfer'}
        onClose={() => {
          setModalOpen(false);
        }}
        {...modalProps}
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
                    color={eventInfo.styles.title.color}
                    fontFamily={eventInfo.styles.title.fontFamily}
                    fontSize={eventInfo.styles.title.fontSize}
                    fontWeight={eventInfo.styles.title.fontWeight}
                    textAlign="center"
                  >
                    Scan
                  </Heading>
                </VStack>
              )}
            </Heading>
          </Skeleton>

          <IconBox
            bg={eventInfo.styles.border.color || 'border.box'}
            icon={
              <Skeleton isLoaded={!isLoading}>
                {eventInfo.styles.icon.image ? (
                  <Image
                    height={{ base: '10', md: '12' }}
                    src={`${CLOUDFLARE_IPFS}/${eventInfo.styles.icon.image}`}
                    width={{ base: '10', md: '12' }}
                  />
                ) : (
                  <TicketIcon height={{ base: '8', md: '10' }} width={{ base: '8', md: '10' }} />
                )}
              </Skeleton>
            }
            iconBg={eventInfo.styles.icon.bg || 'blue.100'}
            iconBorder={eventInfo.styles.icon.border || 'border.round'}
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
                  color={eventInfo.styles.h1.color}
                  fontFamily={eventInfo.styles.h1.fontFamily}
                  fontSize={eventInfo.styles.h1.fontSize}
                  fontWeight={eventInfo.styles.h1.fontWeight}
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
                      color={eventInfo.styles.h2.color}
                      fontFamily={eventInfo.styles.h2.fontFamily}
                      fontSize={eventInfo.styles.h2.fontSize}
                      fontWeight={eventInfo.styles.h2.fontWeight}
                      mb={0}
                      textAlign="left"
                    >
                      To Earn:
                    </Text>
                    <VStack align="stretch" spacing={1} textAlign="left">
                      <Text
                        color={eventInfo.styles.h3.color}
                        fontFamily={eventInfo.styles.h3.fontFamily}
                        fontSize="sm"
                        fontWeight={eventInfo.styles.h3.fontWeight}
                      >
                        Attend talks
                      </Text>
                      <Text
                        color={eventInfo.styles.h3.color}
                        fontFamily={eventInfo.styles.h3.fontFamily}
                        fontSize="sm"
                        fontWeight={eventInfo.styles.h3.fontWeight}
                      >
                        Visit booths
                      </Text>
                      <Text
                        color={eventInfo.styles.h3.color}
                        fontFamily={eventInfo.styles.h3.fontFamily}
                        fontSize="sm"
                        fontWeight={eventInfo.styles.h3.fontWeight}
                      >
                        Scavenger hunts
                      </Text>
                      <Text
                        color={eventInfo.styles.h3.color}
                        fontFamily={eventInfo.styles.h3.fontFamily}
                        fontSize="sm"
                        fontWeight={eventInfo.styles.h3.fontWeight}
                      >
                        Sponsor quizzes
                      </Text>
                    </VStack>
                  </Box>

                  {/* Right column for spending methods */}
                  <Box>
                    <Text
                      color={eventInfo.styles.h2.color}
                      fontFamily={eventInfo.styles.h2.fontFamily}
                      fontSize={eventInfo.styles.h2.fontSize}
                      fontWeight={eventInfo.styles.h2.fontWeight}
                      mb={0}
                      textAlign="right"
                    >
                      Spend On:
                    </Text>
                    <VStack align="stretch" spacing={1} textAlign="right">
                      <Text
                        color={eventInfo.styles.h3.color}
                        fontFamily={eventInfo.styles.h3.fontFamily}
                        fontSize="sm"
                        fontWeight={eventInfo.styles.h3.fontWeight}
                      >
                        Food Trucks
                      </Text>
                      <Text
                        color={eventInfo.styles.h3.color}
                        fontFamily={eventInfo.styles.h3.fontFamily}
                        fontSize="sm"
                        fontWeight={eventInfo.styles.h3.fontWeight}
                      >
                        Merch Booths
                      </Text>
                      <Text
                        color={eventInfo.styles.h3.color}
                        fontFamily={eventInfo.styles.h3.fontFamily}
                        fontSize="sm"
                        fontWeight={eventInfo.styles.h3.fontWeight}
                      >
                        Raffles
                      </Text>
                      <Text
                        color={eventInfo.styles.h3.color}
                        fontFamily={eventInfo.styles.h3.fontFamily}
                        fontSize="sm"
                        fontWeight={eventInfo.styles.h3.fontWeight}
                      >
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
