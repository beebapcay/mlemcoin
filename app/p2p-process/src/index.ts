import logger from 'jet-logger';
import './pre-start'; // Must be the first import
import server from './server';

// Constants
const serverStartMsg = 'P2P process server started on port: ',
  port = (process.env.PORT || 8082);

// Start server
server.listen(port, () => {
    logger.info(serverStartMsg + port);
});
