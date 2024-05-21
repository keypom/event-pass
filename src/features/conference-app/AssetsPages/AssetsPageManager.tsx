import { useLocation } from 'react-router-dom';

import { useConferenceContext } from '@/contexts/ConferenceContext';

import ScavengerPage from './ScavengerPage';
import CollectiblesPage from './CollectiblesPage';
import RafflesPage from './RafflesPage';
import AuctionsPage from './AuctionsPage';
import AssetsHome from './AssetsHome';

const AssetsPageManager = () => {
  const { accountId, dropInfo } = useConferenceContext();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const tab = query.get('tab') || 'home';

  switch (tab) {
    case 'scavengers':
      return <ScavengerPage />;
    case 'collectibles':
      return <CollectiblesPage />;
    case 'raffles':
      return <RafflesPage accountId={accountId} dropInfo={dropInfo} />;
    case 'auctions':
      return <AuctionsPage accountId={accountId} dropInfo={dropInfo} />;
    default:
      return <AssetsHome />;
  }
};

export default AssetsPageManager;
