import * as CryptoJS from 'crypto-js';
import * as ecdsa from 'elliptic';
import { StringUtil } from './string.util';

const ec = new ecdsa.ec('secp256k1');

export class EncryptUtil {
  public static calculateHash(...args: any[]): string {
    const stringArgs = args.map((arg) => arg?.toString() ?? '').join('');
    return CryptoJS.SHA256(CryptoJS.SHA256(stringArgs)).toString();
  }

  public static calculateHashFromObject<T>(obj: T, excluded: string[] = []): string {
    const stringArgs = Object.keys(obj)
      .filter((key) => !excluded.includes(key))
      .map((key) => obj[key]?.toString() ?? '')
      .join('');
    return CryptoJS.SHA256(CryptoJS.SHA256(stringArgs)).toString();
  }

  public static getKeyPairFromPublicKey(publicKey: string): ecdsa.ec.KeyPair {
    return ec.keyFromPublic(publicKey, 'hex');
  }

  public static getKeyPairFromPrivateKey(privateKey: string): ecdsa.ec.KeyPair {
    return ec.keyFromPrivate(privateKey, 'hex');
  }

  public static verifySignature(publicKey: string, data: string, signature: string): boolean {
    const key = ec.keyFromPublic(publicKey, 'hex');
    return key.verify(data, signature);
  }

  public static signSignature(privateKey: string, data: string): string {
    const key = ec.keyFromPrivate(privateKey, 'hex');
    return StringUtil.byteArrayToHexString(key.sign(data).toDER());
  }

  public static getPublicKey(privateKey: string): string {
    const key = ec.keyFromPrivate(privateKey, 'hex');
    return key.getPublic('hex');
  }

  public static generatePrivateKey(): string {
    return ec.genKeyPair().getPrivate().toString(16);
  }
}
