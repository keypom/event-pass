import { useEffect, useState } from 'react';
import { getPubFromSecret } from 'keypom-js';

import { useTicketClaimParams } from '@/hooks/useTicketClaimParams';
import { NotFound404 } from '@/components/NotFound404';
import keypomInstance from '@/lib/keypom';
import {
  type FunderEventMetadata,
  type EventDrop,
  type TicketInfoMetadata,
  type TicketMetadataExtra,
} from '@/lib/eventsHelpers';

import TicketQRPage from './TicketQRPage';
import WelcomePage from './conference-app/WelcomePage';
import InConferenceApp from './conference-app/InConferenceApp';

export default function TicketPage() {
  const { secretKey } = useTicketClaimParams();

  // State variables for managing the ticket and event information
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [eventInfo, setEventInfo] = useState<FunderEventMetadata>();
  const [dropInfo, setDropInfo] = useState<EventDrop>();
  const [ticketInfo, setTicketInfo] = useState<TicketInfoMetadata>();
  const [ticketInfoExtra, setTicketInfoExtra] = useState<TicketMetadataExtra>();
  const [maxKeyUses, setMaxKeyUses] = useState<number>();
  const [curKeyStep, setCurKeyStep] = useState<number>(1);
  const [eventId, setEventId] = useState('');
  const [funderId, setFunderId] = useState('');
  const [ticker, setTicker] = useState<string>('');
  const [tokensToClaim, setTokensToClaim] = useState<string>('');

  useEffect(() => {
    const getEventInfo = async () => {
      try {
        setIsLoading(true);
        const pubKey = getPubFromSecret(secretKey);
        const keyInfo = await keypomInstance.viewCall({
          methodName: 'get_key_information',
          args: { key: pubKey },
        });
        const drop = await keypomInstance.viewCall({
          methodName: 'get_drop_information',
          args: { drop_id: keyInfo.drop_id },
        });
        setDropInfo(drop);
        setMaxKeyUses(drop.max_key_uses);
        setCurKeyStep(drop.max_key_uses - keyInfo.uses_remaining + 1);

        const ticketMetadata = drop.drop_config.nft_keys_config.token_metadata;
        setTicketInfo(ticketMetadata);
        const ticketExtra = JSON.parse(ticketMetadata.extra);
        setTicketInfoExtra(ticketExtra);

        const eventInfo = await keypomInstance.getEventInfo({
          accountId: drop.funder_id,
          eventId: ticketExtra.eventId,
        });
        if (!eventInfo) {
          setIsValid(false);
          setIsLoading(false);
          return;
        }
        setEventInfo(eventInfo);
        setEventId(ticketExtra.eventId);
        setFunderId(drop.funder_id);

        // eslint-disable-next-line no-console
        console.log('eventInfo', eventInfo);
        // eslint-disable-next-line no-console
        console.log('Ticket Metadata', ticketMetadata);
        // eslint-disable-next-line no-console
        console.log('Ticket Metadata Extra', ticketExtra);

        setIsLoading(false);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error getting event info: ', e);
        setIsValid(false);
        setIsLoading(false);
      }
    };
    getEventInfo();
  }, [secretKey]);

  useEffect(() => {
    const getTokenTicker = async () => {
      if (dropInfo) {
        const factoryAccount = dropInfo?.asset_data[1].config.root_account_id;
        const tokenInfo = await keypomInstance.viewCall({
          contractId: factoryAccount,
          methodName: 'ft_metadata',
          args: { drop_id: 'foo' },
        });
        console.log('Token Info: ', tokenInfo);
        setTicker(tokenInfo.symbol);
        setTokensToClaim(keypomInstance.yoctoToNear(tokenInfo.minted_per_claim));
      }
    };
    getTokenTicker();
  }, [dropInfo]);
  if (!isValid) {
    return (
      <NotFound404 header="Ticket not found" subheader="Please check your email and try again" />
    );
  }

  switch (curKeyStep) {
    case 1:
      return (
        <TicketQRPage
          eventId={eventId}
          eventInfo={eventInfo}
          funderId={funderId}
          isLoading={isLoading}
          maxKeyUses={maxKeyUses}
          secretKey={secretKey}
          ticketInfo={ticketInfo}
          ticketInfoExtra={ticketInfoExtra}
        />
      );
    case 2:
      return (
        <WelcomePage
          dropInfo={dropInfo}
          eventId={eventId}
          eventInfo={eventInfo}
          funderId={funderId}
          isLoading={isLoading}
          secretKey={secretKey}
          ticker={ticker}
          ticketInfo={ticketInfo}
          ticketInfoExtra={ticketInfoExtra}
          tokensToClaim={tokensToClaim}
        />
      );
    case 3:
      return (
        <InConferenceApp
          dropInfo={dropInfo}
          eventId={eventId}
          eventInfo={eventInfo}
          funderId={funderId}
          isLoading={isLoading}
          secretKey={secretKey}
          ticker={ticker}
          ticketInfo={ticketInfo}
          ticketInfoExtra={ticketInfoExtra}
        />
      );
    default:
      return (
        <NotFound404 header="Invalid ticket" subheader="Please contact the event organizers" />
      );
  }
}
