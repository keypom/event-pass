import { VStack, HStack, Text, Box, Image } from '@chakra-ui/react';
import { RepeatClockIcon } from '@chakra-ui/icons';

import { useConferenceContext } from '@/contexts/ConferenceContext';
import { type AgendaItem } from '@/features/conference-app/AgendaPage';

import { LocationPinIcon } from '../Icons/LocationPinIcon';

interface GroupedAgendaItemsProps {
  groupedAgenda: Record<string, AgendaItem[]>;
}

const GroupedAgendaItems = ({ groupedAgenda }: GroupedAgendaItemsProps) => {
  const { eventInfo } = useConferenceContext();

  return (
    <>
      {Object.entries(groupedAgenda).map(([time, items], index) => {
        const cardWidth = '75%'; // Set the desired card width

        return (
          <VStack key={index} align="left" spacing={2} textAlign="left" w="full">
            <Text
              color={eventInfo.styles.h1.color}
              fontFamily={eventInfo.styles.h1.fontFamily}
              fontSize="xl"
              fontWeight={eventInfo.styles.h1.fontWeight}
            >
              {time}
            </Text>
            <HStack align="left" overflowX="auto" pb="1" spacing={4} w="full">
              {items.map((item, idx) => (
                <Box
                  key={idx}
                  bg={item.color}
                  borderRadius="md"
                  boxShadow="md"
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  maxW={cardWidth}
                  minW={cardWidth}
                  p="4"
                >
                  <VStack align="left" flex="1" spacing={2} textAlign="left">
                    <HStack alignItems="center">
                      <RepeatClockIcon h="20px" w="20px" />
                      <Text
                        color={eventInfo.styles.h3.color}
                        fontFamily={eventInfo.styles.h3.fontFamily}
                        fontSize="md"
                        fontWeight={eventInfo.styles.h3.fontWeight}
                        mt="1"
                      >
                        {item.duration}
                      </Text>
                    </HStack>
                    <Text
                      color="gray.600"
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
                        color={eventInfo.styles.h3.color}
                        fontFamily={eventInfo.styles.h3.fontFamily}
                        fontSize="sm"
                        fontWeight={eventInfo.styles.h3.fontWeight}
                      >
                        {item.location}
                      </Text>
                    </HStack>
                    {item.speakers && (
                      <HStack mt={2} spacing={-2}>
                        {item.speakers.map((speaker, speakerIdx) => (
                          <Image
                            key={speakerIdx}
                            alt={speaker.name}
                            border="2px solid white"
                            borderRadius="full"
                            boxSize="50px"
                            src={speaker.image}
                          />
                        ))}
                      </HStack>
                    )}
                    {item.track && (
                      <Box
                        alignSelf="left"
                        bg={eventInfo.styles.buttons.primary.bg}
                        borderRadius="md"
                        mt={1}
                        px="2"
                        py="0.5"
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
                </Box>
              ))}
            </HStack>
          </VStack>
        );
      })}
    </>
  );
};

export default GroupedAgendaItems;
