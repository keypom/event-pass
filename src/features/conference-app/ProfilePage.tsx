import {
  Box,
  Center,
  Flex,
  Grid,
  Heading,
  HStack,
  Image,
  Skeleton,
  Text,
  useMediaQuery,
  VStack,
} from '@chakra-ui/react';
import QRCode from 'react-qr-code';

import { IconBox } from '@/components/IconBox';
import { TicketIcon } from '@/components/Icons';
import { BoxWithShape } from '@/components/BoxWithShape';
import { useConferenceContext } from '@/contexts/ConferenceContext';

import { getDynamicHeightPercentage } from './helpers';
import { formatTokensAvailable } from './AssetsPages/AssetsHome';

export default function ProfilePage() {
  const { eventInfo, ticketInfo, isLoading, ticker, accountId, tokensAvailable } =
    useConferenceContext();

  const vh = window.innerHeight;
  const iconBoxHeight = `${getDynamicHeightPercentage(vh, [900, 700, 70], [90, 80, 70])}%`;
  const boxWithShapeHeight = `${getDynamicHeightPercentage(vh, [900, 700, 0], [77, 62, 50])}%`;
  const [isHeightGreaterThan600] = useMediaQuery('(min-height: 600px)');
  const [isHeightGreaterThan700] = useMediaQuery('(min-height: 700px)');
  const [isHeightGreaterThan800] = useMediaQuery('(min-height: 800px)');
  const [isHeightGreaterThan900] = useMediaQuery('(min-height: 900px)');
  const qrSize = isHeightGreaterThan900
    ? 190
    : isHeightGreaterThan800
    ? 170
    : isHeightGreaterThan700
    ? 150
    : isHeightGreaterThan600
    ? 120
    : 100;
  const imageSize = isHeightGreaterThan900
    ? '170px'
    : isHeightGreaterThan800
    ? '120px'
    : isHeightGreaterThan700
    ? '100px'
    : isHeightGreaterThan600
    ? '80px'
    : '50px';

  return (
    <Center maxH="87vh">
      <VStack
        gap={{ base: '16px', md: '24px', lg: '32px' }}
        h="full"
        maxH="87vh"
        overflowY="auto"
        pt="3"
        spacing="4"
        w={{ base: '90vw', md: '90%', lg: '80%' }}
      >
        <Skeleton fadeDuration={1} isLoaded={!isLoading}>
          <Heading
            fontSize={{ base: '2xl', md: '3xl' }}
            fontWeight="500"
            paddingBottom="5"
            textAlign="center"
          >
            {isLoading ? (
              'Loading ticket...'
            ) : (
              <VStack>
                <Heading
                  color={eventInfo.styles.title.color}
                  fontFamily={eventInfo.styles.title.fontFamily}
                  fontSize="4xl"
                  fontWeight={eventInfo.styles.title.fontWeight}
                  textAlign="center"
                >
                  PROFILE
                </Heading>
              </VStack>
            )}
          </Heading>
        </Skeleton>

        <IconBox
          bg={eventInfo.styles.border.border || 'border.box'}
          h={iconBoxHeight}
          icon={
            <Skeleton isLoaded={!isLoading}>
              {eventInfo.styles.icon.image ? (
                <Image
                  borderRadius="full"
                  height={{ base: '14', md: '12' }}
                  src={`/assets/demos/consensus/${eventInfo.styles.icon.image}`}
                  width={{ base: '20', md: '12' }}
                />
              ) : (
                <TicketIcon height={{ base: '8', md: '10' }} width={{ base: '8', md: '10' }} />
              )}
            </Skeleton>
          }
          iconBg={eventInfo.styles.icon.bg || 'blue.100'}
          iconBorder={eventInfo.styles.icon.border || 'border.round'}
          minW={{ base: '90vw', md: '345px' }}
          p="0"
          pb="0"
          w="full"
        >
          <Box h={boxWithShapeHeight}>
            <BoxWithShape bg="white" borderTopRadius="8xl" showNotch={false} w="full">
              {isLoading ? (
                <Skeleton height="200px" width="full" />
              ) : (
                <Flex
                  align="center"
                  flexDir="column"
                  pb={{ base: '2', md: '5' }}
                  pt={{ base: '10', md: '16' }}
                  px={{ base: '10', md: '8' }}
                >
                  <Text
                    color={eventInfo.styles.h1.color}
                    fontFamily={eventInfo.styles.h1.fontFamily}
                    fontSize="2xl"
                    fontWeight={eventInfo.styles.h1.fontWeight}
                    textAlign="center"
                  >
                    {formatTokensAvailable(tokensAvailable)} ${ticker}
                  </Text>
                  <Grid
                    gap={6} // Space between grid items
                    py={isHeightGreaterThan800 ? '4' : '2'} // Padding on the top and bottom
                    templateColumns={{ base: 'repeat(2, 1fr)' }} // Responsive grid layout
                    width="full" // Full width of the parent container
                  >
                    {/* Left column for first name */}
                    <Box>
                      <Text
                        color={eventInfo.styles.h2.color}
                        fontFamily={eventInfo.styles.h2.fontFamily}
                        fontSize={isHeightGreaterThan800 ? 'lg' : 'md'} // Padding on the top and bottom
                        fontWeight={eventInfo.styles.h2.fontWeight}
                        mb={0}
                        textAlign="left"
                      >
                        First Name
                      </Text>
                      <Text
                        color={eventInfo.styles.h3.color}
                        fontFamily={eventInfo.styles.h3.fontFamily}
                        fontSize="sm"
                        fontWeight={eventInfo.styles.h3.fontWeight}
                        textAlign="left"
                      >
                        N/A
                      </Text>
                    </Box>

                    {/* Right column for last name */}
                    <Box>
                      <Text
                        color={eventInfo.styles.h2.color}
                        fontFamily={eventInfo.styles.h2.fontFamily}
                        fontSize={isHeightGreaterThan800 ? 'lg' : 'md'} // Padding on the top and bottom
                        fontWeight={eventInfo.styles.h2.fontWeight}
                        mb={0}
                        textAlign="right"
                      >
                        Last Name
                      </Text>
                      <Text
                        color={eventInfo.styles.h3.color}
                        fontFamily={eventInfo.styles.h3.fontFamily}
                        fontSize="sm"
                        fontWeight={eventInfo.styles.h3.fontWeight}
                        textAlign="right"
                      >
                        N/A
                      </Text>
                    </Box>
                  </Grid>
                  <Skeleton borderRadius="12px" isLoaded={!isLoading}>
                    <Image
                      alt={`Event image for ${eventInfo.name}`}
                      borderRadius="8px"
                      height={imageSize}
                      mb="2"
                      objectFit="contain"
                      src={`/assets/demos/consensus/${ticketInfo.media}`}
                    />
                  </Skeleton>
                  <HStack>
                    <Text
                      color={eventInfo.styles.h2.color}
                      fontFamily={eventInfo.styles.h2.fontFamily}
                      fontSize={eventInfo.styles.h2.fontSize}
                      fontWeight={eventInfo.styles.h2.fontWeight}
                      mb={0}
                      textAlign="right"
                    >
                      Username:
                    </Text>
                    <Text
                      color={eventInfo.styles.h3.color}
                      fontFamily={eventInfo.styles.h3.fontFamily}
                      fontSize="sm"
                      fontWeight={eventInfo.styles.h3.fontWeight}
                      textAlign="right"
                    >
                      {accountId.split('.')[0]}
                    </Text>
                  </HStack>
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
                mb={isHeightGreaterThan800 ? '4' : '1'} // Padding on the top and bottom
                size={{ base: '2xl', md: '2xl' }}
                textAlign="center"
              >
                Share Your Profile
              </Text>
              <Box
                border="1px solid"
                borderColor="gray.200"
                borderRadius="12px"
                mb={isHeightGreaterThan800 ? '5' : '1'} // Padding on the top and bottom
                p="3"
              >
                <QRCode id="QRCode" size={qrSize} value={`profile:${accountId}`} />
              </Box>
              <Text
                color={eventInfo.styles.h3.color}
                fontFamily={eventInfo.styles.h3.fontFamily}
                fontSize="md"
                fontWeight={eventInfo.styles.h3.fontWeight}
                textAlign="center"
              >
                Show this to receive ${ticker}
              </Text>
            </Flex>
          </Box>
        </IconBox>
      </VStack>
    </Center>
  );
}
