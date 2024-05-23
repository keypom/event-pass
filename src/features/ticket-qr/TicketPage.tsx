import { useEffect, useState } from 'react';
import { getPubFromSecret } from 'keypom-js';
import { useNavigate } from 'react-router-dom';

import { useTicketClaimParams } from '@/hooks/useTicketClaimParams';
import { NotFound404 } from '@/components/NotFound404';
import keypomInstance from '@/lib/keypom';
import {
  type FunderEventMetadata,
  type TicketInfoMetadata,
  type TicketMetadataExtra,
  defaultEventInfo,
  defaultTicketInfo,
  defaultTicketInfoExtra,
} from '@/lib/eventsHelpers';

import TicketQRPage from './TicketQRPage';

export default function TicketPage() {
  const { secretKey } = useTicketClaimParams();
  const navigate = useNavigate();

  // State variables for managing the ticket and event information
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [eventInfo, setEventInfo] = useState<FunderEventMetadata>(defaultEventInfo);
  const [ticketInfo, setTicketInfo] = useState<TicketInfoMetadata>(defaultTicketInfo);
  const [ticketInfoExtra, setTicketInfoExtra] =
    useState<TicketMetadataExtra>(defaultTicketInfoExtra);

  const [eventId, setEventId] = useState('');
  const [funderId, setFunderId] = useState('');

  const onScanned = () => {
    window.location.reload();
  };

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

        const maxUses = drop.max_key_uses;
        const curStep = drop.max_key_uses - keyInfo.uses_remaining + 1;

        const ticketMetadata = drop.drop_config.nft_keys_config.token_metadata;
        setTicketInfo(ticketMetadata);
        const ticketExtra = JSON.parse(ticketMetadata.extra);
        setTicketInfoExtra(ticketExtra);

        const eventInfo = await keypomInstance.getEventInfo({
          accountId: drop.funder_id,
          eventId: ticketExtra.eventId,
        });

        if ((maxUses !== 3 && maxUses !== 2) || !eventInfo) {
          console.error('Invalid ticket');
          console.log('maxUses', maxUses);
          console.log('curStep', curStep);
          console.log('eventInfo', eventInfo);
          setIsValid(false);
          setIsLoading(false);
          return;
        }

        const eventId: string = ticketExtra.eventId;
        if (curStep !== 1 || maxUses === 2) {
          navigate(`/conference/app/${eventId}#${secretKey}`);
        }

        setEventInfo(eventInfo);
        setEventId(eventId);
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

  if (!isValid) {
    return (
      <NotFound404 header="Ticket not found" subheader="Please check your email and try again" />
    );
  }

  return (
    <TicketQRPage
      eventId={eventId}
      eventInfo={eventInfo}
      funderId={funderId}
      isLoading={isLoading}
      secretKey={secretKey}
      ticketInfo={ticketInfo}
      ticketInfoExtra={ticketInfoExtra}
      onScanned={onScanned}
    />
  );
}
