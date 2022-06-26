export class ConfigurationConstants {
  public static readonly COINBASE_AMOUNT = 50;

  public static readonly TIMESTAMP_VALIDATION_FROM_PREVIOUS_BLOCKS = 0; // seconds
  public static readonly TIMESTAMP_VALIDATION_FROM_NOW = 0; // seconds

  public static readonly BLOCK_GENERATION_INTERVAL: number = 10; // seconds
  public static readonly DIFFICULTY_ADJUSTMENT_INTERVAL: number = 10; // blocks

  public static readonly PRIVATE_KEY_LOCATION = "src/repos/database/private_key";
}
