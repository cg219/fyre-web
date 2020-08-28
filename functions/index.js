const functions = require('firebase-functions');
const admin = require("firebase-admin");
// const fs = require("fs");
// const auth = JSON.parse(fs.readFileSync('./../private/service.json'));

// admin.initializeApp({ credential: admin.credential.cert(auth) });
admin.initializeApp();

exports.stocks = functions.https.onRequest(require('./services/stocks'));
exports.cryptos = functions.https.onRequest(require('./services/cryptos'));
exports.stocks_cron = functions.pubsub.schedule("* 9-16 * * 1-5").onRun(require("./crons/stocks"));
exports.cryptos_cron = functions.pubsub.schedule("* * * * *").onRun(require("./crons/cryptos"));
