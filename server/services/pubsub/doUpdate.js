const { refine } = require('./../../helpers');
const { vow } = require('batboy.mente');
const { get } = require('courier.mente');
const admin = require("firebase-admin");
const database = admin.database();
const lookup = {
    stocks: (value) => `https://ycharts.com/companies/${value.toUpperCase()}`,
    cryptos: (value) => `https://coinmarketcap.com/currencies/${value.toLowerCase()}/`
}

module.exports = async (message, context) => {
    if (!message) return console.error('Message is missing');

    const { type } = JSON.parse(Buffer.from(message.data, 'base64').toString());
    const url = lookup[type];

    if (!url) return console.error(`Type sent doesn't exist`);

    const [snapshot, snapshotError] = await vow(database.ref(type).once('value'));

    if (snapshotError) return console.error('Error retreiving data from Firebase');

    const codes = Object.keys(snapshot.val());
    const saves = codes.map(async code => {
        const options = {
            headers: {
                'Content-Type': 'text/html'
            },
            responseType: 'html'
        };

        const [data, dataError] = await vow(get(url(code), options));

        if (dataError) {
            console.error('Error Loading data');
            return Promise.reject();
        }

        const price = refine(data, type);
        const [save, saveError] = await vow(database.ref(`${type}/${code}`).set(price));

        return true;
    })

    const saveAll = await Promise.all(saves);

    return true;
}

// pubsub({ "data": "eyAidHlwZSI6ICJjcnlwdG9zIiB9" })
