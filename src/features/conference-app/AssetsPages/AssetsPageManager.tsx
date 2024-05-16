import { useLocation } from 'react-router-dom';

import { type EventDrop, type FunderEventMetadata } from '@/lib/eventsHelpers';

import ScavengerPage from './ScavengerPage';
import CollectiblesPage from './CollectiblesPage';
import RafflesPage from './RafflesPage';
import AuctionsPage from './AuctionsPage';
import AssetsHome from './AssetsHome';

interface AssetsPageManagerProps {
  accountId: string;
  dropInfo: EventDrop;
  eventInfo: FunderEventMetadata;
  isLoading: boolean;
  tokensAvailable: string;
  ticker: string;
  setTriggerRefetch: React.Dispatch<React.SetStateAction<number>>;
}

const AssetsPageManager = ({
  dropInfo,
  eventInfo,
  accountId,
  isLoading,
  ticker,
  tokensAvailable,
  setTriggerRefetch,
}: AssetsPageManagerProps) => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const tab = query.get('tab') || 'home';

  switch (tab) {
    case 'scavengers':
      return <ScavengerPage accountId={accountId} dropInfo={dropInfo} />;
    case 'collectibles':
      return <CollectiblesPage accountId={accountId} dropInfo={dropInfo} />;
    case 'raffles':
      return <RafflesPage accountId={accountId} dropInfo={dropInfo} />;
    case 'auctions':
      return <AuctionsPage accountId={accountId} dropInfo={dropInfo} />;
    default:
      return (
        <AssetsHome
          accountId={accountId}
          dropInfo={dropInfo}
          eventInfo={eventInfo}
          isLoading={isLoading}
          ticker={ticker}
          tokensAvailable={tokensAvailable}
        />
      );
  }
};

export default AssetsPageManager;
