import { useEffect, useState } from 'react';
import {
  Box,
  Center,
  Flex,
  Heading,
  Image,
  Skeleton,
  Text,
  VStack,
  SimpleGrid,
  Badge,
  CircularProgress,
  CircularProgressLabel,
  Tooltip,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Divider,
} from '@chakra-ui/react';
import { CheckIcon, LockIcon } from '@chakra-ui/icons';

import { IconBox } from '@/components/IconBox';
import { TicketIcon } from '@/components/Icons';
import { BoxWithShape } from '@/components/BoxWithShape';
import keypomInstance from '@/lib/keypom';
import { useConferenceContext } from '@/contexts/ConferenceContext';
import { BackIcon } from '@/components/BackIcon';

interface NFTData {
  nft: NFTMetadata;
  owned: boolean;
}

interface NFTMetadata {
  image: string;
  name: string;
}

interface NFTCardProps {
  nft: NFTMetadata;
  isOwned: boolean;
}

const CollectiblesPage: React.FC = () => {
  const { accountId, factoryAccount, eventInfo, dropInfo, isLoading, onSelectTab } =
    useConferenceContext();
  const [nfts, setNFTs] = useState<NFTData[]>([]);

  useEffect(() => {
    if (!accountId) return;

    const getNFTs = async () => {
      const nftDrops = await keypomInstance.viewCall({
        contractId: factoryAccount,
        methodName: 'get_nfts_for_account',
        args: { account_id: accountId },
      });

      const sortedNFTDrops = nftDrops.sort((a, b) => b.is_owned - a.is_owned);

      const parsedNFTs = sortedNFTDrops.map((nftData) => ({
        nft: nftData.nft,
        owned: nftData.is_owned,
      }));

      setNFTs(parsedNFTs);
    };

    getNFTs();
  }, [accountId, dropInfo]);

  const NFTCard: React.FC<NFTCardProps> = ({ nft, isOwned }: NFTCardProps) => {
    const cardStyle = {
      position: 'relative' as const,
      w: '100%',
      h: '220px',
      p: '4',
      bg: isOwned ? 'gray.50' : 'gray.100',
      boxShadow: isOwned ? '0px 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
      border: isOwned ? '2px solid' : 'none',
      borderColor: isOwned ? 'green.200' : 'none',
      borderRadius: 'md' as const,
    };

    const lockIconStyle = {
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: 'gray.500',
      w: '24px',
      h: '24px',
    };

    const imageContainerStyle = {
      position: 'relative' as const,
      w: '100%',
      h: '130px',
      mb: '2',
    };

    return (
      <Box {...cardStyle}>
        <Flex {...imageContainerStyle}>
          <Image
            alt={nft.name}
            borderRadius="md"
            boxSize="full"
            filter={isOwned ? 'none' : 'blur(4px)'}
            objectFit="cover"
            src={`/assets/demos/consensus/${nft.image}`}
          />
          {!isOwned && <LockIcon {...lockIconStyle} />}
        </Flex>
        <Text
          color={eventInfo.styles.h3.color}
          fontFamily={eventInfo.styles.h3.fontFamily}
          fontSize="sm"
          fontWeight={eventInfo.styles.h3.fontWeight}
          textAlign="center"
        >
          {nft.name}
        </Text>
        {isOwned && <CheckIcon color="green.500" position="absolute" right="2" top="2" />}
        {isOwned && (
          <Badge borderRadius="4" colorScheme="blue" left="2" position="absolute" size="sm" top="2">
            Owned
          </Badge>
        )}
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

  const ownedNFTs = nfts.filter((nft) => nft.owned);
  const unownedNFTs = nfts.filter((nft) => !nft.owned);
  const progressValue = nfts.length > 0 ? (ownedNFTs.length / nfts.length) * 100 : 0;

  return (
    <Center>
      <VStack
        gap={{ base: 'calc(24px + 8px)', md: 'calc(32px + 10px)' }}
        maxW="1200px"
        p={4}
        pb="96px"
        width="full"
      >
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
                  color={eventInfo.styles?.title?.color}
                  fontFamily={eventInfo.styles.title?.fontFamily}
                  fontSize={{ base: '4xl', md: '8xl' }}
                  fontWeight="500"
                  textAlign="center"
                >
                  COLLECTIBLES
                </Heading>
              </VStack>
            )}
          </Heading>
        </Skeleton>

        <IconBox
          bg={eventInfo.styles.border.border || 'border.box'}
          icon={
            <Skeleton isLoaded={!isLoading}>
              {eventInfo.styles.icon.image ? (
                <CircularProgress
                  color={eventInfo.styles.h1.color}
                  size="60px"
                  thickness="12px"
                  trackColor="gray.200"
                  value={progressValue}
                >
                  <CircularProgressLabel
                    color={eventInfo.styles.h1.color}
                    fontFamily={eventInfo.styles.h2.fontFamily}
                    fontSize="lg"
                    fontWeight={eventInfo.styles.h2.fontWeight}
                  >
                    {Math.round(progressValue)}%
                  </CircularProgressLabel>
                </CircularProgress>
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
          <Box h="full" overflowY="auto" position="relative">
            <BackIcon eventInfo={eventInfo} onSelectTab={onSelectTab} />
            <BoxWithShape bg="white" borderTopRadius="8xl" showNotch={false} w="full">
              {isLoading ? (
                <Skeleton height="200px" width="full" />
              ) : (
                <Flex
                  align="center"
                  flexDir="column"
                  pb={{ base: '3', md: '5' }}
                  pt={{ base: '10', md: '16' }}
                  px={{ base: '6', md: '8' }}
                >
                  <Tooltip label={`You have ${ownedNFTs.length} of ${nfts.length} collectibles`}>
                    <Text
                      color={eventInfo.styles.h3.color}
                      fontFamily={eventInfo.styles.h3.fontFamily}
                      fontSize="sm"
                      fontWeight={eventInfo.styles.h3.fontWeight}
                      textAlign="center"
                    >
                      {ownedNFTs.length} of {nfts.length} Found
                    </Text>
                  </Tooltip>
                  <Divider my="2" />
                  <Text
                    color={eventInfo.styles.h3.color}
                    fontFamily={eventInfo.styles.h3.fontFamily}
                    fontSize="sm"
                    fontWeight={eventInfo.styles.h3.fontWeight}
                    pb="2"
                    textAlign="center"
                  >
                    Collect exclusive assets by participating in various activities.
                  </Text>

                  <Accordion allowMultiple defaultIndex={[0]} width="100%">
                    <AccordionItem border="none" width="100%">
                      <AccordionButton
                        _expanded={{ bg: 'none', borderBottom: 'none' }}
                        _focus={{ boxShadow: 'none' }}
                        _hover={{ bg: 'none' }}
                        pb={ownedNFTs.length > 0 ? '2' : '0'}
                        width="100%"
                      >
                        <Box flex="1" textAlign="left" width="100%">
                          <Heading
                            color={eventInfo.styles.h1.color}
                            fontFamily={eventInfo.styles.h1.fontFamily}
                            fontSize="2xl"
                            fontWeight={eventInfo.styles.h1.fontWeight}
                            textAlign="center"
                          >
                            Found
                          </Heading>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel pb={4} pt={ownedNFTs.length > 0 ? '2' : '0'} width="100%">
                        {ownedNFTs.length > 0 ? (
                          <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4} width="100%">
                            {ownedNFTs.map((nft) => (
                              <NFTCard key={nft.nft.name} isOwned={nft.owned} nft={nft.nft} />
                            ))}
                          </SimpleGrid>
                        ) : (
                          <Center>
                            <Text
                              color={eventInfo.styles.h3.color}
                              fontFamily={eventInfo.styles.h3.fontFamily}
                              fontSize="sm"
                              fontWeight={eventInfo.styles.h3.fontWeight}
                              textAlign="center"
                            >
                              You haven't found any collectibles yet.
                            </Text>
                          </Center>
                        )}
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </Flex>
              )}
            </BoxWithShape>
            <Flex align="center" bg="gray.50" borderRadius="8xl" direction="column" px="6">
              <Accordion allowMultiple defaultIndex={[0]} w="100%">
                <AccordionItem border="none">
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <Heading
                        color={eventInfo.styles.h1.color}
                        fontFamily={eventInfo.styles.h1.fontFamily}
                        fontSize="2xl"
                        fontWeight={eventInfo.styles.h1.fontWeight}
                        textAlign="center"
                      >
                        Not Found
                      </Heading>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4} w="full">
                      {unownedNFTs.map((nft) => (
                        <NFTCard key={nft.nft.name} isOwned={nft.owned} nft={nft.nft} />
                      ))}
                    </SimpleGrid>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Flex>
          </Box>
        </IconBox>
      </VStack>
    </Center>
  );
};

export default CollectiblesPage;
