import admin from 'firebase-admin';
import { logger } from 'firebase-functions';

export default async function(data, context) {
    let user = await admin.firestore().doc(`users/${context.auth.uid}`).get();

    if (user.exists) return { ...user.data(), id: user.id }

    await admin.firestore().doc(`users/${context.auth.uid}`).set({
        created: admin.firestore.Timestamp.now()
    }, { merge: true });

    let newUser = await admin.firestore().doc(`users/${context.auth.uid}`).get();

    return { ...newUser.data(), id: newUser.id };
}
