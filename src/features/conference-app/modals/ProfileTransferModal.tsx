import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  VStack,
  useColorModeValue,
  useToast,
  Box,
  Grid,
  GridItem,
  Spinner,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
// Importing the backspace icon
import { accountExists } from 'keypom-js';

import keypomInstance from '@/lib/keypom';
import { type FunderEventMetadata } from '@/lib/eventsHelpers';
import { DeleteTextIcon } from '@/components/Icons/DeleteTextIcon';

interface ProfileTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  eventInfo: FunderEventMetadata;
  tokensAvailable: string;
  curAccountId: string;
  secretKey: string;
  factoryAccount: string;
  sendTo: string;
}

const ProfileTransferModal = ({
  isOpen,
  onClose,
  title,
  eventInfo,
  curAccountId,
  secretKey,
  factoryAccount,
  sendTo,
}: ProfileTransferModalProps) => {
  const [amount, setAmount] = useState('');

  const [isSending, setIsSending] = useState(false);
  const [isValidAccount, setIsValidAccount] = useState(true);
  const [tokensAvailable, setTokensAvailable] = useState('');

  const [isOversend, setIsOversend] = useState(false);
  const [isInvalidNumber, setIsInvalidNumber] = useState(false);
  const toast = useToast();

  const fetchBalance = async () => {
    const balance = await keypomInstance.viewCall({
      contractId: factoryAccount,
      methodName: 'ft_balance_of',
      args: { account_id: curAccountId },
    });
    setTokensAvailable(keypomInstance.yoctoToNearWith4Decimals(balance));
  };

  useEffect(() => {
    if (isOpen) {
      fetchBalance();
    }
  }, [isOpen]);

  const closeModal = () => {
    setAmount('');

    setIsSending(false);
    setIsValidAccount(true);

    setIsOversend(false);
    setIsInvalidNumber(false);
    onClose();
  };

  const checkInvalidNumber = () => {
    if (!amount || amount === undefined || amount.length === 0 || parseFloat(amount) <= 0) {
      setIsInvalidNumber(true);
      return true;
    }

    setIsInvalidNumber(false);
    return false;
  };

  const handleConfirm = async () => {
    const validAccount = await checkAccountValidity(sendTo);
    if (!validAccount) {
      setIsValidAccount(false);
      setIsSending(false);
      return;
    }

    if (parseFloat(amount) > parseFloat(tokensAvailable)) {
      setIsOversend(true);
      setIsSending(false);
      return;
    }

    if (checkInvalidNumber()) {
      setIsSending(false);
      return;
    }

    try {
      setIsSending(true);
      await keypomInstance.sendConferenceTokens({
        secretKey,
        accountId: curAccountId,
        sendTo,
        amount: keypomInstance.nearToYocto(amount)!,
        factoryAccount,
      });
      toast({
        title: 'Transfer successful',
        description: `Successfully transferred ${amount} tokens to ${sendTo.split('.')[0]}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Transfer failed',
        description: 'An error occurred during the transfer. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSending(false);
      closeModal();
    }
  };

  const checkAccountValidity = async (account: string) => {
    if (!account) {
      return false;
    }
    return await accountExists(account);
  };

  useEffect(() => {
    if (amount && parseFloat(amount) <= parseFloat(tokensAvailable)) {
      setIsOversend(false);
    }

    setIsInvalidNumber(false);
  }, [amount, tokensAvailable]);

  const modalBackground = useColorModeValue('white', 'gray.700');
  const modalPadding = { base: '6', md: '8' };

  const handleKeypadClick = (value: string) => {
    setAmount((prev) => {
      if (value === 'backspace') {
        const [integerPart, decimalPart] = prev.split('.');
        console.log('Integer part: ', integerPart, ' decimal part: ', decimalPart);

        // Regular integer like 54 or 54. (with the decimal) so remove the `4`
        if (decimalPart === undefined || decimalPart.length === 0) {
          return integerPart.slice(0, -1);
        }

        // There's a single decimal part like 5.4 so return the `5`
        if (decimalPart.length === 1) {
          return integerPart;
        }

        // Regular floating point number
        return prev.slice(0, -1);
      }
      if (value === '.' && prev.includes('.')) {
        return prev; // Prevent multiple decimals
      }
      const newAmount = prev + value;
      if (newAmount.includes('.') && newAmount.split('.')[1].length > 4) {
        return prev; // Prevent more than 4 decimal places
      }
      return newAmount;
    });
  };

  const formatAmount = (amount: string) => {
    if (!amount) return '0.00';
    const [integerPart, decimalPart] = amount.split('.');
    if (decimalPart === undefined) return integerPart;
    if (integerPart.length === 0 && decimalPart.length === 0) return '0.00';
    if (decimalPart.length === 0) return parseFloat(amount).toFixed(1);
    if (decimalPart.length <= 4) return parseFloat(amount).toFixed(decimalPart.length);
    return parseFloat(amount).toFixed(4);
  };

  return (
    <Modal isCentered isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay backdropFilter="blur(0px)" bg="blackAlpha.600" opacity="1" />
      <ModalContent
        bg={modalBackground}
        mx={3}
        p={modalPadding}
        position="relative"
        textAlign="center"
      >
        <Box filter={isSending ? 'blur(3px)' : 'none'} transition="filter 0.2s">
          <ModalHeader pb={2} pt={6}>
            <VStack pb="2" spacing="1">
              <Text
                color={eventInfo.styles.h1.color}
                fontFamily={eventInfo.styles.h1.fontFamily}
                fontSize="2xl"
                fontWeight={eventInfo.styles.h1.fontWeight}
                textAlign="center"
              >
                {title}
              </Text>
              <Text
                fontFamily={eventInfo.styles.h3.fontFamily}
                fontSize="sm"
                fontWeight={eventInfo.styles.h3.fontWeight}
                pb={4}
                textAlign="center"
                w="full"
              >
                Available Balance: {tokensAvailable} tokens
              </Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={8}>
              <VStack spacing="1">
                <Text
                  color={eventInfo.styles.h2.color}
                  fontFamily={eventInfo.styles.h2.fontFamily}
                  fontSize="5xl"
                  fontWeight={eventInfo.styles.h2.fontWeight}
                >
                  {formatAmount(amount)}
                </Text>
                {!isValidAccount && (
                  <Text color="red.500">Account ID is invalid or does not exist.</Text>
                )}
                {isOversend && <Text color="red.500">Insufficient balance.</Text>}
                {isInvalidNumber && <Text color="red.500">Invalid number.</Text>}
              </VStack>
              <Grid gap={3} templateColumns="repeat(3, 1fr)" w="full">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'].map(
                  (num, idx) => (
                    <GridItem key={idx}>
                      {num === 'backspace' ? (
                        <Button
                          _active={{
                            bg: 'gray.300', // Change color on click to gray
                          }}
                          _focus={{
                            boxShadow: 'none',
                            bg: 'white', // Maintain white background on focus
                          }}
                          _hover={{ bg: 'gray.100' }} // Change color on hover to light gray
                          bg="white"
                          color="black"
                          h="12"
                          size="lg"
                          transition="background-color 0.1s ease"
                          w="full"
                          onClick={() => {
                            handleKeypadClick(num);
                          }}
                        >
                          <DeleteTextIcon boxSize="1.5em" />
                        </Button>
                      ) : (
                        <Button
                          _active={{
                            bg: 'gray.300', // Change color on click to gray
                          }}
                          _focus={{
                            boxShadow: 'none',
                            bg: 'white', // Maintain white background on focus
                          }}
                          _hover={{ bg: 'gray.100' }} // Change color on hover to light gray
                          bg="white"
                          border="2px solid transparent"
                          borderColor={num === '.' ? 'white' : 'gray.100'}
                          borderRadius="0.75em"
                          color={eventInfo.styles.h2.color}
                          fontFamily={eventInfo.styles.h2.fontFamily}
                          fontSize="xl"
                          fontWeight={eventInfo.styles.h2.fontWeight}
                          h="12"
                          size="lg"
                          transition="background-color 0.1s ease"
                          w="full"
                          onClick={() => {
                            handleKeypadClick(num);
                          }}
                        >
                          {num}
                        </Button>
                      )}
                    </GridItem>
                  ),
                )}
              </Grid>
            </VStack>
          </ModalBody>
          <ModalFooter flexDirection="column" pb={6} pt={0}>
            <VStack spacing="3" w="full">
              <Button
                backgroundColor={eventInfo.styles.buttons.primary.bg}
                color={eventInfo.styles.buttons.primary.color}
                fontFamily={eventInfo.styles.buttons.primary.fontFamily}
                fontSize={eventInfo.styles.buttons.primary.fontSize}
                fontWeight={eventInfo.styles.buttons.primary.fontWeight}
                h={eventInfo.styles.buttons.primary.h}
                isDisabled={isSending}
                sx={eventInfo.styles.buttons.primary.sx}
                variant="outline"
                w="full"
                onClick={handleConfirm}
              >
                Confirm
              </Button>
              <Button
                backgroundColor="gray.800"
                color={eventInfo.styles.buttons.primary.color}
                fontFamily={eventInfo.styles.buttons.primary.fontFamily}
                fontSize={eventInfo.styles.buttons.primary.fontSize}
                fontWeight={eventInfo.styles.buttons.primary.fontWeight}
                h={eventInfo.styles.buttons.primary.h}
                isDisabled={isSending}
                sx={eventInfo.styles.buttons.primary.sx}
                variant="outline"
                w="full"
                onClick={closeModal}
              >
                Close
              </Button>
            </VStack>
          </ModalFooter>
        </Box>
        {isSending && (
          <Box
            alignItems="center"
            borderRadius="md"
            bottom="0"
            display="flex"
            justifyContent="center"
            left="0"
            position="absolute"
            right="0"
            top="0"
            zIndex="1"
          >
            <Spinner
              color="blue.500"
              emptyColor="gray.200"
              size="xl"
              speed="0.65s"
              thickness="4px"
            />
          </Box>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ProfileTransferModal;
