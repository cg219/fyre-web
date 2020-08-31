const admin = require('firebase-admin');
const types = {
    STOCK: 'stock',
    CASH: 'cash',
    CRYPTO: 'crypto'
}
const sectors = {
    FINANCIALS: 'financials',
    UTILS: 'utilities',
    DISC: 'consumer discretionary',
    STAPLES: 'consumer staples',
    ENERGY: 'energy',
    HEALTH: 'health',
    INDUSTRIALS: 'industrials',
    TECH: 'technology',
    TELE: 'telecom',
    MATS: 'materials',
    ESTATE: 'real estate',
    OTHER: 'other',
    NONE: 'none'
}

module.exports = async (req, res) => {
    const name = req.body.name;
    const type = req.body.type && req.body.type.toUpperCase();
    const code = req.body.code;
    const cost = req.body.cost;
    const amount = req.body.amount;
    const sector = req.body.sector && req.body.sector.toUpperCase();
    const accountID = req.body.account;

    const db = admin.firestore();

    res.set('Content-Type', 'application/json');

    if (req.method == 'POST') {
        if (!name || !type || !code || !cost || !amount || !sector || !accountID) return res.status(406).send({ error: 'Missing Parameters'});
        if (!types[type]) return res.status(406).send({ error: 'Invalid Type'});
        if (!sectors[sector]) return res.status(406).send({ error: 'Invalid Sector'});

        const accountRef  = db.doc(`accounts/${accountID}`);
        const account = await accountRef.get();

        if (!account.exists) return res.status(406).send({ error: 'Invalid Account ID'});
        const asset = { name, code, cost, amount, account: accountRef, sector: sectors[sector], type: types[type] };
        console.log(asset);
        const assetRef = await db.collection('assets').add(asset);

        return res.send({
            data: { id: assetRef.id }
        });
    }

    if (req.method == 'GET') {
        if (req.query.id) {
            const assetRef = await db.doc(`assets/${req.query.id}`).get();
            const asset = assetRef.data();
            const accountRef = await asset.account.get();

            return res.send({ data: { ...asset, id: assetRef.id, account: accountRef.id }})
        } else {
            const accounts = await db.collection('assets').get();
            const data = [];
            let i = 0;
            const len = accounts.size;

            for (i; i < len; i++) {
                const snap = accounts.docs[i];
                const asset = snap.data();
                const accountRef = await asset.account.get();

                data.push({ ...asset, id: snap.id, account: accountRef.id })
            }

            return res.send({ data });
        }
    }

    if (req.method == 'PUT') {
        const id = req.body.id;
        const data = {};

        if (!id) return res.status(406).send({ error: 'ID missing'});

        if (amount) data.amount = amount;
        if (cost) data.cost = cost;

        await db.doc(`assets/${id}`).update(data);

        return res.send(200)
    }

    if (req.method == 'DELETE') {
        const id = req.body.id;

        if (!id) return res.status(406).send({ error: 'ID missing'});

        await db.doc(`assets/${id}`).delete();
        return res.send(200)
    }
}
