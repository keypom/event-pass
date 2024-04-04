/* eslint-disable @typescript-eslint/no-misused-promises */
import { Box, Button, Center, Heading, useDisclosure, VStack } from '@chakra-ui/react';
import { useEffect, useLayoutEffect, useState } from 'react';

// import { ViewFinder } from '@/components/ViewFinder';
// import keypomInstance from '@/lib/keypom';
// import { useAppContext, type AppModalOptions } from '@/contexts/AppContext';
// import { get, set } from '@/utils/localStorage';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';


// To stop concurrent scan result handling

const IPFSTest = () => {
    const { isLoggedIn } = useAuthWalletContext();

    const handleTestClick = async () => {
        const response = await fetch(
            'http://localhost:8787/ipfs-mfs-2',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );
            const data = await response.json();
            console.log(data);
    }


    if(isLoggedIn){
    return (
        <Center height="100vh">
          <VStack spacing={4}>
            {/* <StripePurchaseTicketForm handleSubmitClick={handleTestClick} setEventName={setEventName} setStripeId={setStripeAccountId} setTicketTier={setTicketTier} setCustomerEmail={setCustomerEmail} setCustomerName={setCustomerName} /> */}
            <Button mt="4" type="submit" onClick={handleTestClick}>
                Test
            </Button>
          </VStack>
        </Center>
    );
    }else{
        return( 
        <Center height="100vh">
          <VStack spacing={4}>
            <div>Log in to Connect Stripe</div>
          </VStack>
        </Center>
        )
    }
};

export default IPFSTest;