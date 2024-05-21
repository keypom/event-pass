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
  Spinner,
  Badge,
  HStack,
} from '@chakra-ui/react';
import { CheckIcon, LockIcon } from '@chakra-ui/icons';

import { IconBox } from '@/components/IconBox';
import { TicketIcon } from '@/components/Icons';
import { BoxWithShape } from '@/components/BoxWithShape';
import { CLOUDFLARE_IPFS } from '@/constants/common';
import keypomInstance from '@/lib/keypom';
import ToggleSwitch from '@/components/ToggleSwitch/ToggleSwitch';
import { useConferenceContext } from '@/contexts/ConferenceContext';

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
          src={`${CLOUDFLARE_IPFS}/${nft.image}`}
        />
        {!isOwned && <LockIcon {...lockIconStyle} />}
      </Flex>
      <Text
        bottom="2"
        color={isOwned ? 'black' : 'gray.500'}
        fontSize="sm"
        fontWeight="bold"
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

const AssetsPage: React.FC = () => {
  const { accountId, eventInfo, dropInfo, isLoading } = useConferenceContext();
  const [nfts, setNFTs] = useState<NFTData[]>([]);
  const [showUnowned, setShowUnowned] = useState(true);

  useEffect(() => {
    if (!accountId) return;

    const getNFTs = async () => {
      const factoryAccount = dropInfo?.asset_data[1].config.root_account_id;
      const nftDrops = await keypomInstance.viewCall({
        contractId: factoryAccount,
        methodName: 'get_nfts_for_account',
        args: { account_id: accountId },
      });

      let sortedNFTDrops = nftDrops.sort((a, b) => b.is_owned - a.is_owned);

      if (!showUnowned) {
        sortedNFTDrops = sortedNFTDrops.filter((nft) => nft.is_owned);
      }

      const parsedNFTs = sortedNFTDrops.map((nftData) => ({
        nft: nftData.nft,
        owned: nftData.is_owned,
      }));

      setNFTs(parsedNFTs);
    };

    getNFTs();
  }, [accountId, dropInfo, showUnowned]);

  if (isLoading) {
    return (
      <Center padding={8}>
        <Skeleton height="40px" width="full" />
      </Center>
    );
  }

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
                  fontSize={{ base: '6xl', md: '8xl' }}
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
          <Box h="full" overflowY="auto">
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
                ></Flex>
              )}
            </BoxWithShape>
            <Flex align="center" bg="gray.50" borderRadius="8xl" direction="column" p="6">
              <Box mb="2" textAlign="center" w="full">
                <Text
                  color="#844AFF"
                  fontFamily="denverBody"
                  fontSize={{ base: 'xl', md: '2xl' }}
                  fontWeight="600"
                >
                  Unlockables
                </Text>
              </Box>
              <HStack justifyContent="center" mb="2" w="full">
                <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="500">
                  Show Unowned
                </Text>
                <ToggleSwitch
                  handleToggle={() => {
                    setShowUnowned(!showUnowned);
                  }}
                  toggle={showUnowned}
                />
              </HStack>
              {isLoading ? (
                <Spinner size="xl" />
              ) : nfts.length > 0 ? (
                <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} mt="4" spacing={4} w="full">
                  {nfts.map((nft) => (
                    <NFTCard key={nft.nft.name} isOwned={nft.owned} nft={nft.nft} />
                  ))}
                </SimpleGrid>
              ) : (
                <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="500" mt="4">
                  You haven't received any NFTs yet.
                </Text>
              )}
            </Flex>
          </Box>
        </IconBox>
      </VStack>
    </Center>
  );
};

export default AssetsPage;
