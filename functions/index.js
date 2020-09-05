const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fs = require('fs');
const serviceAccount = require('./private/server-fyre.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://server-fyre.firebaseio.com'
});

exports.stocks = functions.https.onRequest(require('./services/api/stocks'));
exports.cryptos = functions.https.onRequest(require('./services/api/cryptos'));
exports.signup = functions.https.onRequest(require('./services/auth/signup'));
exports.login = functions.https.onRequest(require('./services/auth/login'));
exports.accounts = functions.https.onRequest(require('./services/accounts'));
exports.assets = functions.https.onRequest(require('./services/assets'));
exports.update_account = functions.firestore.document('assets/{id}').onWrite(require('./services/accounts/update'));
exports.stocks_cron = functions.pubsub.schedule('* 9-16 * * 1-5').timeZone('America/New_York').onRun(require('./crons/stocks'));
exports.cryptos_cron = functions.pubsub.schedule('* * * * *').onRun(require('./crons/cryptos'));
