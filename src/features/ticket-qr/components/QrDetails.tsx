import { Box, Button, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';

import {
  type FunderEventMetadata,
  type TicketInfoMetadata,
  type TicketMetadataExtra,
} from '@/lib/eventsHelpers';
import { dateAndTimeToText } from '@/features/drop-manager/utils/parseDates';

interface QrDetailsProps {
  qrValue: string;
  eventInfo: FunderEventMetadata;
  eventId: string;
  funderId: string;
  ticketInfoExtra?: TicketMetadataExtra;
  ticketInfo: TicketInfoMetadata;
}

export const QrDetails = ({
  qrValue,
  eventInfo,
  funderId,
  eventId,
  ticketInfoExtra,
  ticketInfo,
}: QrDetailsProps) => {
  const navigate = useNavigate();
  const handleDownloadQrCode = () => {
    const svg = document.getElementById('QRCode');

    if (svg === null) {
      console.error('QR code is not found on document.');
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (ctx === null) {
      console.error('ctx is null');
      return;
    }

    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `${ticketInfo?.title}_Keypom_Ticket_QR_CODE`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };
  const shouldShowDownloadButton = eventInfo?.qrPage.showDownloadButton;

  const shouldShowSellButtonHelper = eventInfo?.qrPage.sellableThroughText;
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
      {eventInfo.qrPage?.dateUnderQR && (
        <Text
          color={eventInfo.styles.h1.color}
          fontFamily={eventInfo.styles.h1.fontFamily}
          fontWeight={eventInfo.styles.h1.fontWeight}
          mb="1"
          size={{ base: 'lg', md: '2xl' }}
          textAlign="center"
        >
          {dateAndTimeToText(eventInfo.date, '', false, true)}
        </Text>
      )}
      <Text
        color="gray.600"
        fontFamily={eventInfo.styles.h3.fontFamily}
        fontWeight={eventInfo.styles.h3.fontWeight}
        mb="6"
        size={{ base: 'sm', md: 'sm' }}
        textAlign="center"
      >
        Once inside, visit this page to start your journey
      </Text>
      <VStack w="full">
        <VStack spacing="1" w="full">
          {shouldShowDownloadButton && (
            <Button variant="outline" w="full" onClick={handleDownloadQrCode}>
              Download QR code
            </Button>
          )}
          <Button
            backgroundColor={eventInfo?.styles?.buttons.primary.bg}
            color={eventInfo?.styles?.buttons.primary.color}
            fontFamily={eventInfo?.styles?.buttons.primary.fontFamily}
            fontSize={eventInfo?.styles?.buttons.primary.fontSize}
            fontWeight={eventInfo?.styles?.buttons.primary.fontWeight}
            h={eventInfo?.styles?.buttons.primary.h}
            sx={eventInfo?.styles?.buttons.primary.sx}
            variant="outline"
            w="full"
            onClick={() => {
              navigate(`/gallery/${funderId}:${eventId}#secretKey=${qrValue}`);
            }}
          >
            SELL TICKET
          </Button>
          {shouldShowSellButtonHelper && (
            <>
              <Heading
                fontFamily="body"
                fontSize={{ base: 'xs', md: 'xs' }}
                fontWeight="500"
                textAlign="center"
              >
                Can be sold through:
              </Heading>
              <Heading fontSize={{ base: 'xs', md: 'xs' }} fontWeight="500" textAlign="center">
                {ticketInfoExtra && dateAndTimeToText(ticketInfoExtra?.salesValidThrough)}
              </Heading>
            </>
          )}
        </VStack>
      </VStack>
    </Flex>
  );
};
