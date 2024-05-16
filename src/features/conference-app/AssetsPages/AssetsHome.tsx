import {
  Box,
  Flex,
  Center,
  Heading,
  Skeleton,
  Text,
  VStack,
  HStack,
  Image,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { type EventDrop, type FunderEventMetadata } from '@/lib/eventsHelpers';
import { CLOUDFLARE_IPFS } from '@/constants/common';
import { IconBox } from '@/components/IconBox';
import { BoxWithShape } from '@/components/BoxWithShape';
import { SendIcon } from '@/components/Icons/SendIcon';
import { ReceiveIcon } from '@/components/Icons/ReceiveIcon';
import { CameraIcon } from '@/components/Icons/CameraIcon';

interface AssetsHomeProps {
  accountId: string;
  tokensAvailable: string;
  dropInfo: EventDrop;
  eventInfo: FunderEventMetadata;
  isLoading: boolean;
  ticker: string;
}

const AssetsHome = ({
  dropInfo,
  eventInfo,
  accountId,
  isLoading,
  ticker,
  tokensAvailable,
}: AssetsHomeProps) => {
  const navigate = useNavigate();

  const handleCardClick = (tab: string) => {
    navigate(`/conference/app/assets?tab=${tab}`);
  };

  const PageCard = ({ title, imageUrl, tab }: { name: string; imageUrl: string; tab: string }) => {
    const cardStyle = {
      position: 'relative' as const,
      w: '100%',
      bg: 'gray.100',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
      overflow: 'hidden',
    };

    const imageContainerStyle = {
      position: 'relative' as const,
      w: '100%', // Full width of the card
      h: '120px',
    };

    const overlayStyle = {
      position: 'absolute' as const,
      top: '33.33%', // Position at the top
      left: '50%',
      transform: 'translateX(-50%)', // Center horizontally
      width: '100%',
      p: '2',
    };

    const image = `${CLOUDFLARE_IPFS}/${imageUrl}`;

    return (
      <Box {...cardStyle} onClick={handleCardClick.bind(null, tab)}>
        <Flex {...imageContainerStyle}>
          <Image
            alt={title}
            borderRadius="md"
            boxSize="full" // Use 'full' instead of specific pixel size for responsiveness
            objectFit="cover"
            src={image}
          />
          <Box {...overlayStyle}>
            <Text
              bottom="2"
              color="gray.600"
              fontFamily={eventInfo.styles.h2.fontFamily}
              fontSize="3xl"
              fontWeight={eventInfo.styles.h2.fontWeight}
            >
              {title}
            </Text>
          </Box>
        </Flex>
      </Box>
    );
  };

  if (isLoading) {
    return (
      <Center padding={8}>
        <Skeleton height="40px" width="full" />
      </Center>
    );
  }

  return (
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
                  ASSETS
                </Heading>
              </VStack>
            )}
          </Heading>
        </Skeleton>

        <IconBox
          bg={eventInfo.styles.border.border || 'border.box'}
          icon={
            <Skeleton isLoaded={!isLoading}>
              <Image
                height={{ base: '10', md: '12' }}
                src={`${CLOUDFLARE_IPFS}/${eventInfo.styles.icon.image}`}
                width={{ base: '10', md: '12' }}
              />
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
                  pt={{ base: '12', md: '16' }}
                  px={{ base: '10', md: '8' }}
                >
                  <Text
                    color={eventInfo.styles.h1.color}
                    fontFamily={eventInfo.styles.h1.fontFamily}
                    fontSize="2xl"
                    fontWeight={eventInfo.styles.h1.fontWeight}
                    textAlign="center"
                  >
                    {tokensAvailable} ${ticker}
                  </Text>
                  <HStack justify="space-evenly" mt={4} spacing={4} w="100%">
                    <VStack>
                      <Box
                        bg={eventInfo.styles.buttons.secondary.color}
                        borderRadius="0.75em"
                        p="2"
                      >
                        <SendIcon color="white" h="24px" strokeWidth="1" />
                      </Box>
                      <Text
                        color={eventInfo.styles.h3.color}
                        fontFamily={eventInfo.styles.h3.fontFamily}
                        fontSize="sm"
                        fontWeight={eventInfo.styles.h3.fontWeight}
                        textAlign="center"
                      >
                        Send
                      </Text>
                    </VStack>
                    <VStack>
                      <Box
                        bg={eventInfo.styles.buttons.secondary.color}
                        borderRadius="0.75em"
                        p="2"
                      >
                        <ReceiveIcon color="white" h="24px" strokeWidth="1" />
                      </Box>
                      <Text
                        color={eventInfo.styles.h3.color}
                        fontFamily={eventInfo.styles.h3.fontFamily}
                        fontSize="sm"
                        fontWeight={eventInfo.styles.h3.fontWeight}
                        textAlign="center"
                      >
                        Receive
                      </Text>
                    </VStack>
                    <VStack>
                      <Box
                        bg={eventInfo.styles.buttons.secondary.color}
                        borderRadius="0.75em"
                        p="2"
                      >
                        <CameraIcon color="white" h="24px" strokeWidth="1" />
                      </Box>
                      <Text
                        color={eventInfo.styles.h3.color}
                        fontFamily={eventInfo.styles.h3.fontFamily}
                        fontSize="sm"
                        fontWeight={eventInfo.styles.h3.fontWeight}
                        textAlign="center"
                      >
                        Scan
                      </Text>
                    </VStack>
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
              <VStack spacing="6" w="full">
                <PageCard
                  imageUrl="bafkreia3sfwyavkzoe2o7arkshjkepf2yeljzjk77lxevylo4yja6hij4y"
                  tab="collectibles"
                  title="Collectibles"
                />
                <HStack spacing="6" w="full">
                  <PageCard
                    imageUrl="bafybeicqe3auvvhqtujlzaue3ibcqjove7qs2vo7nccovol2mscl7vjpju"
                    tab="raffles"
                    title="Raffles"
                  />
                  <PageCard
                    imageUrl="bafkreiecyklo4kmorcij5o2gyvfq7lh535zhnryj34sc5z3php2l7x4jj4"
                    tab="auctions"
                    title="Auctions"
                  />
                </HStack>
                <PageCard
                  imageUrl="bafybeibm7s666anvtql54c54mz3aeyaitr5wsx4x6j5uhzd5wayyz3atvq"
                  tab="scavengers"
                  title="Scavenger Hunts"
                />
              </VStack>
            </Flex>
          </Box>
        </IconBox>
      </VStack>
    </Center>
  );
};

export default AssetsHome;
