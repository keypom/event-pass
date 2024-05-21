import {
  Box,
  Center,
  Flex,
  Heading,
  Image,
  Text,
  VStack,
  HStack,
  Skeleton,
  Tag,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

import { useConferenceContext } from '@/contexts/ConferenceContext';
import { IconBox } from '@/components/IconBox';
import { BoxWithShape } from '@/components/BoxWithShape';
import { CLOUDFLARE_IPFS } from '@/constants/common';

const AgendaPage = () => {
  const { eventInfo, isLoading } = useConferenceContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dummyAgenda, setDummyAgenda] = useState([]);

  useEffect(() => {
    // Replace this with a real fetch for agenda data
    setDummyAgenda(getDummyAgendaForDate(currentDate));
  }, [currentDate]);

  const getDummyAgendaForDate = (date) => {
    const day = date.getDay();
    return [
      {
        title: 'Opening Ceremony',
        time: '9:00 - 10:00 AM',
        description: 'Kick off the conference with a welcome address and an overview of the event.',
        category: 'Business',
        stage: 'Experience Stage',
        color: 'red.100',
      },
      {
        title: 'Keynote Speech',
        time: '10:15 - 11:00 AM',
        description: 'Join us for an inspiring keynote speech by a leading industry expert.',
        category: 'Marketing',
        stage: 'Main Stage',
        color: 'blue.100',
      },
      {
        title: 'Networking Break',
        time: '11:00 - 11:30 AM',
        description: 'Take a break and network with fellow attendees over coffee and snacks.',
        category: 'Networking',
        stage: 'Lounge',
        color: 'yellow.100',
      },
      // Add more dummy data here
    ];
  };

  const renderAgendaItems = () => {
    return dummyAgenda.map((item, index) => (
      <HStack key={index} spacing={4} w="full">
        <Box w="20%">
          <Text color="gray.700" fontSize="sm" fontWeight="bold">
            {item.time}
          </Text>
        </Box>
        <Box bg={item.color} borderRadius="md" boxShadow="md" flex="1" p="2">
          <HStack justify="space-between" mb={1}>
            <Tag colorScheme="teal" size="sm">
              {item.category}
            </Tag>
          </HStack>
          <Text color="gray.800" fontSize="md" fontWeight="bold">
            {item.title}
          </Text>
          <Text color="gray.600" fontSize="sm">
            {item.description}
          </Text>
          <Text color="gray.500" fontSize="xs" mt={1}>
            {item.stage}
          </Text>
        </Box>
      </HStack>
    ));
  };

  const handlePreviousDay = () => {
    setCurrentDate((prevDate) => new Date(prevDate.setDate(prevDate.getDate() - 1)));
  };

  const handleNextDay = () => {
    setCurrentDate((prevDate) => new Date(prevDate.setDate(prevDate.getDate() + 1)));
  };

  return (
    <Center>
      <VStack gap={{ base: 'calc(24px + 8px)', md: 'calc(32px + 10px)' }} w="full">
        <Skeleton fadeDuration={1} isLoaded={!isLoading}>
          <Heading
            fontSize={{ base: '2xl', md: '3xl' }}
            fontWeight="500"
            paddingBottom="0"
            textAlign="center"
          >
            {isLoading ? (
              'Loading agenda...'
            ) : (
              <VStack>
                <Heading
                  color={eventInfo.styles.title.color}
                  fontFamily={eventInfo.styles.title.fontFamily}
                  fontSize={eventInfo.styles.title.fontSize}
                  fontWeight={eventInfo.styles.title.fontWeight}
                  textAlign="center"
                >
                  AGENDA
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
          w="full"
        >
          <Box h="full" maxH="70vh" overflowY="auto">
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
                  <VStack spacing={4} w="full">
                    {renderAgendaItems()}
                  </VStack>
                </Flex>
              )}
            </BoxWithShape>
          </Box>
        </IconBox>
      </VStack>
    </Center>
  );
};

export default AgendaPage;
