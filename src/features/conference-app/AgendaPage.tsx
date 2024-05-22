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
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { RepeatClockIcon, TimeIcon } from '@chakra-ui/icons';

import { useConferenceContext } from '@/contexts/ConferenceContext';
import { IconBox } from '@/components/IconBox';
import { BoxWithShape } from '@/components/BoxWithShape';
import { CLOUDFLARE_IPFS } from '@/constants/common';
import { CalendarIcon } from '@/components/Icons/CalendarIcon';
import { LocationPinIcon } from '@/components/Icons/LocationPinIcon';

type Track =
  | 'Identity, Privacy & Security'
  | 'Impact & Public Goods'
  | 'Infrastructure & Scalability'
  | 'DAOs & Communities'
  | 'Defi, NFTs & Gaming';

type Format =
  | 'Presentation'
  | 'Panel'
  | 'Ceremony'
  | 'Technical Workshop'
  | 'Experience'
  | 'Creative Expression'
  | 'Mini Summit'
  | 'Fireside Chat';

interface Speaker {
  name: string;
  image: string;
  title?: string;
  company?: string;
}

interface AgendaItem {
  title: string;
  location: string;
  building: string;
  color: string;
  time: string;
  date: string;
  duration: string;
  description: string;
  format?: Format;
  speakers?: Speaker[];
  presentedBy?: string;
  track?: string;
}

