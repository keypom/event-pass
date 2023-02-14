import { Box, Center, Heading, useBoolean, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { IconBox } from '@/components/IconBox';
import { BoxWithShape } from '@/components/BoxWithShape';
import { TicketIcon } from '@/components/Icons';
import keypomInstance from '@/lib/keypom';

import { CreateWallet } from '../components/CreateWallet';
import { ExistingWallet } from '../components/ExistingWallet';
import { NftReward } from '../components/nft/NftReward';

const ClaimNftPage = () => {
  const navigate = useNavigate();
  const { secretKey = '' } = useParams();
  const [haveWallet, showInputWallet] = useBoolean(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [nftImage, setNftImage] = useState('');
  const [walletsOptions, setWallets] = useState([]);

  const loadClaimInfo = async () => {
    const nftData = await keypomInstance.getNFTClaimInformation(secretKey);

    setTitle(nftData.title);
    setDescription(nftData.description);
    setNftImage(nftData.media);
    setWallets(nftData.wallets);
  };

  useEffect(() => {
    if (secretKey === '') {
      navigate('/');
    }
    // eslint-disable-next-line
    loadClaimInfo();
  }, []);

  const handleClaim = async (walletAddress: string) => {
    await keypomInstance.claim(secretKey, walletAddress);
  };

  return (
    <Box mb={{ base: '5', md: '14' }} minH="100%" minW="100%" mt={{ base: '52px', md: '100px' }}>
      <Center>
        {/** the additional gap is to accommodate for the absolute roundIcon size */}
        <VStack gap={{ base: 'calc(24px + 8px)', md: 'calc(32px + 10px)' }}>
          {/** Prompt text */}
          <Heading textAlign="center">{`You've received an NFT`}</Heading>

          {/** Claim nft component */}
          <IconBox
            icon={<TicketIcon height={{ base: '8', md: '10' }} width={{ base: '8', md: '10' }} />}
            minW={{ base: 'inherit', md: '345px' }}
            p="0"
            pb="0"
            w={{ base: '345px', md: '30rem' }}
          >
            <BoxWithShape
              bg="white"
              borderTopRadius="8xl"
              pb={{ base: '6', md: '8' }}
              pt={{ base: '12', md: '16' }}
              px={{ base: '6', md: '8' }}
              w="full "
            >
              {/** div placeholder */}
              <NftReward artworkSrc={nftImage} description={description} nftName={title} />
            </BoxWithShape>
            <VStack
              bg="gray.50"
              borderBottomRadius="8xl"
              p="8"
              spacing={{ base: '4', md: '5' }}
              w="full"
            >
              {!haveWallet ? (
                <CreateWallet wallets={walletsOptions} onClick={showInputWallet.on} />
              ) : (
                <>
                  <ExistingWallet handleSubmit={handleClaim} onBack={showInputWallet.off} />
                </>
              )}
            </VStack>
          </IconBox>
        </VStack>
      </Center>
    </Box>
  );
};

export default ClaimNftPage;