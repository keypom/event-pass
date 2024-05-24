import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  Grid,
  Heading,
  Image,
  Input,
  Skeleton,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { accountExists, getPubFromSecret } from 'keypom-js';

import { IconBox } from '@/components/IconBox';
import { TicketIcon } from '@/components/Icons';
import { BoxWithShape } from '@/components/BoxWithShape';
import {
  type TicketInfoMetadata,
  type TicketMetadataExtra,
  type FunderEventMetadata,
  type EventDrop,
} from '@/lib/eventsHelpers';
import keypomInstance from '@/lib/keypom';

interface WelcomePageProps {
  eventInfo?: FunderEventMetadata;
  ticketInfo?: TicketInfoMetadata;
  ticketInfoExtra?: TicketMetadataExtra;
  dropInfo?: EventDrop;
  ticker: string;
  tokensToClaim: string;
  isLoading: boolean;
  eventId: string;
  funderId: string;
  factoryAccount: string;
  secretKey: string;
}

export default function WelcomePage({
  eventInfo,
  ticketInfoExtra,
  dropInfo,
  ticketInfo,
  isLoading,
  factoryAccount,
  eventId,
  funderId,
  ticker,
  tokensToClaim,
  secretKey,
}: WelcomePageProps) {
  const [username, setUsername] = useState<string>('');
  const [isValidUsername, setIsValidUsername] = useState<boolean>(true);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const toast = useToast();

  const handleChangeUsername = (event) => {
    setIsValidUsername(true);
    const { value } = event.target;
    setUsername(value);
  };

  const handleBeginJourney = async () => {
    const isAvailable = await checkUsernameAvailable();
    if (!isAvailable) {
      setIsValidUsername(false);
      return;
    }

    const accountId = `${username}.${factoryAccount}`;
    try {
      setIsClaiming(true);
      await keypomInstance.claimEventTicket(
        secretKey,
        {
          new_account_id: accountId,
          new_public_key: getPubFromSecret(secretKey),
        },
        true,
      );
      setIsClaiming(false);
      window.location.reload();
    } catch (e) {
      setIsClaiming(false);
      toast({
        title: 'Error claiming ticket',
        description: 'Please contact support.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error(e);
    }
  };

  const checkUsernameAvailable = async () => {
    if (!username) {
      return false;
    }
    const accountId = `${username}.${factoryAccount}`;
    console.log('Checking username', accountId);
    const doesExist = await accountExists(accountId);
    console.log('Does exist', doesExist);
    if (doesExist) {
      setIsValidUsername(false);
      return false;
    }
    return true;
  };

  return (
    <VStack
      backgroundImage={
        eventInfo?.styles?.background && `/assets/demos/consensus/${eventInfo.styles.background}`
      }
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      minH="100vh"
      py="2"
      width="100vw"
    >
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
                    color={eventInfo?.styles.title.color}
                    fontFamily={eventInfo?.styles.title.fontFamily}
                    fontSize={eventInfo?.styles.title.fontSize}
                    fontWeight={eventInfo?.styles.title.fontWeight}
                    textAlign="center"
                  >
                    Welcome
                  </Heading>
                </VStack>
              )}
            </Heading>
          </Skeleton>

          <IconBox
            bg={eventInfo?.styles.border.border || 'border.box'}
            icon={
              <Skeleton isLoaded={!isLoading}>
                {eventInfo?.styles.icon.image ? (
                  <Image
                    height={{ base: '10', md: '12' }}
                    src={`/assets/demos/consensus/${eventInfo.styles.icon.image}`}
                    width={{ base: '10', md: '12' }}
                  />
                ) : (
                  <TicketIcon height={{ base: '8', md: '10' }} width={{ base: '8', md: '10' }} />
                )}
              </Skeleton>
            }
            iconBg={eventInfo?.styles.icon.bg || 'blue.100'}
            iconBorder={eventInfo?.styles.icon.border || 'border.round'}
            maxW={{ base: '345px', md: '30rem' }}
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
                    p={{ base: '3', md: '8' }}
                    pt={{ base: '10', md: '16' }}
                    px="6"
                  >
                    <Text
                      color={eventInfo?.styles.h1.color}
                      fontFamily={eventInfo?.styles.h1.fontFamily}
                      fontSize={eventInfo?.welcomePage.title.fontSize}
                      fontWeight={eventInfo?.styles.h1.fontWeight}
                      textAlign="center"
                    >
                      {eventInfo?.welcomePage.title.text}
                    </Text>
                    <Text
                      color={eventInfo?.styles.h3.color}
                      fontFamily={eventInfo?.styles.h3.fontFamily}
                      fontSize="sm"
                      fontWeight={eventInfo?.styles.h3.fontWeight}
                      mb="5"
                      textAlign="center"
                    >
                      To get started, enter a username.
                    </Text>
                    <FormControl isInvalid={!isValidUsername} mb="5">
                      <Input
                        backgroundColor="white"
                        border="1px solid"
                        borderColor={!isValidUsername ? 'red.500' : eventInfo?.styles.h1.color}
                        borderRadius="12px"
                        color="black"
                        fontFamily={eventInfo?.styles.h3.fontFamily}
                        fontSize={{ base: 'sm', md: 'md' }}
                        fontWeight={eventInfo?.styles.h3.fontWeight}
                        height={{ base: '38px', md: '48px' }}
                        id="username"
                        placeholder="Username"
                        px="6"
                        sx={{
                          '::placeholder': {
                            color: 'black', // Placeholder text color
                          },
                        }}
                        value={username}
                        onBlur={checkUsernameAvailable}
                        onChange={handleChangeUsername}
                      />
                      <FormErrorMessage>Username is invalid or already taken.</FormErrorMessage>
                    </FormControl>
                    <Text
                      color={eventInfo?.styles.h3.color}
                      fontFamily={eventInfo?.styles.h3.fontFamily}
                      fontSize="sm"
                      fontWeight={eventInfo?.styles.h3.fontWeight}
                      mb="3"
                      textAlign="center"
                    >
                      Your ticket comes with{' '}
                      <Text
                        as="span"
                        color="black"
                        fontWeight={eventInfo?.styles.h3.fontWeight}
                        size={{ base: 'lg', md: 'xl' }}
                      >
                        {tokensToClaim} ${ticker}
                      </Text>
                    </Text>
                    <Skeleton borderRadius="12px" isLoaded={!isLoading}>
                      <Image
                        alt={`Event image for ${eventInfo?.name}`}
                        borderRadius="12px"
                        height="140px"
                        mb="2"
                        objectFit="contain"
                        src={`/assets/demos/consensus/${ticketInfo?.media}`}
                      />
                    </Skeleton>
                    <Heading
                      color="black"
                      fontFamily={eventInfo?.styles.title.fontFamily}
                      fontSize={{ base: '4xl', md: '5xl' }}
                      fontWeight={eventInfo?.styles.title.fontWeight}
                      textAlign="center"
                    >
                      {ticketInfo?.title}
                    </Heading>
                  </Flex>
                )}
              </BoxWithShape>
              <Flex
                align="center"
                bg="gray.50"
                borderBottomRadius="8xl"
                flexDir="column"
                pb="6"
                pt="2"
                px="6"
              >
                <Text
                  color={eventInfo?.styles.h1.color}
                  fontFamily={eventInfo?.styles.h1.fontFamily}
                  fontWeight={eventInfo?.styles.h1.fontWeight}
                  size={{ base: 'xl', md: '2xl' }}
                  textAlign="center"
                >
                  ${ticker} Details
                </Text>
                {/* Start of the grid for Spork Details */}
                <Grid
                  gap={6} // Space between grid items
                  py={4} // Padding on the top and bottom
                  templateColumns={{ base: 'repeat(2, 1fr)' }} // Responsive grid layout
                  width="full" // Full width of the parent container
                >
                  {/* Left column for earning methods */}
                  <Box>
                    <Text
                      color={eventInfo?.styles.h2.color}
                      fontFamily={eventInfo?.styles.h2.fontFamily}
                      fontSize={eventInfo?.styles.h2.fontSize}
                      fontWeight={eventInfo?.styles.h2.fontWeight}
                      mb={0}
                      textAlign="left"
                    >
                      Earn By:
                    </Text>
                    <VStack align="stretch" spacing={1} textAlign="left">
                      <Text
                        color={eventInfo?.styles.h3.color}
                        fontFamily={eventInfo?.styles.h3.fontFamily}
                        fontSize="sm"
                        fontWeight={eventInfo?.styles.h3.fontWeight}
                      >
                        Attending Talks
                      </Text>
                      <Text
                        color={eventInfo?.styles.h3.color}
                        fontFamily={eventInfo?.styles.h3.fontFamily}
                        fontSize="sm"
                        fontWeight={eventInfo?.styles.h3.fontWeight}
                      >
                        Visiting Booths
                      </Text>
                      <Text
                        color={eventInfo?.styles.h3.color}
                        fontFamily={eventInfo?.styles.h3.fontFamily}
                        fontSize="sm"
                        fontWeight={eventInfo?.styles.h3.fontWeight}
                      >
                        Scavenger Hunts
                      </Text>
                      <Text
                        color={eventInfo?.styles.h3.color}
                        fontFamily={eventInfo?.styles.h3.fontFamily}
                        fontSize="sm"
                        fontWeight={eventInfo?.styles.h3.fontWeight}
                      >
                        Sponsor Quizzes
                      </Text>
                    </VStack>
                  </Box>

                  {/* Right column for spending methods */}
                  <Box>
                    <Text
                      color={eventInfo?.styles.h2.color}
                      fontFamily={eventInfo?.styles.h2.fontFamily}
                      fontSize={eventInfo?.styles.h2.fontSize}
                      fontWeight={eventInfo?.styles.h2.fontWeight}
                      mb={0}
                      textAlign="right"
                    >
                      Spend On:
                    </Text>
                    <VStack align="stretch" spacing={1} textAlign="right">
                      <Text
                        color={eventInfo?.styles.h3.color}
                        fontFamily={eventInfo?.styles.h3.fontFamily}
                        fontSize="sm"
                        fontWeight={eventInfo?.styles.h3.fontWeight}
                      >
                        Food
                      </Text>
                      <Text
                        color={eventInfo?.styles.h3.color}
                        fontFamily={eventInfo?.styles.h3.fontFamily}
                        fontSize="sm"
                        fontWeight={eventInfo?.styles.h3.fontWeight}
                      >
                        Merch
                      </Text>
                      <Text
                        color={eventInfo?.styles.h3.color}
                        fontFamily={eventInfo?.styles.h3.fontFamily}
                        fontSize="sm"
                        fontWeight={eventInfo?.styles.h3.fontWeight}
                      >
                        Raffles
                      </Text>
                      <Text
                        color={eventInfo?.styles.h3.color}
                        fontFamily={eventInfo?.styles.h3.fontFamily}
                        fontSize="sm"
                        fontWeight={eventInfo?.styles.h3.fontWeight}
                      >
                        NFTs
                      </Text>
                    </VStack>
                  </Box>
                </Grid>
                <Button
                  backgroundColor={eventInfo?.styles.buttons.primary.bg}
                  color={eventInfo?.styles.buttons.primary.color}
                  fontFamily={eventInfo?.styles.buttons.primary.fontFamily}
                  fontSize="xl"
                  fontWeight={eventInfo?.styles.buttons.primary.fontWeight}
                  h={eventInfo?.styles.buttons.primary.h}
                  isDisabled={!isValidUsername}
                  isLoading={isClaiming}
                  sx={eventInfo?.styles.buttons.primary.sx}
                  variant="outline"
                  w="full"
                  onClick={handleBeginJourney}
                >
                  BEGIN JOURNEY
                </Button>
              </Flex>
            </Box>
          </IconBox>
        </VStack>
      </Center>
    </VStack>
  );
}
