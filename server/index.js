import functions from 'firebase-functions';
import admin from 'firebase-admin';
import serviceAccount from './private/server-fyre.js';
import userCallable from './services/users/callable.js';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://server-fyre.firebaseio.com'
});

export const getUser = functions.https.onCall(userCallable);
