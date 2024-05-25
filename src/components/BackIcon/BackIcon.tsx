import { Box, Flex, Text } from '@chakra-ui/react';

import { type FunderEventMetadata } from '@/lib/eventsHelpers';

const CustomArrowIcon = ({ color = 'black', size = 20 }: { color?: string; size?: number }) => (
  <svg
    fill="none"
    height={size}
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    style={{ display: 'block' }}
    viewBox="0 0 24 24"
    width={size}
  >
    <path d="M12 19l-7-7 7-7" />
  </svg>
);

export const BackIcon = ({
  onSelectTab,
  eventInfo,
}: {
  onSelectTab: (index: number, tab: string) => void;
  eventInfo: FunderEventMetadata;
}) => {
  return (
    <Box left="2" position="absolute" top="4" zIndex="1">
      <Flex
        align="center"
        as="button"
        backgroundColor="white"
        border="1px solid white"
        borderRadius="md"
        h={{ base: '35px', md: '40px' }}
        justify="center"
        p="2"
        w={{ base: '80px', md: '100px' }}
        onClick={() => {
          onSelectTab(1, 'home');
        }}
      >
        <CustomArrowIcon color="black" size={16} />
        <Text
          color={eventInfo.styles.h3.color}
          fontFamily={eventInfo.styles.h1.fontFamily}
          fontSize="md"
          fontWeight={eventInfo.styles.h1.fontWeight}
          ml="0"
          mt="0.5"
        >
          Back
        </Text>
      </Flex>
    </Box>
  );
};
