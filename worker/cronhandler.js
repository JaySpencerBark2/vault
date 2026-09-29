const cron = require('cron');





const heartbeatJob = new cron.CronJob('*/5 * * * *', () => {
  console.log('Heartbeat job running every 5 minutes');
});



