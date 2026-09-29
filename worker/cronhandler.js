const cron = require('cron');
const ExpirationHelper = require('./classes/ExpirationHelper');

function startExpirationSweepJob() {
  const job = new cron.CronJob('0 * * * *', async () => {
    try {
      let helper = new ExpirationHelper();
      let changed = await helper.sweepExpiredLines();
      console.log(`[ExpirationSweep] ${new Date().toISOString()} - expired ${changed} line(s)`);
    } catch (e) {
      console.error('[ExpirationSweep] failed:', e);
    }
  });

  job.start();
  return job;
}

module.exports = { startExpirationSweepJob };
