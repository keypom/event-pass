import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getPubFromSecret } from 'keypom-js';

import { CLOUDFLARE_IPFS } from '@/constants/common';
import {
  type TicketInfoMetadata,
  type TicketMetadataExtra,
  type FunderEventMetadata,
  type EventDrop,
} from '@/lib/eventsHelpers';
import keypomInstance from '@/lib/keypom';
import { ProfileIcon } from '@/components/Icons/ProfileIcon';
import { WalletIcon } from '@/components/Icons/WalletIcon';
import { FooterCalendarIcon } from '@/components/Icons/FooterCalendarIcon';
import { ScanIcon } from '@/components/Icons/ScanIcon';

import ProfilePage from './ProfilePage';

const footerMenuItems = [
  { label: 'Profile', icon: ProfileIcon },
  { label: 'Assets', icon: WalletIcon },
  { label: 'Agenda', icon: FooterCalendarIcon },
  { label: 'Scan', icon: ScanIcon },
];

const selectedColor = 'black';
const unselectedColor = 'white';

interface InConferenceAppProps {
  eventInfo?: FunderEventMetadata;
  ticketInfo?: TicketInfoMetadata;
  ticketInfoExtra?: TicketMetadataExtra;
  dropInfo?: EventDrop;
  isLoading: boolean;
  eventId: string;
  funderId: string;
  secretKey: string;
}

export default function InConferenceApp({
  eventInfo,
  ticketInfoExtra,
  dropInfo,
  ticketInfo,
  isLoading,
  eventId,
  funderId,
  secretKey,
}: InConferenceAppProps) {
  const [accountId, setAccountId] = useState<string>('');
  const [tokensAvailable, setTokensAvailable] = useState<string>('0');
  const [selectedTab, setSelectedTab] = useState<number>(0);

  useEffect(() => {
    const recoverAccount = async () => {
      if (dropInfo) {
        const factoryAccount = dropInfo?.asset_data[1].config.root_account_id;
        const recoveredAccountId = await keypomInstance.viewCall({
          contractId: factoryAccount,
          methodName: 'recover_account',
          args: { key: getPubFromSecret(secretKey) },
        });
        const balance = await keypomInstance.viewCall({
          contractId: factoryAccount,
          methodName: 'ft_balance_of',
          args: { account_id: recoveredAccountId },
        });
        setTokensAvailable(keypomInstance.yoctoToNear(balance));
        setAccountId(recoveredAccountId);
        console.log('Recovered account ID', recoveredAccountId);
      }
    };
    recoverAccount();
  }, [dropInfo]);

  return (
    <VStack
      backgroundImage={
        eventInfo?.qrPage?.background && `${CLOUDFLARE_IPFS}/${eventInfo.qrPage.background}`
      }
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      minH="100vh"
      py="2"
      width="100vw"
    >
      <ProfilePage
        accountId={accountId}
        dropInfo={dropInfo}
        eventId={eventId}
        eventInfo={eventInfo}
        funderId={funderId}
        isLoading={isLoading}
        secretKey={secretKey}
        ticketInfo={ticketInfo}
        ticketInfoExtra={ticketInfoExtra}
        tokensAvailable={tokensAvailable}
      />
      <HStack
        as="footer"
        backgroundColor="#844AFF" // change the background color as needed
        bottom="0" // zero pixels from the bottom
        boxShadow="0 -2px 10px rgba(0,0,0,0.05)" // optional shadow for depth
        justifyContent="space-evenly"
        left="0" // zero pixels from the left
        paddingY="2" // add padding on top and bottom of the footer
        position="fixed" // fixed position to pin the footer at the bottom
        spacing="24px" // adjust the spacing as needed
        width="full"
      >
        {footerMenuItems.map((item, index) => {
          const IconComponent = item.icon;
          const isActive = index === selectedTab;
          return (
            <Flex
              key={index}
              align="center"
              direction="column"
              onClick={() => {
                setSelectedTab(index);
              }} // Update the selectedTab state
            >
              <Box
                as="button"
                paddingX="2"
                paddingY="1"
                // Other styles or props you want to apply to the button
              >
                <IconComponent
                  color={isActive ? selectedColor : unselectedColor} // Conditionally apply color
                  h="40px"
                  w="40px"
                />
                <Text
                  color={isActive ? selectedColor : unselectedColor}
                  fontFamily="denverBody"
                  fontSize="md"
                  fontWeight="400"
                  marginTop="2"
                >
                  {item.label}
                </Text>
              </Box>
            </Flex>
          );
        })}
      </HStack>
    </VStack>
  );
}
