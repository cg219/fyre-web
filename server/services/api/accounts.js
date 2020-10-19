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

        const account = await firestore.collection('accounts').add({ name, type: type.toLowerCase() });
        const data = await account.get();

        return res.send({ data: { ...data.data(), id: account.id } });
    }

    if (req.method == 'GET') {
        const full = !!req.query.full;
        let assets;
        let data;

        if (req.query.id) {
            const account = await firestore.doc(`accounts/${req.query.id}`).get();
            data = { ...account.data(), id: account.id }


            if (full) {
                const ref = await account.ref.collection('assets').get();
                const promises = [];

                ref.forEach(assetRef => promises.push(assetRef.data().asset.get()));

                assets = await Promise.all(promises);
                assets = assets.map(asset => {
                    const { account, ...result } = asset.data();
                    return result;
                });

                data = { ...data, assets }
            }

            return res.send({ data })
        } else {
            const accounts = await firestore.collection('accounts').get();

            data = [];

            for (const account of accounts.docs) {
                if (!full) {
                    data.push({ ...account.data(), id: account.id })
                } else {
                    const ref = await account.ref.collection('assets').get();

                    if (!ref.empty) {
                        const promises = [];
                        let rawAccount = { ...account.data(), id: account.id };

                        ref.forEach(assetRef => promises.push(assetRef.data().asset.get()));

                        assets = await Promise.all(promises);
                        assets = assets.map(asset => {
                            const { account, ...result } = asset.data();
                            return result;
                        });

                        rawAccount

                        data.push({ ...rawAccount, assets });
                    } else {
                        data.push({ ...account.data(), id: account.id });
                    }
                }
            }

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

        await firestore.doc(`accounts/${id}`).update(data);
        return res.send(200)
    }

    if (req.method == 'DELETE') {
        const id = req.body.id;

        if (!id) return res.status(406).send({ error: 'ID missing'});

        await firestore.doc(`accounts/${id}`).delete();
        return res.send(200)
    }

    return res.status(500).send({ error: 'Something Went Wrong' });
}
