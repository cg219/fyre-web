const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const cheerio = require("cheerio");
const db = admin.firestore();
const api = axios.create({ baseURL: "https://coinmarketcap.com/currencies/" });

module.exports = async context => {
    try {
        const cryptos = await db.collection("cryptos").get();

        cryptos.forEach(async crypto => {
            const { data } = await api.get(`${crypto.id.toLowerCase()}`);
            const c = cheerio.load(data);
            let unrefinedPrice = c(".cmc-details-panel-price__price").text();
            let priceCheck = /\D?([0-9\.\,]+)/
            let refinedPrice = unrefinedPrice.replace(priceCheck, "$1").replace(",", "");;

            await db.doc(`cryptos/${crypto.id}`).set({ value: Number(refinedPrice) });
        });
        res.send(response);
    } catch (error) {
        res.status(404).send({ error });
    }
}
