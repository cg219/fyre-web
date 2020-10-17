const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const cheerio = require("cheerio");
const firestore = admin.firestore();
const database = admin.database();
const api = axios.create({ baseURL: "https://coinmarketcap.com/currencies/" });

module.exports = async (req, res) => {
    try {
        const symbol = req.query.symbol.toUpperCase();
        const ref = await firestore.doc(`cryptos/${symbol}`).get();
        let response = { data: { symbol } };

        if (ref.exists) {
            const stock = ref.data();

            response.data = { ...response.data, price: stock.value }
        } else {
            const { data } = await api.get(`${symbol.toLowerCase()}`);
            const c = cheerio.load(data);
            let unrefinedPrice = c(".cmc-details-panel-price__price").text();

            console.log(unrefinedPrice)
            let priceCheck = /\D?([0-9\.\,]+)/
            let refinedPrice = unrefinedPrice.replace(priceCheck, "$1").replace(",", "");

            response.data = { ...response.data, price: Number(refinedPrice) };

            await firestore.doc(`cryptos/${symbol}`).set({ value: Number(refinedPrice) });
        }

        res.send(response);
    } catch (error) {
        res.status(404).send({ error });
    }
}
