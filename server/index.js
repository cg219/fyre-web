const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('./private/server-fyre.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://server-fyre.firebaseio.com'
});

exports.auth = functions.https.onRequest(require('./services/auth'));
exports.watchAccount = functions.firestore.document('assets/{id}').onWrite(require('./services/triggers/accounts'));
exports.doUpdate = functions.pubsub.topic('do-update').onPublish(require('./services/pubsub/doUpdate'));
