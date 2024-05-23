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
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import { LockIcon } from '@chakra-ui/icons';

import { CLOUDFLARE_IPFS } from '@/constants/common';
import { IconBox } from '@/components/IconBox';
import { BoxWithShape } from '@/components/BoxWithShape';
import { SendIcon } from '@/components/Icons/SendIcon';
import { ReceiveIcon } from '@/components/Icons/ReceiveIcon';
import { CameraIcon } from '@/components/Icons/CameraIcon';
import { useConferenceContext } from '@/contexts/ConferenceContext';

import ProfileTransferModal from '../modals/ProfileTransferModal';
import ReceiveTokensModal from '../modals/ReceiveTokensModal';

const AssetsHome = () => {
  const { tokensAvailable, eventInfo, isLoading, onSelectTab, ticker } = useConferenceContext();

  const sendDisclosure = useDisclosure();
  const receiveDisclosure = useDisclosure();

  const [isLargerThan700] = useMediaQuery('(min-height: 700px)');
  const [isLargerThan900] = useMediaQuery('(min-height: 900px)');

  const handleCardClick = (tab: string) => {
    onSelectTab(1, tab);
  };

  const PageCard = ({
    title,
    imageUrl,
    tab,
    locked = false,
  }: {
    title: string;
    imageUrl: string;
    tab: string;
    locked: boolean;
  }) => {
    const cardStyle = {
      position: 'relative' as const,
      flex: '1',
      w: '100%',
      bg: 'gray.100',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
      overflow: 'hidden',
      maxH: isLargerThan900 ? '500px' : isLargerThan700 ? '250px' : '100px', // Dynamic height
    };

    const imageContainerStyle = {
      position: 'relative' as const,
      flex: '1',
      h: '100%',
      maxH: isLargerThan900 ? '500px' : isLargerThan700 ? '250px' : '100px', // Dynamic height
    };
    console.log('Card style: ', cardStyle.maxH);

    const lockIconStyle = {
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: 'gray.500',
      w: '24px',
      h: '24px',
    };

    const overlayStyle = {
      position: 'absolute' as const,
      top: locked ? '2' : '33.33%',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      p: '2',
    };

    const comingSoonStyle = {
      position: 'absolute' as const,
      top: '75%',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      p: '2',
    };

    const image = `${CLOUDFLARE_IPFS}/${imageUrl}`;

    return (
      <Box
        {...cardStyle}
        onClick={
          locked
            ? () => {
                console.log('Coming soon');
              }
            : handleCardClick.bind(null, tab)
        }
      >
        <Flex {...imageContainerStyle}>
          <Image
            alt={title}
            borderRadius="md"
            filter={!locked ? 'none' : 'blur(4px)'}
            objectFit="cover"
            src={image}
            w="full"
          />

          {locked && <LockIcon {...lockIconStyle} />}
          <Box {...overlayStyle}>
            <Text
              bottom="2"
              color={eventInfo.styles.h3.color}
              fontFamily={eventInfo.styles.h3.fontFamily}
              fontSize={isLargerThan900 ? '3xl' : isLargerThan700 ? '2xl' : 'xl'}
              fontWeight={eventInfo.styles.h3.fontWeight}
            >
              {title}
            </Text>
          </Box>
          {locked && (
            <Box {...comingSoonStyle}>
              <Text
                bottom="2"
                color={eventInfo.styles.h3.color}
                fontFamily={eventInfo.styles.h3.fontFamily}
                fontSize={isLargerThan900 ? 'xl' : isLargerThan700 ? 'lg' : 'md'}
                fontWeight={eventInfo.styles.h3.fontWeight}
              >
                Coming Soon
              </Text>
            </Box>
          )}
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
    <Center h="87vh" w="100vw">
      <ProfileTransferModal
        isOpen={sendDisclosure.isOpen}
        title="Send Tokens"
        onClose={sendDisclosure.onClose}
      />
      <ReceiveTokensModal isOpen={receiveDisclosure.isOpen} onClose={receiveDisclosure.onClose} />
      <VStack
        gap={{ base: '16px', md: '24px', lg: '32px' }}
        h="100%"
        maxW="800px"
        overflowY="auto"
        pt="3"
        spacing="4"
        w={{ base: '100%', md: '90%', lg: '80%' }}
      >
        <Skeleton fadeDuration={1} isLoaded={!isLoading}>
          <Heading
            fontSize={{ base: '2xl', md: '3xl' }}
            fontWeight="500"
            paddingBottom="4"
            textAlign="center"
          >
            {isLoading ? (
              'Loading ticket...'
            ) : (
              <VStack>
                <Heading
                  color={eventInfo.styles.title.color}
                  fontFamily={eventInfo.styles.title.fontFamily}
                  fontSize={{ base: '4xl', md: '5xl' }}
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
          h={isLargerThan900 ? '90%' : isLargerThan700 ? '89%' : '86%'}
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
          w="full"
        >
          <Box h={isLargerThan900 ? '77%' : isLargerThan700 ? '75%' : '65%'}>
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
                    fontSize={{ base: 'xl', md: '2xl' }}
                    fontWeight={eventInfo.styles.h1.fontWeight}
                    textAlign="center"
                  >
                    {tokensAvailable} ${ticker}
                  </Text>
                  <HStack justify="space-evenly" mt={4} spacing={4} w="100%">
                    <VStack spacing="0">
                      <Box
                        bg={eventInfo.styles.buttons.secondary.color}
                        borderRadius="0.75em"
                        p="2"
                        onClick={sendDisclosure.onOpen}
                      >
                        <SendIcon color="white" h={{ base: '20px', md: '24px' }} strokeWidth="1" />
                      </Box>
                      <Text
                        color={eventInfo.styles.h3.color}
                        fontFamily={eventInfo.styles.h3.fontFamily}
                        fontSize={{ base: 'xs', md: 'sm' }}
                        fontWeight={eventInfo.styles.h3.fontWeight}
                        textAlign="center"
                      >
                        Send
                      </Text>
                    </VStack>
                    <VStack spacing="0">
                      <Box
                        bg={eventInfo.styles.buttons.secondary.color}
                        borderRadius="0.75em"
                        p="2"
                        onClick={receiveDisclosure.onOpen}
                      >
                        <ReceiveIcon
                          color="white"
                          h={{ base: '20px', md: '24px' }}
                          strokeWidth="1"
                        />
                      </Box>
                      <Text
                        color={eventInfo.styles.h3.color}
                        fontFamily={eventInfo.styles.h3.fontFamily}
                        fontSize={{ base: 'xs', md: 'sm' }}
                        fontWeight={eventInfo.styles.h3.fontWeight}
                        textAlign="center"
                      >
                        Receive
                      </Text>
                    </VStack>
                    <VStack spacing="0">
                      <Box
                        bg={eventInfo.styles.buttons.secondary.color}
                        borderRadius="0.75em"
                        p="2"
                        onClick={() => {
                          onSelectTab(3);
                        }}
                      >
                        <CameraIcon
                          color="white"
                          h={{ base: '20px', md: '24px' }}
                          strokeWidth="1"
                        />
                      </Box>
                      <Text
                        color={eventInfo.styles.h3.color}
                        fontFamily={eventInfo.styles.h3.fontFamily}
                        fontSize={{ base: 'xs', md: 'sm' }}
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
              h="full"
              pb="2"
              pt="2"
              px="6"
            >
              <VStack h="100%" spacing="6" w="full">
                <PageCard
                  imageUrl="bafkreia3sfwyavkzoe2o7arkshjkepf2yeljzjk77lxevylo4yja6hij4y"
                  locked={false}
                  tab="collectibles"
                  title="Collectibles"
                />
                <HStack flex="1" spacing="6">
                  <PageCard
                    imageUrl="bafybeicqe3auvvhqtujlzaue3ibcqjove7qs2vo7nccovol2mscl7vjpju"
                    locked={true}
                    tab="raffles"
                    title="Raffles"
                  />
                  <PageCard
                    imageUrl="bafkreiecyklo4kmorcij5o2gyvfq7lh535zhnryj34sc5z3php2l7x4jj4"
                    locked={true}
                    tab="auctions"
                    title="Auctions"
                  />
                </HStack>
                <PageCard
                  imageUrl="bafybeibm7s666anvtql54c54mz3aeyaitr5wsx4x6j5uhzd5wayyz3atvq"
                  locked={false}
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
