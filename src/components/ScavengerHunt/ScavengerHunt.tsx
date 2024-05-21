import { Box, Center, Image, Progress, Text, VStack, Badge, HStack } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

import { CLOUDFLARE_IPFS } from '@/constants/common';

interface ScavengerHunt {
  id: string;
  name: string;
  image: string;
  found: string[];
  scavenger_ids: string[];
}

interface ScavengerCardProps {
  scavenger: ScavengerHunt;
}

export const ScavengerCard: React.FC<ScavengerCardProps> = ({ scavenger }: ScavengerCardProps) => {
  const isCompleted = scavenger.found.length >= scavenger.scavenger_ids.length;
  const imageUrl = `${CLOUDFLARE_IPFS}/${scavenger.image}`;

  return (
    <Box
      bg={isCompleted ? 'green.50' : 'white'}
      borderRadius="md"
      boxShadow="md"
      maxW="120px"
      p={2}
      position="relative"
    >
      <VStack align="stretch" spacing={2}>
        <Center>
          <Image
            alt={scavenger.name}
            borderRadius="md"
            boxSize="60px"
            objectFit="contain"
            src={imageUrl}
          />
        </Center>
        <VStack align="stretch" spacing={1}>
          <Text fontSize="xs" fontWeight="bold" textAlign="center">
            {scavenger.name}
          </Text>
          <Progress
            hasStripe
            isAnimated={isCompleted}
            size="xs"
            value={(scavenger.found.length / scavenger.scavenger_ids.length) * 100}
          />
          <HStack justify="space-between" px={1}>
            <Text fontSize="xs">Found:</Text>
            <Text fontSize="xs" fontWeight="semibold">
              {scavenger.found.length}/{scavenger.scavenger_ids.length}
            </Text>
          </HStack>
        </VStack>
        {isCompleted && (
          <Box position="absolute" right="2" top="2">
            <CheckIcon color="green.500" />
          </Box>
        )}
        {isCompleted && (
          <Badge borderRadius="4" colorScheme="blue" left="2" position="absolute" size="sm" top="2">
            Complete
          </Badge>
        )}
      </VStack>
    </Box>
  );
};
