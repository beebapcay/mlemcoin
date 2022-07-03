// noinspection ES6PreferShortImport

/**
 * Remove old files, copy front-end ones.
 */

import logger from 'jet-logger';
import { ExecUtil } from '../../blockchain-node/src/shared/utils/exec.util'; // longer path, but works
import { FileUtil } from '../../blockchain-node/src/shared/utils/file.util'; // longer path, but works

(async () => {
    try {
        // Remove current build
        await FileUtil.remove('./dist/');
        // Copy production env file
        await FileUtil.copy('./src/shared/pre-start/env/production.env', './dist/shared/pre-start/env/production.env');
        // Copy back-end files
        await ExecUtil.exec('tsc --build tsconfig.prod.json', './');
    } catch (err) {
        logger.err(err);
    }
})();

