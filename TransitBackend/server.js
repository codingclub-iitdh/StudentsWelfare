require('dotenv').config();

const { getConfig, validateConfig } = require('./src/config');
const { createPool } = require('./src/db/pool');
const { createMailer } = require('./src/email');
const { createApp } = require('./src/app');

async function start() {
  const config = getConfig();
  validateConfig(config);
  const pool = createPool(config);
  const mailer = createMailer(config);

  try {
    await pool.query('SELECT 1');
    const app = createApp({ pool, config, mailer });
    const server = app.listen(config.port, () => {
      console.info(`Transit backend listening on port ${config.port}`);
    });

    const shutdown = (signal) => {
      console.info(`${signal} received; shutting down.`);
      server.close(async (error) => {
        if (error) {
          console.error('HTTP server shutdown failed:', error.message);
          process.exitCode = 1;
        }
        await pool.end();
      });
    };
    process.once('SIGINT', () => shutdown('SIGINT'));
    process.once('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    await pool.end();
    throw error;
  }
}

start().catch((error) => {
  console.error('Transit backend failed to start:', error.message);
  process.exitCode = 1;
});
