import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getPubFromSecret } from 'keypom-js';
import { useLocation, useNavigate } from 'react-router-dom';

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
import ScanningPage from './ScanningPage';
import AssetsPageManager from './AssetsPages/AssetsPageManager';

const footerMenuItems = [
  { label: 'Profile', icon: ProfileIcon, path: '/conference/app/profile' },
  { label: 'Assets', icon: WalletIcon, path: '/conference/app/assets' },
  { label: 'Agenda', icon: FooterCalendarIcon, path: '/conference/app/agenda' },
  { label: 'Scan', icon: ScanIcon, path: '/conference/app/scan' },
];

const selectedColor = 'black';
const unselectedColor = 'white';

interface InConferenceAppProps {
  eventInfo: FunderEventMetadata;
  ticketInfo: TicketInfoMetadata;
  ticketInfoExtra: TicketMetadataExtra;
  dropInfo: EventDrop;
  isLoading: boolean;
  eventId: string;
  funderId: string;
  ticker: string;
  secretKey: string;
  factoryAccount: string;
}

export default function InConferenceApp({
  eventInfo,
  ticketInfoExtra,
  dropInfo,
  ticketInfo,
  factoryAccount,
  isLoading,
  ticker,
  eventId,
  funderId,
  secretKey,
}: InConferenceAppProps) {
  const [accountId, setAccountId] = useState<string>('');
  const [tokensAvailable, setTokensAvailable] = useState<string>('0');
  const location = useLocation();
  const navigate = useNavigate();

  const path = location.pathname.split('/').pop() || 'profile';
  const initialTab = footerMenuItems.findIndex((item) => item.path.includes(path));
  const [selectedTab, setSelectedTab] = useState<number>(initialTab !== -1 ? initialTab : 0);
  const [triggerRefetch, setTriggerRefetch] = useState<number>(0);

  const currentTab = () => {
    switch (selectedTab) {
      case 0:
        return (
          <ProfilePage
            accountId={accountId}
            dropInfo={dropInfo}
            eventId={eventId}
            eventInfo={eventInfo}
            funderId={funderId}
            isLoading={isLoading || accountId.length === 0}
            secretKey={secretKey}
            ticker={ticker}
            ticketInfo={ticketInfo}
            ticketInfoExtra={ticketInfoExtra}
            tokensAvailable={tokensAvailable}
          />
        );
      case 1:
        return (
          <AssetsPageManager
            accountId={accountId}
            dropInfo={dropInfo}
            eventInfo={eventInfo}
            isLoading={isLoading || accountId.length === 0}
            setTriggerRefetch={setTriggerRefetch}
            ticker={ticker}
            tokensAvailable={tokensAvailable}
          />
        );
      case 2:
        return <div>Agenda</div>;
      case 3:
        return (
          <ScanningPage
            accountId={accountId}
            dropInfo={dropInfo}
            eventId={eventId}
            eventInfo={eventInfo}
            factoryAccount={factoryAccount}
            funderId={funderId}
            isLoading={isLoading || accountId.length === 0}
            secretKey={secretKey}
            setSelectedTab={setSelectedTab}
            setTriggerRefetch={setTriggerRefetch}
            ticker={ticker}
            ticketInfo={ticketInfo}
            ticketInfoExtra={ticketInfoExtra}
            tokensAvailable={tokensAvailable}
          />
        );
      default:
        return <div />;
    }
  };

  useEffect(() => {
    const recoverAccount = async () => {
      if (!isLoading && dropInfo.drop_id !== 'loading' && factoryAccount.length !== 0) {
        console.log('Secret Key: ', secretKey);
        console.log('Factory Account: ', factoryAccount);
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
        console.log('recovered account id: ', recoveredAccountId);
        console.log('balance: ', balance);
        setTokensAvailable(keypomInstance.yoctoToNearWith4Decimals(balance));
        setAccountId(recoveredAccountId);
      }
    };
    recoverAccount();
  }, [dropInfo, selectedTab, triggerRefetch, factoryAccount, isLoading]);

  useEffect(() => {
    // This will run when `selectedTab` changes and update the URL
    navigate(footerMenuItems[selectedTab].path, { replace: true });
  }, [selectedTab, navigate]);

  return (
    <VStack
      backgroundImage={
        eventInfo?.styles?.background && `${CLOUDFLARE_IPFS}/${eventInfo.styles.background}`
      }
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      minH="100vh"
      py="2"
      width="100vw"
    >
      {currentTab()}
      <HStack
        as="footer"
        backgroundColor={eventInfo?.styles?.h1.color} // change the background color as needed
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
                  fontFamily={eventInfo?.styles?.h3.fontFamily}
                  fontSize="md"
                  fontWeight={eventInfo?.styles?.h3.fontWeight}
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