const AgendaPage: React.FC = () => {
  const { eventInfo, isLoading } = useConferenceContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dummyAgenda, setDummyAgenda] = useState<AgendaItem[]>([]);

  useEffect(() => {
    setDummyAgenda(getDummyAgendaForDate(currentDate));
  }, [currentDate]);

  const getDummyAgendaForDate = (date: Date): AgendaItem[] => {
    return [
      {
        date: 'Wednesday, May 29',
        time: '9:00 AM',
        duration: '50 mins',
        title: 'RWAs & Tokenization - Evolution or Revolution in Traditional Finance?',
        location: 'ACC: Spotlight Stage',
        building: 'Building A',
        description:
          'Join us for an insightful discussion as we dive into the world of RWA tokenization. Explore the potential benefits, challenges, and opportunities associated with RWA tokenization, and its role in transforming various traditional financial markets.',
        color: 'red.100',
        format: 'Ceremony',
        speakers: [
          {
            name: 'Carlos Domingo',
            image:
              'https://d2pasa6bkzkrjd.cloudfront.net/_resize/consensus2024/speaker/300/site/consensus2024/images/userfiles/speakers/766129b4736cae5d8287e2ba4802cd1c.jpg',
            title: 'Co-Founder and CEO',
            company: 'Securitize',
          },
          {
            name: 'Adam Lawrence',
            image:
              'https://d2pasa6bkzkrjd.cloudfront.net/_resize/consensus2024/speaker/300/site/consensus2024/images/userfiles/speakers/b275a6942bb346bde978b75400ebc34d.jpg',
            title: 'CEO and Co-Founder',
            company: 'RWA.xyz',
          },
          {
            name: 'John Patrick Mullin',
            image:
              'https://d2pasa6bkzkrjd.cloudfront.net/_resize/consensus2024/speaker/300/site/consensus2024/images/userfiles/speakers/5deda7c6cbc11e65cae2c5b7bc30c63b.jpg',
            title: 'CEO and Co-Founder',
            company: 'MANTRA',
          },
        ],
        presentedBy: 'Conference Org',
        track: 'Sponsored Sessions',
      },
      {
        date: 'Wednesday, May 29',
        time: '9:00 AM',
        duration: '10 mins',
        title: 'Welcome to Consensus 2025',
        location: 'ACC: Mainstage',
        building: 'Building A',
        description:
          'Join us for an insightful discussion as we dive into the world of RWA tokenization. Explore the potential benefits, challenges, and opportunities associated with RWA tokenization, and its role in transforming various traditional financial markets.',
        color: 'blue.100',
        format: 'Ceremony',
        speakers: [
          {
            name: 'Michael Casey',
            image:
              'https://d2pasa6bkzkrjd.cloudfront.net/_resize/consensus2024/speaker/300/site/consensus2024/images/userfiles/speakers/ed5f04da8a640fa30b2976a1166097e2.jpg',
            title: 'Chain, Consensus 2025',
            company: 'CoinDesk',
          },
        ],
      },
      {
        date: 'Wednesday, May 29',
        time: '10:00 AM',
        duration: '05 mins',
        title: 'Welcome',
        location: 'ACC: Gen C Stage',
        building: 'Building A',
        description:
          'Join us for an insightful discussion as we dive into the world of RWA tokenization. Explore the potential benefits, challenges, and opportunities associated with RWA tokenization, and its role in transforming various traditional financial markets.',
        color: 'red.100',
        format: 'Ceremony',
        speakers: [
          {
            name: 'Sam Ewen',
            image:
              'https://d2pasa6bkzkrjd.cloudfront.net/_resize/consensus2024/speaker/300/site/consensus2024/images/userfiles/speakers/9e4e6206a5e8ceb0a6e9561594961a83.jpg',
            title: 'SVP',
            company: 'CoinDesk',
          },
        ],
        presentedBy: 'Conference Org',
      },
      {
        date: 'Wednesday, May 29',
        time: '10:05 AM',
        duration: '30 mins',
        title: 'How Brands Use Web3 to Reach New Luxury Consumers',
        location: 'ACC: Gen C Stage',
        building: 'Building A',
        description:
          'Join us for an insightful discussion as we dive into the world of RWA tokenization. Explore the potential benefits, challenges, and opportunities associated with RWA tokenization, and its role in transforming various traditional financial markets.',
        color: 'blue.100',
        format: 'Ceremony',
        speakers: [
          {
            name: 'Vanessa Grellet',
            image:
              'https://d2pasa6bkzkrjd.cloudfront.net/_resize/consensus2024/speaker/300/site/consensus2024/images/userfiles/speakers/70eae8a53338307bf6e0c2a1e4713815.jpg',
            title: 'Managing Partner',
            company: 'Arche Capital',
          },
          {
            name: 'Erika Wykes-Sneyd',
            image:
              'https://d2pasa6bkzkrjd.cloudfront.net/_resize/consensus2024/speaker/300/site/consensus2024/images/userfiles/speakers/69319e3fe587ffcedcff4a9318eddf4e.jpg',
            title: 'Vice President of adidas /// Studio',
            company: 'adidas',
          },
          {
            name: 'Dani Mariano',
            image:
              'https://d2pasa6bkzkrjd.cloudfront.net/_resize/consensus2024/speaker/300/site/consensus2024/images/userfiles/speakers/886ecce4917c9bb875824184ca8a9979.jpg',
            title: 'President',
            company: 'Razorfish',
          },
          {
            name: 'Camilla McFarland',
            image:
              'https://d2pasa6bkzkrjd.cloudfront.net/_resize/consensus2024/speaker/300/site/consensus2024/images/userfiles/speakers/863fbbc9d36b475a4ee528e569c4b3b8.jpg',
            title: 'Advisor',
            company: 'Serotonin',
          },
        ],
        presentedBy: 'Conference Org',
        track: 'Web3, Brand',
      },
    ];
  };

  const textColor = 'gray.600';

  const renderAgendaItems = () => {
    return dummyAgenda.map((item, index) => (
      <VStack
        key={index}
        align="left"
        bg={item.color}
        borderRadius="md"
        boxShadow="md"
        flex="1"
        px="4"
        py="2"
        spacing="0"
        w="100%"
      >
        <VStack align="left" mb="1" mt={1} spacing={0}>
          <HStack alignItems="center">
            <CalendarIcon h="15px" w="15px" />
            <Text
              isTruncated
              color={eventInfo.styles.h3.color}
              fontFamily={eventInfo.styles.h3.fontFamily}
              fontSize="sm"
              fontWeight={eventInfo.styles.h3.fontWeight}
              h="20px"
              mb={0}
              textAlign="left"
            >
              {item.date}
            </Text>
          </HStack>
          <HStack alignItems="center">
            <TimeIcon h="15px" w="15px" />
            <Text
              isTruncated
              color={eventInfo.styles.h3.color}
              fontFamily={eventInfo.styles.h3.fontFamily}
              fontSize="sm"
              fontWeight={eventInfo.styles.h3.fontWeight}
              h="20px"
              mb={0}
              textAlign="left"
            >
              {item.time}
            </Text>
          </HStack>
          <HStack alignItems="center">
            <RepeatClockIcon h="15px" w="15px" />
            <Text
              isTruncated
              color={eventInfo.styles.h3.color}
              fontFamily={eventInfo.styles.h3.fontFamily}
              fontSize="sm"
              fontWeight={eventInfo.styles.h3.fontWeight}
              h="20px"
              mb={0}
              textAlign="left"
            >
              {item.duration}
            </Text>
          </HStack>
        </VStack>
        <VStack align="left" mt={0} spacing={0}>
          <Text
            color={textColor}
            fontFamily={eventInfo.styles.h1.fontFamily}
            fontSize="lg"
            fontWeight={eventInfo.styles.h1.fontWeight}
            mb={0}
            textAlign="left"
          >
            {item.title}
          </Text>
          <HStack alignItems="center">
            <LocationPinIcon h="15px" w="15px" />
            <Text
              isTruncated
              color={eventInfo.styles.h3.color}
              fontFamily={eventInfo.styles.h3.fontFamily}
              fontSize="sm"
              fontWeight={eventInfo.styles.h3.fontWeight}
              h="20px"
              mb={0}
              textAlign="left"
            >
              {item.location}
            </Text>
          </HStack>
        </VStack>

        {item.speakers && (
          <Box overflowX="auto">
            <Grid gap={4} mb="3" mt={4} templateColumns="repeat(auto-fit, minmax(200px, 1fr))">
              {item.speakers.map((speaker, idx) => (
                <GridItem key={idx}>
                  <HStack minWidth="200px" spacing={3}>
                    <Image
                      alt={speaker.name}
                      borderRadius="full"
                      boxSize="50px"
                      src={speaker.image}
                    />
                    <VStack align="start" h="50px" spacing={0} verticalAlign="middle">
                      <Text
                        isTruncated
                        color={textColor}
                        fontFamily={eventInfo.styles.h1.fontFamily}
                        fontSize="sm"
                        fontWeight={eventInfo.styles.h1.fontWeight}
                        h="16px"
                      >
                        {speaker.name}
                      </Text>
                      <Text
                        isTruncated
                        color={eventInfo.styles.h3.color}
                        fontFamily={eventInfo.styles.h3.fontFamily}
                        fontSize="xs"
                        fontWeight={eventInfo.styles.h3.fontWeight}
                        h="16px"
                      >
                        {speaker.title && `${speaker.title}`}
                      </Text>
                      <Text
                        isTruncated
                        color={textColor}
                        fontFamily={eventInfo.styles.h1.fontFamily}
                        fontSize="sm"
                        fontWeight={eventInfo.styles.h1.fontWeight}
                        h="16px"
                      >
                        {speaker.company && `${speaker.company}`}
                      </Text>
                    </VStack>
                  </HStack>
                </GridItem>
              ))}
            </Grid>
          </Box>
        )}

        {item.track && (
          <Box
            alignSelf="left"
            bg={eventInfo.styles.buttons.primary.bg}
            mt={1}
            px="1"
            w="max-content"
          >
            <Text
              color="white"
              fontFamily={eventInfo.styles.h1.fontFamily}
              fontSize="sm"
              fontWeight={eventInfo.styles.h1.fontWeight}
              h="20px"
              mb={0}
              textAlign="left"
            >
              {item.track}
            </Text>
          </Box>
        )}
      </VStack>
    ));
  };

  return (
    <Box h="calc(100vh - 100px)" overflowY="auto">
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
            <Box h="full" maxH="70vh">
              <BoxWithShape bg="white" borderTopRadius="8xl" showNotch={false} w="full">
                {isLoading ? (
                  <Skeleton height="200px" width="full" />
                ) : (
                  <Flex
                    align="center"
                    flexDir="column"
                    pb={{ base: '3', md: '5' }}
                    pt={{ base: '12', md: '16' }}
                    px={{ base: '4', md: '8' }}
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
    </Box>
  );
};

export default AgendaPage;
