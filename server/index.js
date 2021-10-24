import functions from 'firebase-functions';
import admin from 'firebase-admin';
import serviceAccount from './private/server-fyre.js';
import { getUser, createUser } from './services/users/callable.js';
import { getAccount, getAccounts, createAccount } from './services/accounts/callable.js';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://server-fyre.firebaseio.com'
});

export const user = {
    get: functions.https.onCall(getUser),
    create: functions.https.onCall(createUser)
}

export const account = {
    get: functions.https.onCall(getAccount),
    list: functions.https.onCall(getAccounts),
    create: functions.https.onCall(createAccount)
}
