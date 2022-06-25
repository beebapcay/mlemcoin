import logger from 'jet-logger';
import './pre-start'; // Must be the first import
import server from './server';

// Constants
const serverStartMsg = 'Blockchain node server started on port: ';
const port = process.env.PORT || 8080;

// Start server
server.listen(port, () => {
  logger.info(serverStartMsg + port);
});
