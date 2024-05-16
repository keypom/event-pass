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
import { CheckIcon } from '@chakra-ui/icons';

import keypomInstance from '@/lib/keypom';
import { CLOUDFLARE_IPFS } from '@/constants/common';

const ScavengerPage = ({ dropInfo, accountId }) => {
  const [liveScavengers, setLiveScavengers] = useState([]);
  const [notFoundScavengers, setNotFoundScavengers] = useState([]);
  const [completedScavengers, setCompletedScavengers] = useState([]);

  useEffect(() => {
    const fetchScavengers = async () => {
      const factoryAccount = dropInfo?.asset_data[1].config.root_account_id;
      const scavs = await keypomInstance.viewCall({
        contractId: factoryAccount,
        methodName: 'get_scavengers_for_account',
        args: { account_id: accountId },
      });

      const scavengerHuntPromises = Object.entries(scavs).map(async ([id, found]) => {
        const scavDropInfo = await keypomInstance.viewCall({
          contractId: factoryAccount,
          methodName: 'get_drop_information',
          args: { drop_id: id },
        });

        return {
          id,
          name: scavDropInfo.name,
          imageUrl: `${CLOUDFLARE_IPFS}/${scavDropInfo.image}`,
          found: found.length,
          needed: scavDropInfo.scavenger_ids.length,
        };
      });

      const scavengerHunts = await Promise.all(scavengerHuntPromises);

      setLiveScavengers(scavengerHunts.filter((scav) => scav.found < scav.needed));
      setNotFoundScavengers(scavengerHunts.filter((scav) => scav.found === 0));
      setCompletedScavengers(scavengerHunts.filter((scav) => scav.found >= scav.needed));
    };

    fetchScavengers();
  }, [accountId, dropInfo]);

  return (
    <Center>
      <VStack maxW="1200px" p={4} width="full">
        <Heading>Scavenger Hunts</Heading>
        <Accordion allowMultiple allowToggle width="full">
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Live Scavenger Hunts
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              {liveScavengers.map((scavenger) => (
                <Box key={scavenger.id} borderRadius="md" borderWidth={1} mb={2} p={4}>
                  <Text>{scavenger.name}</Text>
                  <Text>
                    Found: {scavenger.found}/{scavenger.needed}
                  </Text>
                </Box>
              ))}
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Not Found Scavenger Hunts
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              {notFoundScavengers.map((scavenger) => (
                <Box key={scavenger.id} borderRadius="md" borderWidth={1} mb={2} p={4}>
                  <Text>{scavenger.name}</Text>
                </Box>
              ))}
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Completed Scavenger Hunts
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              {completedScavengers.map((scavenger) => (
                <Box key={scavenger.id} borderRadius="md" borderWidth={1} mb={2} p={4}>
                  <Text>{scavenger.name}</Text>
                  <CheckIcon color="green.500" />
                </Box>
              ))}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </VStack>
    </Center>
  );
};

export default ScavengerPage;
