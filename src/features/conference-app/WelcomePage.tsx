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
  useMediaQuery,
} from '@chakra-ui/react';
import { useState } from 'react';
import { accountExists, getPubFromSecret } from 'keypom-js';

import { IconBox } from '@/components/IconBox';
import { BoxWithShape } from '@/components/BoxWithShape';
import {
  type TicketInfoMetadata,
  type TicketMetadataExtra,
  type FunderEventMetadata,
  type EventDrop,
} from '@/lib/eventsHelpers';
import keypomInstance from '@/lib/keypom';

const sizeConfig = {
  img: {
    base: { borderRadius: '8px', h: '80px' },
    md: { borderRadius: '12px', h: '100px' },
    lg: { borderRadius: '16px', h: '120px' },
  },
  font: {
    base: {
      h1: '24px',
      h2: '20px',
      h3: '16px',
      button: '16px',
    },
    md: {
      h1: '28px',
      h2: '22px',
      h3: '18px',
      button: '18px',
    },
    lg: {
      h1: '32px',
      h2: '24px',
      h3: '20px',
      button: '20px',
    },
  },
};

const getFontSize = (isLargerThan768, isLargerThan1024) => {
  if (isLargerThan1024) return sizeConfig.font.lg;
  if (isLargerThan768) return sizeConfig.font.md;
  return sizeConfig.font.base;
};

const getImgSize = (isLargerThan768, isLargerThan1024) => {
  if (isLargerThan1024) return sizeConfig.img.lg;
  if (isLargerThan768) return sizeConfig.img.md;
  return sizeConfig.img.base;
};

interface WelcomePageProps {
  eventInfo: FunderEventMetadata;
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

const accountAddressPatternNoSubaccount = /^([a-z\d]+[-_])*[a-z\d]+$/;

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

  const [isLargerThan768] = useMediaQuery('(min-height: 768px)');
  const [isLargerThan1024] = useMediaQuery('(min-height: 1024px)');

  const fontSize = getFontSize(isLargerThan768, isLargerThan1024);
  const imgSize = getImgSize(isLargerThan768, isLargerThan1024);

  const handleChangeUsername = (event) => {
    const userInput = event.target.value.toLowerCase();

    if (userInput.length !== 0) {
      const isValid = accountAddressPatternNoSubaccount.test(userInput);
      setIsValidUsername(isValid);
    } else {
      setIsValidUsername(true);
    }

    setUsername(userInput);
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
    try {
      const accountId = `${username}.${factoryAccount}`;
      console.log('Checking username', accountId);
      const doesExist = await accountExists(accountId);
      console.log('Does exist', doesExist);
      if (doesExist) {
        setIsValidUsername(false);
        return false;
      }

      return true;
    } catch (e) {
      setIsValidUsername(false);
      return false;
    }
  };

  return (
    <Flex
      backgroundImage={
        eventInfo?.styles?.background && `assets/demos/consensus/${eventInfo.styles.background}`
      }
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      direction="column"
      h="100vh"
      width="100vw"
    >
      <Box flex="1" overflowY="auto" pt="3">
        <Center maxH="100vh">
          <VStack
            gap={{ base: '16px', md: '24px', lg: '32px' }}
            h="100%"
            overflowY="auto"
            pt="10"
            spacing="4"
            w={{ base: '90vw', md: '90%', lg: '80%' }}
          >
            <IconBox
              bg={eventInfo.styles.border.border || 'border.box'}
              h="full"
              icon={
                <Skeleton isLoaded={!isLoading}>
                  <Image
                    borderRadius="full"
                    height={{ base: '14', md: '12' }}
                    src={`/assets/demos/consensus/${eventInfo.styles.icon.image}`}
                    width={{ base: '20', md: '12' }}
                  />
                </Skeleton>
              }
              iconBg={eventInfo.styles.icon.bg || 'blue.100'}
              iconBorder={eventInfo.styles.icon.border || 'border.round'}
              minW={{ base: '90vw', md: '345px' }}
              p="0"
              pb="0"
              w="full"
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
                        fontSize={fontSize.h1}
                        fontWeight={eventInfo?.styles.h1.fontWeight}
                        textAlign="center"
                      >
                        {eventInfo?.welcomePage.title.text}
                      </Text>
                      <Text
                        color={eventInfo?.styles.h3.color}
                        fontFamily={eventInfo?.styles.h3.fontFamily}
                        fontSize={fontSize.h3}
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
                          fontSize={fontSize.h3}
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
                        fontSize={fontSize.h3}
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
                          borderRadius={imgSize.borderRadius}
                          height={imgSize.h}
                          mb="2"
                          objectFit="contain"
                          src={`/assets/demos/consensus/${ticketInfo?.media}`}
                        />
                      </Skeleton>
                      <Heading
                        color="black"
                        fontFamily={eventInfo?.styles.title.fontFamily}
                        fontSize={fontSize.h1}
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
                    fontSize={fontSize.h1}
                    fontWeight={eventInfo?.styles.h1.fontWeight}
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
                        fontSize={fontSize.h2}
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
                          fontSize={fontSize.h3}
                          fontWeight={eventInfo?.styles.h3.fontWeight}
                        >
                          Attending Talks
                        </Text>
                        <Text
                          color={eventInfo?.styles.h3.color}
                          fontFamily={eventInfo?.styles.h3.fontFamily}
                          fontSize={fontSize.h3}
                          fontWeight={eventInfo?.styles.h3.fontWeight}
                        >
                          Visiting Booths
                        </Text>
                        <Text
                          color={eventInfo?.styles.h3.color}
                          fontFamily={eventInfo?.styles.h3.fontFamily}
                          fontSize={fontSize.h3}
                          fontWeight={eventInfo?.styles.h3.fontWeight}
                        >
                          Scavenger Hunts
                        </Text>
                        <Text
                          color={eventInfo?.styles.h3.color}
                          fontFamily={eventInfo?.styles.h3.fontFamily}
                          fontSize={fontSize.h3}
                          fontWeight={eventInfo?.styles.h3.fontWeight}
                        >
                          Quizzes
                        </Text>
                      </VStack>
                    </Box>

                    {/* Right column for spending methods */}
                    <Box>
                      <Text
                        color={eventInfo?.styles.h2.color}
                        fontFamily={eventInfo?.styles.h2.fontFamily}
                        fontSize={fontSize.h2}
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
                          fontSize={fontSize.h3}
                          fontWeight={eventInfo?.styles.h3.fontWeight}
                        >
                          Food
                        </Text>
                        <Text
                          color={eventInfo?.styles.h3.color}
                          fontFamily={eventInfo?.styles.h3.fontFamily}
                          fontSize={fontSize.h3}
                          fontWeight={eventInfo?.styles.h3.fontWeight}
                        >
                          Merch
                        </Text>
                        <Text
                          color={eventInfo?.styles.h3.color}
                          fontFamily={eventInfo?.styles.h3.fontFamily}
                          fontSize={fontSize.h3}
                          fontWeight={eventInfo?.styles.h3.fontWeight}
                        >
                          Raffles
                        </Text>
                        <Text
                          color={eventInfo?.styles.h3.color}
                          fontFamily={eventInfo?.styles.h3.fontFamily}
                          fontSize={fontSize.h3}
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
                    fontSize={fontSize.button}
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
      </Box>
    </Flex>
  );
}
