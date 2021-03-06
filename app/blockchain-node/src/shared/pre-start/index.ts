/**
 * Pre-start is where we want to place things that must run BEFORE the express server is started.
 * This is useful for environment variables, command-line arguments, and cron-jobs.
 */

import { WalletRepo } from '@node-process/repos/wallet.repo';
import commandLineArgs from 'command-line-args';
import dotenv from 'dotenv';
import path from 'path';

// TODO: Remove previous wallet in development mode.
(async () => {
    // Delete previous wallet
    await WalletRepo.delete();
})();

(() => {
    // Setup command line options
    const options = commandLineArgs([
        {
            name: 'env',
            alias: 'e',
            defaultValue: 'development',
            type: String
        }
    ]);
    // Set the env file
    const resultConfigEnv = dotenv.config({
        path: path.join(__dirname, `env/${options.env}.env`)
    });
    if (resultConfigEnv.error) {
        throw resultConfigEnv.error;
    }
})();
