const admin = require("firebase-admin");
const database = admin.database();
const { get } = require('courier.mente');
const { vow } = require('batboy.mente');
const { refine } = require('./../../helpers');

module.exports = async (req, res) => {
    if (validate(req)) {
        const ref = database.ref(`cryptos/${req.symbol}`);
        const response = { data: { symbol: req.symbol }}
        const [snapshot, snapshotError] = await vow(ref.once('value'));

        if (snapshotError) {
            //TODO handle error
        }

        if (snapshot.exists()) {
            response.data = { ...response.data, price: snapshot.val() }
            return res.send(response);
        }

        const options = {
            headers: {
                'Content-Type': 'text/html'
            },
            responseType: 'html'
        }
        const [data, dataError] = await vow(get(`https://coinmarketcap.com/currencies/${req.symbol.toLowerCase()}/`, options));

        if (dataError) {
            // TODO handle error
        }

        const price = refine(data, 'cryptos');

        response.data = { ...response.data, price };

        await vow(ref.set(price));

        return res.send(response);
    }

    return res
        .status(200)
        .send({
            success: false,
            error: 'Missing parameters'
        })
}
