export class ConfigurationConstants {
  public static readonly COINBASE_AMOUNT = 50;

  public static readonly TIMESTAMP_VALIDATION_FROM_PREVIOUS_BLOCKS = 0; // seconds
  public static readonly TIMESTAMP_VALIDATION_FROM_NOW = 0; // seconds

  public static readonly BLOCK_GENERATION_INTERVAL: number = 10; // seconds
  public static readonly DIFFICULTY_ADJUSTMENT_INTERVAL: number = 10; // blocks

  public static readonly PRIVATE_KEY_LOCATION = 'src/node-process/repos/database/private_key'; // private key for wallet to sign transactions


  public static readonly CREATOR_AWARD_AMOUNT = 1_000_000; // 1 million coins

  // noinspection SpellCheckingInspection
  public static readonly CREATOR_ADDRESS = '04bfcab8722991ae774db48f934ca79cfb7dd991229153b9f732ba5334aafcd8e7266e47076996b55a14bf9913ee3145ce0cfc1372ada8ada74bd287450313534a';
}
