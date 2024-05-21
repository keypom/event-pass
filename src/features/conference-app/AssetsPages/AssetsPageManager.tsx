import { useConferenceContext } from '@/contexts/ConferenceContext';

import ScavengerPage from './ScavengerPage';
import CollectiblesPage from './CollectiblesPage';
import RafflesPage from './RafflesPage';
import AuctionsPage from './AuctionsPage';
import AssetsHome from './AssetsHome';

const AssetsPageManager = () => {
  const { accountId, dropInfo, queryString } = useConferenceContext();
  const tab = queryString.get('tab') || 'home';

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
