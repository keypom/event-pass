import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { CLOUDFLARE_IPFS } from '@/constants/common';
import { conferenceFooterMenuItems, useConferenceContext } from '@/contexts/ConferenceContext';

import ProfilePage from './ProfilePage';
import ScanningPage from './ScanningPage';
import AssetsPageManager from './AssetsPages/AssetsPageManager';

const selectedColor = 'black';
const unselectedColor = 'white';

const InConferenceApp = () => {
  const { eventInfo, selectedTab, onSelectTab, queryString } = useConferenceContext();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`${conferenceFooterMenuItems[selectedTab].path}?${queryString}`, { replace: true });
  }, [selectedTab, queryString, navigate]);

  const currentTab = () => {
    switch (selectedTab) {
      case 0:
        return <ProfilePage />;
      case 1:
        return <AssetsPageManager />;
      case 2:
        return <div>Agenda</div>;
      case 3:
        return <ScanningPage />;
      default:
        return <div />;
    }
  };

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
        backgroundColor={eventInfo?.styles?.h1.color}
        bottom="0"
        boxShadow="0 -2px 10px rgba(0,0,0,0.05)"
        justifyContent="space-evenly"
        left="0"
        paddingY="2"
        position="fixed"
        spacing="24px"
        width="full"
      >
        {conferenceFooterMenuItems.map((item, index) => {
          const IconComponent = item.icon;
          const isActive = index === selectedTab;
          return (
            <Flex
              key={index}
              align="center"
              direction="column"
              onClick={() => {
                onSelectTab(index);
              }}
            >
              <Box as="button" paddingX="2" paddingY="1">
                <IconComponent
                  color={isActive ? selectedColor : unselectedColor}
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
};

export default InConferenceApp;
