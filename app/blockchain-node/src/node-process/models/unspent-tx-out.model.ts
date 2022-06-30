import { InterfaceUtil } from '@shared/utils/interface.util';
import { Transaction } from './transaction.model';
import { TxIn } from './tx-in.model';

export interface IUnspentTxOut {
  txOutId: string;
  txOutIndex: number;
  address: string;
  amount: number;
}

export class UnspentTxOut extends InterfaceUtil.autoImplement<IUnspentTxOut>() {
  constructor(unspentTxOutShape: IUnspentTxOut) {
    super();
  }
}

export class UnspentTxOutUtil {
  /**
   * @description - Gets unspent transaction outputs for a given id and index
   *
   * @param id
   * @param index
   * @param unspentTxOuts
   */
  public static getOne(id: string, index: number, unspentTxOuts: UnspentTxOut[]): UnspentTxOut | undefined {
    return unspentTxOuts.find((uTxO) => uTxO.txOutId === id && uTxO.txOutIndex === index);
  }


  /**
   * @description - Check if an unspent transaction output exists in the unspent transaction outputs
   *
   * @param id
   * @param index
   * @param unspentTxOuts
   */
  public static exists(id: string, index: number, unspentTxOuts: UnspentTxOut[]): boolean {
    return !!UnspentTxOutUtil.getOne(id, index, unspentTxOuts);
  }

  /**
   * @description - Get unspent transaction outputs for a given address
   *
   * @param address
   * @param unspentTxOuts
   */
  public static getUnspentTxOuts(address: string, unspentTxOuts: UnspentTxOut[]): UnspentTxOut[] {
    return unspentTxOuts.filter(unspentTxOut => unspentTxOut.address === address);
  }

  /**
   * @description - Check txIn reference txOut is in the unspent transaction outputs
   *
   * @param txIn
   * @param unspentTxOuts
   */
  public static hasTxIn(txIn: TxIn, unspentTxOuts: UnspentTxOut[]): boolean {
    return UnspentTxOutUtil.exists(txIn.txOutId, txIn.txOutIndex, unspentTxOuts);
  }

  /**
   * @description - Update unspent transaction outputs with new transactions
   *
   * @param newTransactions
   * @param aUnspentTxOut
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
   * @description - Transform unspent transaction outputs to a transaction input
   *
   * @param unspentTxOut
   */
  public static toUnsignedTxIn(unspentTxOut: UnspentTxOut): TxIn {
    return new TxIn({ txOutId: unspentTxOut.txOutId, txOutIndex: unspentTxOut.txOutIndex, signature: '' });
  }
}