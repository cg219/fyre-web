const admin = require('firebase-admin');

module.exports = async (change, context) => {
    const after = change.after.exists && change.after.data();
    const before = change.before.exists && change.before.data();
    const id = context.params.id;

    console.log('After: ', after);
    console.log('Before: ', before);

    if (after && !before) {
        return await after.account.collection('assets').doc(change.after.id).set({ asset: change.after.ref });
    }

    if (before && !after) {
        return await before.account.collection('assets').doc(change.before.id).delete();
    }

    if (before.account.id !== after.account.id) {
        await before.account.collection('assets').doc(change.before.id).delete();
        await after.account.collection('assets').doc(change.after.id).set({ asset: change.after.ref });
    }
}
