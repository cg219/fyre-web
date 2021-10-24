import admin from 'firebase-admin';
import { https } from 'firebase-functions';
const HttpsError = https.HttpsError;

export const getUser = async function(data, context) {
    let user = await admin.firestore().doc(`users/${context.auth.uid}`).get();

    if (user.exists) return { ...user.data(), id: user.id }

    throw new HttpsError('not-found', 'User not found');
}

export const createUser = async function(data, context) {
    let user = await admin.firestore().doc(`users/${context.auth.uid}`).get();

    if (user.exists) throw new HttpsError('already-exists', 'User already exists');

    await admin.firestore().doc(`users/${context.auth.uid}`).set({
        created: admin.firestore.Timestamp.now()
    }, { merge: true });

    let newUser = await admin.firestore().doc(`users/${context.auth.uid}`).get();

    return { ...newUser.data(), id: newUser.id };
}
