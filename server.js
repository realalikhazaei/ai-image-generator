import 'dotenv/config';
import app from './app.js';
import logger from './utils/logger.js';

const port = process.env.PORT || 1234;
const host = process.env.HOST || '127.0.0.1';
app.listen(port, host, () => {
  logger.info(`Starting the server on port ${port}.`);
});
