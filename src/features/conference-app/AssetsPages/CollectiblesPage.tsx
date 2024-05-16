import { useEffect, useState } from 'react';
import { Box, Center, Heading, VStack, SimpleGrid, Text, Switch, HStack } from '@chakra-ui/react';
import { LockIcon, CheckIcon } from '@chakra-ui/icons';

import keypomInstance from '@/lib/keypom';
import { CLOUDFLARE_IPFS } from '@/constants/common';

const CollectiblesPage = ({ dropInfo, accountId }) => {
  const [nfts, setNFTs] = useState([]);
  const [showUnowned, setShowUnowned] = useState(true);

  useEffect(() => {
    const fetchNFTs = async () => {
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

    fetchNFTs();
  }, [accountId, dropInfo, showUnowned]);

  return (
    <Center>
      <VStack maxW="1200px" p={4} width="full">
        <Heading>Collectibles</Heading>
        <HStack justifyContent="center" mb="2" w="full">
          <Text>Show Unowned</Text>
          <Switch
            isChecked={showUnowned}
            onChange={() => {
              setShowUnowned(!showUnowned);
            }}
          />
        </HStack>
        <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} mt="4" spacing={4} w="full">
          {nfts.map((nft) => (
            <Box
              key={nft.nft.name}
              bg={nft.owned ? 'gray.50' : 'gray.100'}
              borderRadius="md"
              boxShadow="md"
              p={4}
              position="relative"
              textAlign="center"
            >
              <Image
                borderRadius="md"
                filter={nft.owned ? 'none' : 'blur(4px)'}
                objectFit="cover"
                src={`${CLOUDFLARE_IPFS}/${nft.nft.image}`}
              />
              <Text>{nft.nft.name}</Text>
              {!nft.owned && <LockIcon left="2" position="absolute" top="2" />}
              {nft.owned && <CheckIcon color="green.500" position="absolute" right="2" top="2" />}
            </Box>
          ))}
        </SimpleGrid>
      </VStack>
    </Center>
  );
};

export default CollectiblesPage;
