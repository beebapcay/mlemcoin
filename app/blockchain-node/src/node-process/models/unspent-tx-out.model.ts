import { ObjectUtil } from '@shared/utils/object.util';
import { Transaction } from './transaction.model';
import { TxIn } from './tx-in.model';

export interface IUnspentTxOut {
  txOutId: string;
  txOutIndex: number;
  address: string;
  amount: number;
}

export class UnspentTxOut extends ObjectUtil.autoImplement<IUnspentTxOut>() {
  constructor(unspentTxOutShape: IUnspentTxOut) {
    super();
    this.txOutId = unspentTxOutShape.txOutId;
    this.txOutIndex = unspentTxOutShape.txOutIndex;
    this.address = unspentTxOutShape.address;
    this.amount = unspentTxOutShape.amount;
  }
}

export class UnspentTxOutUtil {
  /**
   * @description - Gets unspent transaction outputs for a given id and index
   *
   * @param id
   * @param index
   * @param unspentTxOuts
   *
   * @returns UnspentTxOut | undefined
   */
  public static getOne(id: string, index: number, unspentTxOuts: UnspentTxOut[]): UnspentTxOut | undefined {
    return unspentTxOuts.find((uTxO) => uTxO.txOutId === id && uTxO.txOutIndex === index);
  }


  /**
   * @description - Checks if an unspent transaction output exists in the unspent transaction outputs (id and index)
   *
   * @param id
   * @param index
   * @param unspentTxOuts
   *
   * @returns boolean
   */
  public static exists(id: string, index: number, unspentTxOuts: UnspentTxOut[]): boolean {
    return !!UnspentTxOutUtil.getOne(id, index, unspentTxOuts);
  }

  /**
   * @description - Gets unspent transaction outputs for a given address
   *
   * @param address
   * @param unspentTxOuts
   *
   * @returns UnspentTxOut[]
   */
  public static getUnspentTxOuts(address: string, unspentTxOuts: UnspentTxOut[]): UnspentTxOut[] {
    return unspentTxOuts.filter(unspentTxOut => unspentTxOut.address === address);
  }

  /**
   * @description - Checks txIn reference txOut is in the unspent transaction outputs
   *
   * @param txIn
   * @param unspentTxOuts
   *
   * @returns boolean
   */
  public static hasTxIn(txIn: TxIn, unspentTxOuts: UnspentTxOut[]): boolean {
    return UnspentTxOutUtil.exists(txIn.txOutId, txIn.txOutIndex, unspentTxOuts);
  }

  /**
   * @description - Updates unspent transaction outputs with new transactions
   *
   * @param newTransactions
   * @param aUnspentTxOut
   *
   * @returns UnspentTxOut[]
   */
  public static update(newTransactions: Transaction[], aUnspentTxOut: UnspentTxOut[]): UnspentTxOut[] {
    const newUnspentTxOuts = newTransactions
      .map((t) => {
        return t.txOuts.map((txOut, index) => new UnspentTxOut({
          txOutId: t.id,
          txOutIndex: index,
          address: txOut.address,
          amount: txOut.amount
        }));
      })
      .reduce((a, b) => a.concat(b), [] as UnspentTxOut[]);

    const consumedTxOuts = newTransactions
      .map((t) => t.txIns)
      .reduce((a, b) => a.concat(b), [])
      .map((txIn) => new UnspentTxOut({ txOutId: txIn.txOutId, txOutIndex: txIn.txOutIndex, address: '', amount: 0 }));

    return aUnspentTxOut
      .filter((uTxO) => !UnspentTxOutUtil.exists(uTxO.txOutId, uTxO.txOutIndex, consumedTxOuts))
      .concat(newUnspentTxOuts);
  }

  /**
   * @description - Transforms unspent transaction outputs to a transaction input
   *
   * @param unspentTxOut
   *
   * @returns TxIn
   */
  public static toUnsignedTxIn(unspentTxOut: UnspentTxOut): TxIn {
    return new TxIn({
      txOutId: unspentTxOut.txOutId,
      txOutIndex: unspentTxOut.txOutIndex,
      txOutAddress: unspentTxOut.address,
      signature: ''
    });
  }
}