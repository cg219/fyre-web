const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const cheerio = require("cheerio");
const firestore = admin.firestore();
const database = admin.database();
const api = axios.create({ baseURL: "https://ycharts.com/companies/" });

module.exports = async (req, res) => {
    try {

        const symbol = req.query.symbol.toUpperCase();
        const ref = await firestore.doc(`stocks/${symbol}`).get();
        let response = { data: { symbol } };

        if (ref.exists) {
            const stock = ref.data();

            response.data = { ...response.data, price: stock.value }
        } else {
            const { data } = await api.get(`${symbol}`);
            const c = cheerio.load(data);
            let unrefinedPrice = c(".quoteData").find(".upDn").text();
            let priceCheck = /([0-9\.\,]+)/
            let refinedPrice = unrefinedPrice.replace(priceCheck, "$1").replace(",", "");

            response.data = { ...response.data, price: Number(refinedPrice) };

            await firestore.doc(`stocks/${symbol}`).set({ value: Number(refinedPrice) });
        }

        res.send(response);
    } catch (error) {
        res.status(404).send({ error });
    }
}
