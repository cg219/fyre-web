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

const isValidType = type => Object.keys(types).find(key => types[key] === type) !== undefined;

module.exports = async (req, res) => {
    const name = req.body.name;
    const type = req.body.type;
    const db = admin.firestore();

    res.set('Content-Type', 'application/json');

    if (req.method == 'POST') {
        if (!name || !type) return res.status(406).send({ error: 'Name or Type missing'});
        if (!isValidType(type)) return res.status(406).send({ error: 'Invalid Type'});

        const account = await db.collection('accounts').add({ name, type: type.toLowerCase(), assets: [] });

        return res.send({
            data: { id: account.id }
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
            if (!isValidType(type)) return res.status(406).send({ error: 'Invalid Type'});
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
}
