import keypomInstance from '@/lib/keypom';

export const getDynamicHeightPercentage = (vh: number, thresholds: number[], values: number[]) => {
  if (vh > thresholds[0]) return values[0];
  if (vh > thresholds[1]) {
    const range = thresholds[0] - thresholds[1];
    const diff = vh - thresholds[1];
    const ratio = diff / range;
    return values[1] + ratio * (values[0] - values[1]);
  }
  if (vh > thresholds[2]) {
    const range = thresholds[1] - thresholds[2];
    const diff = vh - thresholds[2];
    const ratio = diff / range;
    return values[2] + ratio * (values[1] - values[2]);
  }
  return values[2];
};

export const claimEventDrop = async ({
  factoryAccount,
  qrDataSplit,
  accountId,
  setScanStatus,
  setStatusMessage,
  secretKey,
}) => {
  const dropId = qrDataSplit[1];
  let scavId;
  if (qrDataSplit.length > 2) {
    scavId = qrDataSplit[2];
  }

  console.log('Factory', factoryAccount);
  console.log('Account: ', accountId);

  const claimedDropInfo = await keypomInstance.viewCall({
    contractId: factoryAccount,
    methodName: 'get_drop_information',
    args: { drop_id: dropId },
  });
  console.log('claimed drop info: ', claimedDropInfo);
  const claimsForAccount: string[] = await keypomInstance.viewCall({
    contractId: factoryAccount,
    methodName: 'claims_for_account',
    args: { account_id: accountId, drop_id: dropId },
  });
  console.log('claims for account: ', claimsForAccount);

  // If it's a scavenger hunt, the scavID will be in the claims for account when claimed
  // If it's a regular drop, when claiming, the drop ID will be in the list as well
  // So all we need to check is if the scavenger ID is in the list (since it defaults to the drop ID)
  if (claimsForAccount.includes(scavId || dropId)) {
    setScanStatus('error');
    setStatusMessage('You already scanned this drop');
    return {
      alreadyClaimed: true,
    };
  }

  await keypomInstance.claimEventTokenDrop({
    secretKey,
    accountId,
    dropId,
    scavId,
    factoryAccount,
  });

  return {
    alreadyClaimed: false,
    isScavenger: scavId !== undefined,
    numFound: claimsForAccount.length + 1,
    numRequired: claimedDropInfo?.scavenger_ids?.length || 0,
    image: claimedDropInfo?.image,
    name: claimedDropInfo?.name,
    amount: claimedDropInfo?.amount,
  };
};
