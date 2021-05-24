const admin = require('firebase-admin');
const { checkParam } = require('./../../helpers');
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

function checkSectors(sector) {
    return Object.values(sectors).includes(sector);
}

function checkTypes(type) {
    return Object.values(types).includes(type);
}

module.exports = async (req, res) => {
    const name = checkParam(req, 'name');
    const type = checkParam(req, 'type');
    const code = checkParam(req, 'code');
    const cost = checkParam(req, 'cost');
    const amount = checkParam(req, 'amount');
    const sector = checkParam(req, 'sector');
    const accountID = checkParam(req, 'account');
    const firestore = admin.firestore();

    res.set('Content-Type', 'application/json');
    res.set('Access-Control-Allow-Origin', '*');

    if (req.method == 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', '*');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        return res.send();
    }

    if (req.method == 'POST') {
        if (!name || !type || !code || !cost || !amount || !sector || !accountID) return res.status(406).send({ error: 'Missing Parameters'});
        if (!checkTypes(type.toLowerCase())) return res.status(406).send({ error: 'Invalid Type'});
        if (!checkSectors(sector.toLowerCase())) return res.status(406).send({ error: 'Invalid Sector'});

        const ref = firestore.doc(`accounts/${accountID}`);
        const snap = await ref.get();

        if (!snap.exists) return res.status(406).send({ error: 'Invalid Account ID'});
        const account = snap.data();
        const asset = { name, code, cost, amount, sector, type };

        account.assets[code.toLowerCase()] = asset;
        await ref.set(account, { merge: true });
        return res.send({ success: true, data: { ...asset, accountID: snap.id }});
    }

    if (req.method == 'GET') {
        if (code) {
            if (!accountID) return res.status(406).send({ error: 'Missing Account ID'});

            const ref = firestore.doc(`accounts/${accountID}`);
            const snap = await ref.get();

            if (!snap.exists) return res.send({ success: false, code: 'api/not-found' });

            const data = snap.data();
            const asset = data.assets[code.toLowerCase()];

            if (!asset) return res.send({ success: false, code: 'api/not-found' });

            return res.send({ success: true, data: { ...asset, account: accountID }});
        } else {
            if (!accountID) return res.status(406).send({ error: 'Missing Account ID'});

            const ref = firestore.doc(`accounts/${accountID}`);
            const snap = await ref.get();

            if (!snap.exists) return res.send({ success: false, code: 'api/not-found' });

            const data = snap.data();

            return res.send({ success: true, data: { assets: data.assets, account: accountID } });
        }
    }

    if (req.method == 'PUT') {
        if (!code || !accountID) return res.status(406).send({ error: 'Missing Parameters'});

        const update = {};

        if (amount) update.amount = amount;
        if (cost) update.cost = cost;

        const ref = firestore.doc(`accounts/${accountID}`);
        const snap = await ref.get();

        if (!snap.exists) return res.send({ success: false, code: 'api/not-found' });

        const data = snap.data();
        const asset = data.assets[code.toLowerCase()];

        if (!asset) return res.send({ success: false, code: 'api/not-found' });

        const updatedAsset = {...asset, ...update};
        const newData = { ...data, assets: {...data.assets, [code.toLowerCase()]: updatedAsset } }

        await firestore.doc(`accounts/${accountID}`).update(newData);
        return res.send({ success: true, data: { ...updatedAsset, account: accountID }});
    }

    if (req.method == 'DELETE') {
        if (!code || !accountID) return res.status(406).send({ error: 'Missing Parameters'});

        const ref = firestore.doc(`accounts/${accountID}`);
        const snap = await ref.get();

        if (!snap.exists) return res.send({ success: false, code: 'api/not-found' });

        const data = snap.data();
        const asset = data.assets[code.toLowerCase()];

        if (!asset) return res.send({ success: false, code: 'api/not-found' });

        const { [code.toLowerCase()]: deleted, ...updatedAssets } = data.assets;
        const newData = { ...data, assets: updatedAssets }

        await firestore.doc(`accounts/${accountID}`).update(newData);
        return res.send({ success: true })
    }
}
