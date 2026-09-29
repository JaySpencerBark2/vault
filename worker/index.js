const { startExpirationSweepJob } = require('./cronhandler');

console.log('Vault expiration worker starting...');
startExpirationSweepJob();
