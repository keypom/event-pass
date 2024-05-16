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

const RafflesPage = ({ dropInfo, accountId }) => {
  const [currentRaffles, setCurrentRaffles] = useState([]);
  const [upcomingRaffles, setUpcomingRaffles] = useState([]);
  const [finishedRaffles, setFinishedRaffles] = useState([]);

  useEffect(() => {
    const fetchRaffles = async () => {
      const factoryAccount = dropInfo?.asset_data[1].config.root_account_id;
      const raffles = await keypomInstance.viewCall({
        contractId: factoryAccount,
        methodName: 'get_raffles_for_account',
        args: { account_id: accountId },
      });

      setCurrentRaffles(raffles.filter((raffle) => raffle.status === 'current'));
      setUpcomingRaffles(raffles.filter((raffle) => raffle.status === 'upcoming'));
      setFinishedRaffles(raffles.filter((raffle) => raffle.status === 'finished'));
    };

    fetchRaffles();
  }, [accountId, dropInfo]);

  return (
    <Center>
      <VStack maxW="1200px" p={4} width="full">
        <Heading>Raffles</Heading>
        <Accordion allowMultiple allowToggle width="full">
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Current Raffles
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              {currentRaffles.map((raffle) => (
                <Box key={raffle.id} borderRadius="md" borderWidth={1} mb={2} p={4}>
                  <Text>{raffle.name}</Text>
                </Box>
              ))}
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Upcoming Raffles
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              {upcomingRaffles.map((raffle) => (
                <Box key={raffle.id} borderRadius="md" borderWidth={1} mb={2} p={4}>
                  <Text>{raffle.name}</Text>
                </Box>
              ))}
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Finished Raffles
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              {finishedRaffles.map((raffle) => (
                <Box key={raffle.id} borderRadius="md" borderWidth={1} mb={2} p={4}>
                  <Text>{raffle.name}</Text>
                </Box>
              ))}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </VStack>
    </Center>
  );
};

export default RafflesPage;
