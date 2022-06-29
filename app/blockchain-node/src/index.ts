import { nodeProcessServer } from '@node-process/index';
import '@shared/pre-start';
import logger from 'jet-logger';

/***********************************************************************************
 *                         Start node process server
 **********************************************************************************/

const nodeProcessPort = process.env.NODE_PROCESS_PORT || 3000;

nodeProcessServer.listen(nodeProcessPort, () => {
  logger.info(`Blockchain node server started on port: ${nodeProcessPort}`);
});

