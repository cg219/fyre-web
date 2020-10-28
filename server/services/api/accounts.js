const admin = require('firebase-admin');
const types = {
    SAVINGS: 'savings',
    CHECKINGS: 'checkings',
    RETIREMENT: 'retirement',
    BROKERAGE: 'brokerage',
    DIGITAL: 'digital',
    LENDER: 'lender',
    PROPERTY: 'property'
}

module.exports = async (req, res) => {
    const name = req.body.name;
    const type = req.body.type;
    const firestore = admin.firestore();

    res.set('Content-Type', 'application/json');
    res.set('Access-Control-Allow-Origin', '*');

    if (req.method == 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', '*');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        return res.send();
    }

    if (req.method == 'POST') {
        if (!name || !type) return res.status(406).send({ error: 'Name or Type missing'});
        if (!types[type.toUpperCase()]) return res.status(406).send({ error: 'Invalid Type'});

        const account = await firestore.collection('accounts').add({ name, type: type.toLowerCase(), assets: {} });
        const snap = await account.get();

        if (snap.exists) {
            return res.send({ success: true, data: { ...snap.data(), id: account.id } });
        }

        return res.send({ success: false, code: 'api/server-error' });
    }

    if (req.method == 'GET') {
        if (req.query.id) {
            const account = await firestore.doc(`accounts/${req.query.id}`).get();
            const response = { success: true };

            if (!account.exists) {
                response.success = false;
                response.code = 'api/not-found';

                return res.send(response)
            }

            response.data = { ...account.data(), id: account.id }

            return res.send(response)
        } else {
            const accounts = await firestore.collection('accounts').get();
            const response = { success: true };

            if (accounts.empty) {
                response.success = false;
                response.code = 'api/not-found';

                return res.send(response)
            }

            response.data = accounts.docs.map(account => {
                return { ...account.data(), id: account.id }
            })

            return res.send(response)
        }
    }

    if (req.method == 'PUT') {
        const id = req.body.id;
        const data = {};

        if (!id) return res.status(406).send({ error: 'ID missing'});
        if (name) data.name = name;
        if (type) {
            data.type = type;
            if (!types[type.toUpperCase()]) return res.status(406).send({ error: 'Invalid Type'});
        }

        await firestore.doc(`accounts/${id}`).update(data);
        return res.send({ success: true })
    }

    if (req.method == 'DELETE') {
        const id = req.body.id;

        if (!id) return res.status(406).send({ error: 'ID missing'});

        await firestore.doc(`accounts/${id}`).delete();
        return res.send({ success: true })
    }

    return res.status(500).send({ error: 'Something Went Wrong' });
}
