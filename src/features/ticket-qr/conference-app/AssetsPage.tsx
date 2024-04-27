import React from 'react';
import { Box, SimpleGrid, Image, Text, VStack, HStack, Center, Skeleton } from '@chakra-ui/react';

export interface ScavengerHunt {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  found: string[];
}

interface NFTData {}

interface AssetsPageProps {
  scavengerHunts: ScavengerHunt[];
  nfts: [];
  isLoading: boolean;
}

const ScavengerCard = ({ scavenger }: { scavenger: ScavengerHunt }) => (
  <VStack align="stretch" bg="white" borderRadius="lg" boxShadow="md" p={4} spacing={4}>
    <Image
      alt={scavenger.name}
      borderRadius="md"
      boxSize="150px"
      objectFit="cover"
      src={scavenger.imageUrl}
    />
    <VStack align="stretch">
      <Text fontSize="md" fontWeight="bold">
        {scavenger.name}
      </Text>
      <HStack justify="space-between">
        <Text color="gray.600" fontSize="sm">
          {scavenger.description}
        </Text>
      </HStack>
    </VStack>
  </VStack>
);

const AssetsPage = ({ scavengerHunts, nfts, isLoading }: AssetsPageProps) => {
  if (isLoading) {
    return (
      <Center padding={8}>
        <Skeleton height="40px" width="full" />
      </Center>
    );
  }

  return (
    <VStack align="stretch" spacing={8}>
      <Box>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Scavenger Hunts
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {scavengerHunts.map((hunt) => (
            <ScavengerCard key={hunt.id} scavenger={hunt} />
          ))}
        </SimpleGrid>
      </Box>
      <Box>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          NFTs
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}></SimpleGrid>
      </Box>
    </VStack>
  );
};

export default AssetsPage;
