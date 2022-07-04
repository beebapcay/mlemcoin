// noinspection DuplicatedCode

import { ObjectUtil } from '../utils/object.util';

export interface IWallet {
  address: string;
  balance: number;
  privateKey: string;
  publicKey: string;
}

export class Wallet extends ObjectUtil.autoImplement<IWallet>() {
  constructor(walletShape: IWallet) {
    super();
    this.address = walletShape.address;
    this.balance = walletShape.balance;
    this.privateKey = walletShape.privateKey;
    this.publicKey = walletShape.publicKey;
  }
}
