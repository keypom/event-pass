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
import { type OnResultFunction, QrReader } from 'react-qr-reader';
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
import EventPrizeClaimedModal from '@/components/AppModal/EventPrizeClaimedModal';

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
  const [isErr, setIsErr] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isOnCooldown, setIsOnCooldown] = useState(false); // New state to manage cooldown
  const [scanStatus, setScanStatus] = useState<'success' | 'error'>();
  const [statusMessage, setStatusMessage] = useState('');
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: 'title',
    body: 'body',
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

  const handleScanResult: OnResultFunction = async (result) => {
    if (result && !stateRef.current.isScanning && !stateRef.current.isOnCooldown) {
      setIsScanning(true); // Start scanning
      setScanStatus(undefined); // Reset the status message
      try {
        const qrData = result.getText();
        console.log('QR Data: ', qrData);

        const split = qrData.split(':');
        const type = split[0];
        const data = split[1];

        if (type && data) {
          switch (type) {
            case 'token':
              const factoryAccount = dropInfo?.asset_data[1].config.root_account_id;
              console.log('Data: ', data);

              let scavId = data;
              let isScavenger = false;
              if (split.length >= 3) {
                isScavenger = true;
                scavId = split[2];
              }
              console.log('Scavenger ID:', scavId, 'Is scavenger:', isScavenger);
              console.log('Split:', split);

              const tokenDropInfo = await keypomInstance.viewCall({
                contractId: factoryAccount,
                methodName: 'get_drop_information',
                args: { drop_id: data },
              });
              console.log('Token drop info:', tokenDropInfo);
              const claimsForAccount: string[] = await keypomInstance.viewCall({
                contractId: factoryAccount,
                methodName: 'claims_for_account',
                args: { account_id: accountId, drop_id: data },
              });
              console.log('Claims for account:', claimsForAccount);

              // If it's a scavenger hunt, the scavID will be in the claims for account when claimed
              // If it's a regular drop, when claiming, the drop ID will be in the list as well
              // So all we need to check is if the scavenger ID is in the list (since it defaults to the drop ID)
              if (claimsForAccount.includes(scavId)) {
                setScanStatus('error');
                setStatusMessage('You already scanned this drop');
                return;
              }

              console.log('Token drop info:', tokenDropInfo);
              await keypomInstance.claimEventTokenDrop({
                secretKey,
                accountId,
                dropId: data,
                scavId,
                factoryAccount,
              });

              if (isScavenger) {
                let content = {
                  title: 'Piece Found',
                  body: `${claimsForAccount.length + 1} / ${
                    tokenDropInfo?.scavenger_ids.length as string
                  } QRs found for scavenger hunt.`,
                };

                if (claimsForAccount.length + 1 === tokenDropInfo?.scavenger_ids.length) {
                  content = {
                    title: 'Scavenger Hunt Complete',
                    body: 'You have completed the scavenger hunt!',
                  };
                }
                setModalContent(content);
                setClaimModalOpen(true);
              } else {
                setScanStatus('success');
                setStatusMessage(
                  `Successfully claimed ${keypomInstance.yoctoToNear(
                    tokenDropInfo?.amount,
                  )} tokens.`,
                );
              }

              break;
            case 'food':
              console.log('Handling food type with data:', data);
              // Handle food type logic here
              break;
            case 'merch':
              console.log('Handling merch type with data:', data);
              // Handle merch type logic here
              break;
            default:
              console.error('Unhandled QR data type:', type);
              throw new Error('Invalid QR data type');
          }
        } else {
          throw new Error('QR data format is incorrect');
        }
      } catch (error) {
        console.error('Scan failed', error);
        setScanStatus('error');
        setStatusMessage('Error scanning item');
      } finally {
        setIsScanning(false); // End scanning regardless of success or error
        enableCooldown(); // Enable cooldown to prevent multiple scans
      }
    }
  };

  return (
    <>
      <EventPrizeClaimedModal
        body={modalContent.body}
        isOpen={claimModalOpen}
        showConfetti={true}
        title={modalContent.title}
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
                        w="full"
                        onClick={() => {
                          setFacingMode((prevMode) =>
                            prevMode === 'environment' ? 'user' : 'environment',
                          );
                        }}
                      >
                        Flip Camera
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
                  color="#C5C5C5" // Use your theme's blue or any color that indicates interactivity
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