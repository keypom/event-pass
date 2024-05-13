import {
  type AccountState,
  type NetworkId,
  setupWalletSelector,
  type WalletSelector,
} from '@near-wallet-selector/core';
import { setupModal, type WalletSelectorModal } from '@near-wallet-selector/modal-ui';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';
// import { setupHereWallet } from '@near-wallet-selector/here-wallet';
// import { setupSender } from '@near-wallet-selector/sender';
// import { setupNightly } from '@near-wallet-selector/nightly';
// import { setupNearSnap } from "@near-wallet-selector/near-snap";

import { setupOneClickConnect } from '@keypom/one-click-connect';

import getConfig from '@/config/config';

const NETWORK_ID = process.env.REACT_APP_NETWORK_ID ?? 'testnet';

const config = getConfig();

export class NearWalletSelector {
  public accounts: AccountState[];
  public selector: WalletSelector;
  public modal: WalletSelectorModal;

  async init(): Promise<void> {
    const _selector = await setupWalletSelector({
      network: NETWORK_ID as NetworkId,
      debug: true,
      modules: [
        setupMeteorWallet(),
        // setupNightly(),
        // setupNearSnap(),
        // setupSender(),
        setupMyNearWallet(),
        setupOneClickConnect({
          networkId: NETWORK_ID as NetworkId,
          urlPattern: '#instant-url/:accountId/:secretKey/:walletId',
        }),
        // setupHereWallet(),
      ],
    });
    const _modal = setupModal(_selector, {
      contractId: config.contractId,
      theme: 'light',
      methodNames: ['add_message'],
    });
    const state = _selector.store.getState();

    this.accounts = state.accounts;
    this.modal = _modal;
    this.selector = _selector;
  }
}
