import { nodeProcessServer } from '@node-process/index';
import { ServerInit } from '@p2p-process/connection/server.init';
import '@shared/pre-start';
import logger from 'jet-logger';

/***********************************************************************************
 *                         Start node process server
 **********************************************************************************/

const nodeProcessPort: number = parseInt(process.env.NODE_PROCESS_PORT ?? '3000');

nodeProcessServer.listen(nodeProcessPort, () => {
  logger.info(`Blockchain node server started on port: ${nodeProcessPort}`);
});

const p2pProcessPort = parseInt(process.env.P2P_PROCESS_PORT ?? '4000');

ServerInit.init(p2pProcessPort);

