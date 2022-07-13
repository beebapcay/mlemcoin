export class ConfigurationConstants {
  public static readonly COINBASE_AMOUNT = 50;

  public static readonly TIMESTAMP_VALIDATION_FROM_PREVIOUS_BLOCKS = 0; // seconds
  public static readonly TIMESTAMP_VALIDATION_FROM_NOW = 0; // seconds

  public static readonly BLOCK_GENERATION_INTERVAL: number = 10; // seconds
  public static readonly DIFFICULTY_ADJUSTMENT_INTERVAL: number = 10; // blocks

  public static readonly PRIVATE_KEY_LOCATION = 'src/node-process/repos/database/private_key'; // private key for wallet to sign transactions

  public static readonly CREATOR_AWARD_AMOUNT = 1_000_000; // 1 million coins

  // noinspection SpellCheckingInspection
  public static readonly CREATOR_ADDRESS = '047c4e81547686cbb550ff3b338425b5db29bf89316ce0d0941a711b1b610e97e9824363a736c2e7f14c9b4253e74d9adf03621f93528a146a1cb97084a561cd67';

  public static readonly CREATOR_PRIVATE = 'b15a03d0a0b1d117ae1ffc1a6b0dc3197ee39e5b45bf33c3f3754780d703e49f';
}
