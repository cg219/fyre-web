const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const cheerio = require("cheerio");
const firestore = admin.firestore();
const database = admin.adatabase();
const api = axios.create({ baseURL: "https://ycharts.com/companies/" });

module.exports = async context => {
    try {
        const stocks = await firestore.collection("stocks").get();

        stocks.forEach(async stock => {
            const { data } = await api.get(`${stock.id}`);
            const c = cheerio.load(data);
            let unrefinedPrice = c(".quoteData").find(".upDn").text();
            let priceCheck = /([0-9\.\,]+)/
            let refinedPrice = unrefinedPrice.replace(priceCheck, "$1").replace(",", "");

            await firestore.doc(`stocks/${stock.id}`).set({ value: Number(refinedPrice) });
        });
    } catch (error) {
        console.error(error);
    }
}
