import { Box, Center, Flex, Heading, Hide, Image, Skeleton, Text, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getPubFromSecret } from 'keypom-js';

import { IconBox } from '@/components/IconBox';
import { BoxWithShape } from '@/components/BoxWithShape';
import { QrDetails } from '@/features/claim/components/ticket/QrDetails';
import { useTicketClaimParams } from '@/hooks/useTicketClaimParams';
import { NotFound404 } from '@/components/NotFound404';
import keypomInstance from '@/lib/keypom';
import {
  type FunderEventMetadata,
  type EventDrop,
  type TicketInfoMetadata,
  type TicketMetadataExtra,
} from '@/lib/eventsHelpers';
import { dateAndTimeToText } from '@/features/drop-manager/utils/parseDates';

export default function TicketQRPage() {
  const { secretKey } = useTicketClaimParams();

  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [eventInfo, setEventInfo] = useState<FunderEventMetadata>();
  const [ticketInfo, setTicketInfo] = useState<TicketInfoMetadata>();
  const [ticketInfoExtra, setTicketInfoExtra] = useState<TicketMetadataExtra>();

  const [eventId, setEventId] = useState('');
  const [funderId, setFunderId] = useState('');

  useEffect(() => {
    const getEventInfo = async () => {
      try {
        setIsLoading(true);
        const pubKey = getPubFromSecret(secretKey);
        const keyInfo: { drop_id: string } = await keypomInstance.viewCall({
          methodName: 'get_key_information',
          args: { key: pubKey },
        });
        const drop: EventDrop = await keypomInstance.viewCall({
          methodName: 'get_drop_information',
          args: { drop_id: keyInfo.drop_id },
        });
        const ticketMetadata: TicketInfoMetadata = drop.drop_config.nft_keys_config.token_metadata;
        setTicketInfo(ticketMetadata);

        const ticketExtra: TicketMetadataExtra = JSON.parse(ticketMetadata.extra);
        setTicketInfoExtra(ticketExtra);

        const eventInfo: FunderEventMetadata | null = await keypomInstance.getEventInfo({
          accountId: drop.funder_id,
          eventId: ticketExtra.eventId,
        });
        if (!eventInfo) {
          setIsValid(false);
          setIsLoading(false);
          return;
        }
        setEventInfo(eventInfo);
        setEventId(ticketExtra.eventId);
        setFunderId(drop.funder_id);
        setIsLoading(false);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error getting event info: ', e);
        setIsValid(false);
        setIsLoading(false);
      }
    };
    getEventInfo();
  }, []);

  if (!isValid) {
    return (
      <NotFound404 header="Ticket not found" subheader="Please check your email and try again" />
    );
  }

  const ticketDetails = () => {
    return (
      <Heading color="white" fontFamily="denverHeading" fontSize={{ base: '6xl', md: '8xl' }}>
        {ticketInfo!.title}
      </Heading>
    );
  };

  return (
    <VStack
      backgroundImage="url('https://assets-global.website-files.com/6509ee7744afed1c907f8f97/650a895bf11b20f057b53551_ethdenver_background.jpg')"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      minH="100vh"
      py="10"
      width="100vw"
    >
      <Box alignItems="center" display="flex" flexDirection="column" px={4} width="100%">
        <Center>
          <VStack gap={{ base: 'calc(24px + 8px)', md: 'calc(32px + 10px)' }} paddingBottom="20">
            <Skeleton fadeDuration={1} isLoaded={!isLoading}>
              <Heading paddingBottom="4" textAlign="center">
                {isLoading ? 'Loading ticket...' : ticketDetails()}
              </Heading>
            </Skeleton>

            <IconBox
              icon={
                <Skeleton isLoaded={!isLoading}>
                  <Image
                    height={{ base: '10', md: '12' }}
                    src="https://assets-global.website-files.com/6509ee7744afed1c907f8f97/655050623557b10a706dae04_ETHDEN_logo_full_purple-p-500.png"
                    width={{ base: '10', md: '12' }}
                  />
                </Skeleton>
              }
              maxW={{ base: '345px', md: '30rem' }}
              minW={{ base: 'inherit', md: '345px' }}
              p="0"
              pb="0"
            >
              <Box>
                <BoxWithShape bg="white" borderTopRadius="8xl" w="full">
                  {isLoading ? (
                    <Skeleton height="200px" width="full" />
                  ) : (
                    <QrDetails
                      eventDate={dateAndTimeToText(eventInfo!.date)}
                      eventId={eventId}
                      eventName={eventInfo!.name}
                      funderId={funderId}
                      qrValue={secretKey}
                      ticketInfoExtra={ticketInfoExtra}
                      ticketName={ticketInfo!.title}
                    />
                  )}
                </BoxWithShape>
                <Flex
                  align="center"
                  bg="gray.50"
                  borderBottomRadius="8xl"
                  flexDir="column"
                  px="6"
                  py="6"
                >
                  <Skeleton borderRadius="12px" isLoaded={!isLoading}>
                    <Image
                      alt={`Event image for ${eventInfo?.name}`}
                      borderRadius="12px"
                      height="300px"
                      objectFit="contain"
                      src={ticketInfo?.media}
                    />
                  </Skeleton>
                  <Hide above="md">
                    <Skeleton isLoaded={!isLoading} mt="4">
                      <Text
                        color="gray.600"
                        fontWeight="600"
                        mb="2"
                        size={{ base: 'sm', md: 'md' }}
                        textAlign="center"
                      >
                        {eventInfo?.name}
                      </Text>
                    </Skeleton>
                  </Hide>
                </Flex>
              </Box>
            </IconBox>
          </VStack>
        </Center>
      </Box>
    </VStack>
  );
}
