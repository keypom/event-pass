import { Box, Button, Flex, Text, VStack } from '@chakra-ui/react';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';

import { type TicketMetadataExtra } from '@/lib/eventsHelpers';

interface QrDetailsProps {
  qrValue: string;
  ticketName: string;
  eventName: string;
  eventId: string;
  eventDate: string;
  funderId: string;
  ticketInfoExtra?: TicketMetadataExtra;
}

export const QrDetails = ({
  qrValue,
  ticketName,
  eventName,
  eventDate,
  eventId,
  funderId,
  ticketInfoExtra,
}: QrDetailsProps) => {
  const navigate = useNavigate();

  return (
    <Flex align="center" flexDir="column" p={{ base: '6', md: '8' }} pt={{ base: '12', md: '16' }}>
      <Box
        border="1px solid"
        borderColor="gray.200"
        borderRadius="12px"
        mb={{ base: '2', md: '2' }}
        p="5"
      >
        <QRCode id="QRCode" size={240} value={qrValue} />
      </Box>
      <Text
        color="#844AFF"
        fontFamily="denverBody"
        fontWeight="600"
        mb="1"
        size={{ base: 'lg', md: '2xl' }}
        textAlign="center"
      >
        {eventDate}
      </Text>

      <Text
        color="gray.600"
        fontFamily="denverBody"
        fontWeight="400"
        mb="6"
        size={{ base: 'sm', md: 'sm' }}
        textAlign="center"
      >
        Once inside, visit this page to start your journey
      </Text>
      <VStack w="full">
        <VStack spacing="1" w="full">
          <Button
            backgroundColor="#FF65AF"
            color="white"
            fontFamily="denverBody"
            fontSize="2xl"
            fontWeight="500"
            h="48px"
            sx={{ _hover: { backgroundColor: '#FF65AF' } }}
            variant="outline"
            w="full"
            onClick={() => {
              navigate(`/gallery/${funderId}:${eventId}#secretKey=${qrValue}`);
            }}
          >
            SELL TICKET
          </Button>
        </VStack>
      </VStack>
    </Flex>
  );
};
