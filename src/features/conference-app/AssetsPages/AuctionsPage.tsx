import { useEffect, useState } from 'react';
import {
  Box,
  Center,
  Heading,
  VStack,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';

import keypomInstance from '@/lib/keypom';

const AuctionsPage = ({ dropInfo, accountId }) => {
  const [upcomingAuctions, setUpcomingAuctions] = useState([]);
  const [liveAuctions, setLiveAuctions] = useState([]);
  const [finishedAuctions, setFinishedAuctions] = useState([]);

  useEffect(() => {
    const fetchAuctions = async () => {
      const factoryAccount = dropInfo?.asset_data[1].config.root_account_id;
      const auctions = await keypomInstance.viewCall({
        contractId: factoryAccount,
        methodName: 'get_auctions_for_account',
        args: { account_id: accountId },
      });

      setUpcomingAuctions(auctions.filter((auction) => auction.status === 'upcoming'));
      setLiveAuctions(auctions.filter((auction) => auction.status === 'live'));
      setFinishedAuctions(auctions.filter((auction) => auction.status === 'finished'));
    };

    fetchAuctions();
  }, [accountId, dropInfo]);

  return (
    <Center>
      <VStack maxW="1200px" p={4} width="full">
        <Heading>Auctions</Heading>
        <Accordion allowMultiple allowToggle width="full">
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Upcoming Auctions
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              {upcomingAuctions.map((auction) => (
                <Box key={auction.id} borderRadius="md" borderWidth={1} mb={2} p={4}>
                  <Text>{auction.name}</Text>
                </Box>
              ))}
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Live Auctions
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              {liveAuctions.map((auction) => (
                <Box key={auction.id} borderRadius="md" borderWidth={1} mb={2} p={4}>
                  <Text>{auction.name}</Text>
                </Box>
              ))}
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Finished Auctions
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              {finishedAuctions.map((auction) => (
                <Box key={auction.id} borderRadius="md" borderWidth={1} mb={2} p={4}>
                  <Text>{auction.name}</Text>
                </Box>
              ))}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </VStack>
    </Center>
  );
};

export default AuctionsPage;
