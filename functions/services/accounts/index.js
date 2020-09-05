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
    const db = admin.firestore();

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

        const account = await db.collection('accounts').add({ name, type: type.toLowerCase(), assets: [] });
        const data = await account.get();

        return res.send({
            data: { ...data.data(), id: account.id }
        });
    }

    if (req.method == 'GET') {
        if (req.query.id) {
            const account = await db.doc(`accounts/${req.query.id}`).get();

            return res.send({ data: { ...account.data(), id: account.id }})
        } else {
            const accounts = await db.collection('accounts').get();
            const data = [];

            accounts.forEach(account => data.push({ ...account.data(), id: account.id }));

            return res.send({ data });
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

        await db.doc(`accounts/${id}`).update(data);

        return res.send(200)
    }

    if (req.method == 'DELETE') {
        const id = req.body.id;

        if (!id) return res.status(406).send({ error: 'ID missing'});

        await db.doc(`accounts/${id}`).delete();
        return res.send(200)
    }

    return res.status(500).send({ error: 'Something Went Wrong' });
}
