import { useEffect, useState } from 'react';
import {
  Box,
  Tooltip,
  Center,
  Flex,
  Heading,
  Skeleton,
  Text,
  VStack,
  SimpleGrid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Divider,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react';

import { useConferenceContext } from '@/contexts/ConferenceContext';
import keypomInstance from '@/lib/keypom';
import { ScavengerCard } from '@/components/ScavengerHunt';
import { BoxWithShape } from '@/components/BoxWithShape';
import { IconBox } from '@/components/IconBox';
import { TicketIcon } from '@/components/Icons';
import { BackIcon } from '@/components/BackIcon';

interface ScavengerHunt {
  id: string;
  name: string;
  image: string;
  found: string[];
  scavenger_ids: string[];
}

const ScavengerHuntsPage: React.FC = () => {
  const { accountId, eventInfo, dropInfo, isLoading, onSelectTab, factoryAccount } =
    useConferenceContext();
  const [scavengerHunts, setScavengerHunts] = useState<ScavengerHunt[]>([]);

  useEffect(() => {
    if (!accountId) return;

    const getScavengerHunts = async () => {
      const scavs: ScavengerHunt[] = await keypomInstance.viewCall({
        contractId: factoryAccount,
        methodName: 'get_scavengers_for_account',
        args: { account_id: accountId },
      });
      setScavengerHunts(scavs);
    };

    getScavengerHunts();
  }, [accountId, dropInfo]);

  if (isLoading) {
    return (
      <Center padding={8}>
        <Skeleton height="40px" width="full" />
      </Center>
    );
  }

  const liveScavengers = scavengerHunts.filter((scav) => scav.found.length > 0);
  const completedScavengers = scavengerHunts.filter(
    (scav) => scav.found.length >= scav.scavenger_ids.length,
  );
  const notFoundScavengers = scavengerHunts.filter((scav) => scav.found.length === 0);

  const progressValue =
    scavengerHunts.length > 0 ? (completedScavengers.length / scavengerHunts.length) * 100 : 0;

  return (
    <Center>
      <VStack
        gap={{ base: 'calc(24px + 8px)', md: 'calc(32px + 10px)' }}
        maxW="1200px"
        p={4}
        pb="96px"
        width="full"
      >
        <Skeleton fadeDuration={1} isLoaded={!isLoading}>
          <Heading
            fontSize={{ base: '2xl', md: '3xl' }}
            fontWeight="500"
            paddingBottom="0"
            textAlign="center"
          >
            {isLoading ? (
              'Loading scavenger hunts...'
            ) : (
              <VStack>
                <Heading
                  color={eventInfo.styles?.title?.color}
                  fontFamily={eventInfo.styles.title?.fontFamily}
                  fontSize={{ base: '4xl', md: '8xl' }}
                  fontWeight="500"
                  textAlign="center"
                >
                  SCAVENGER HUNTS
                </Heading>
              </VStack>
            )}
          </Heading>
        </Skeleton>

        <IconBox
          bg={eventInfo.styles.border.border || 'border.box'}
          icon={
            <Skeleton isLoaded={!isLoading}>
              {eventInfo.styles.icon.image ? (
                <CircularProgress
                  color={eventInfo.styles.h1.color}
                  size="60px"
                  thickness="12px"
                  trackColor="gray.200"
                  value={progressValue}
                >
                  <CircularProgressLabel
                    color={eventInfo.styles.h1.color}
                    fontFamily={eventInfo.styles.h2.fontFamily}
                    fontSize="lg"
                    fontWeight={eventInfo.styles.h2.fontWeight}
                  >
                    {Math.round(progressValue)}%
                  </CircularProgressLabel>
                </CircularProgress>
              ) : (
                <TicketIcon height={{ base: '8', md: '10' }} width={{ base: '8', md: '10' }} />
              )}
            </Skeleton>
          }
          iconBg={eventInfo.styles.icon.bg || 'blue.100'}
          iconBorder={eventInfo.styles.icon.border || 'border.round'}
          maxW="345px"
          minW={{ base: '90vw', md: '345px' }}
          p="0"
          pb="0"
          w="90vh"
        >
          <Box h="full" overflowY="auto" position="relative">
            <BackIcon eventInfo={eventInfo} onSelectTab={onSelectTab} />
            <BoxWithShape bg="white" borderTopRadius="8xl" showNotch={false} w="full">
              {isLoading ? (
                <Skeleton height="200px" width="full" />
              ) : (
                <Flex
                  align="center"
                  flexDir="column"
                  pb={{ base: '3', md: '5' }}
                  pt={{ base: '10', md: '16' }}
                  px={{ base: '6', md: '8' }}
                >
                  <Tooltip
                    label={`You have completed ${completedScavengers.length} of ${scavengerHunts.length} scavenger hunts`}
                  >
                    <Text
                      color={eventInfo.styles.h3.color}
                      fontFamily={eventInfo.styles.h3.fontFamily}
                      fontSize="sm"
                      fontWeight={eventInfo.styles.h3.fontWeight}
                      textAlign="center"
                    >
                      {completedScavengers.length} of {scavengerHunts.length} Completed
                    </Text>
                  </Tooltip>
                  <Divider my="2" />
                  <Text
                    color={eventInfo.styles.h3.color}
                    fontFamily={eventInfo.styles.h3.fontFamily}
                    fontSize="sm"
                    fontWeight={eventInfo.styles.h3.fontWeight}
                    pb="2"
                    textAlign="center"
                  >
                    Find all the pieces to unlock tokens, NFTs, and more!
                  </Text>

                  <Accordion allowMultiple defaultIndex={[0]} width="100%">
                    <AccordionItem border="none" width="100%">
                      <AccordionButton
                        _expanded={{ bg: 'none', borderBottom: 'none' }}
                        _focus={{ boxShadow: 'none' }}
                        _hover={{ bg: 'none' }}
                        pb="0"
                        width="100%"
                      >
                        <Box flex="1" textAlign="left" width="100%">
                          <Heading
                            color={eventInfo.styles.h1.color}
                            fontFamily={eventInfo.styles.h1.fontFamily}
                            fontSize="2xl"
                            fontWeight={eventInfo.styles.h1.fontWeight}
                            textAlign="center"
                          >
                            Active
                          </Heading>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel pb={4} pt={liveScavengers.length > 0 ? 4 : 0} width="100%">
                        {liveScavengers.length > 0 ? (
                          <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4} width="100%">
                            {liveScavengers.map((scavenger) => (
                              <ScavengerCard key={scavenger.id} scavenger={scavenger} />
                            ))}
                          </SimpleGrid>
                        ) : (
                          <Center pt="0">
                            <Text
                              color={eventInfo.styles.h3.color}
                              fontFamily={eventInfo.styles.h3.fontFamily}
                              fontSize="sm"
                              fontWeight={eventInfo.styles.h3.fontWeight}
                              textAlign="center"
                            >
                              No active scavenger hunts found.
                            </Text>
                          </Center>
                        )}
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </Flex>
              )}
            </BoxWithShape>
            <Flex align="center" bg="gray.50" borderRadius="8xl" direction="column" px="6">
              <Accordion allowMultiple defaultIndex={[0]} w="100%">
                <AccordionItem border="none">
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <Heading
                        color={eventInfo.styles.h1.color}
                        fontFamily={eventInfo.styles.h1.fontFamily}
                        fontSize="2xl"
                        fontWeight={eventInfo.styles.h1.fontWeight}
                        textAlign="center"
                      >
                        Not Started
                      </Heading>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4} w="full">
                      {notFoundScavengers.map((scavenger) => (
                        <ScavengerCard key={scavenger.id} scavenger={scavenger} />
                      ))}
                    </SimpleGrid>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Flex>
          </Box>
        </IconBox>
      </VStack>
    </Center>
  );
};

export default ScavengerHuntsPage;
