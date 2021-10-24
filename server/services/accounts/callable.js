import admin from 'firebase-admin';
import { https } from 'firebase-functions';
const HttpsError = https.HttpsError;

const types = [
    'DIGITAL',
    'BANK',
    'BROKERAGE',
    'REAL_ESTATE',
    'LENDER'
]

const categories = [
    'RETIREMENT',
    'TAXABLE',
    'EXEMPT'
]

const subtypes = [
    'CHECKING',
    'SAVINGS',
    'ROTH_IRA',
    '401K',
    'IRA',
    'DEFAULT'
]

export const getAccounts = async function(data, context) {
    let query = await admin.firestore().doc(`users/${context.auth.uid}/accounts`).get();
    let accounts = [];

    if (query.empty) return accounts;

    query.forEach(function each (snapshot) {
        accounts.push({ id: snapshot.id, data: snapshot.data() });
    })

    return accounts;
}

export const getAccount = async function({ id }, context) {
    let query = await admin.firestore().doc(`users/${context.auth.uid}/accounts/${id}`).get();

    if (query.exists) return query.data();

    return new HttpsError(`Account with id: ${id} not found`);
}

export const createAccount = async function({ type, category, subtype, name }, context) {
    if (!type && !types.includes(type.toUpperCase())) return new HttpsError('invalid-argument', 'Missing or unsupported account type');
    if (!category && !categories.includes(category.toUpperCase())) return new HttpsError('invalid-argument', 'Missing or unsupported account category');
    if (!subtype && !subtypes.includes(subtype.toUpperCase())) return new HttpsError('invalid-argument', 'Missing or unsupported account subtype');
    if (!name) return new HttpsError('invalid-argument', 'Missing account name');

    let account = { type, category, subtype, name, created: admin.firestore.Timestamp.now(), modified: admin.firestore.Timestamp.now(), assets: [] };
    let ref = await admin.firestore().doc(`users/${context.auth.uid}/accounts`).add(account);

    return
}
