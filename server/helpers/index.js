const cheerio = require('cheerio');
const admin = require('firebase-admin');
const { vow } = require('batboy.mente');

const createToken = async uid => {
    const [token, tokenError] = await vow(admin.auth().createCustomToken(uid));

    if (tokenError) {
        console.error(tokenError);
        return null;
    }

    return token;
}

const refine = (data, type) => {
    let refinedPrice;

    if (type === 'stocks') {
        let c = cheerio.load(data);
        let unrefinedPrice = c(".quoteData").find(".upDn").text();
        let priceCheck = /([0-9\.\,]+)/;
        refinedPrice = Number(unrefinedPrice.replace(priceCheck, "$1").replace(",", ""))
    } else {
        let c = cheerio.load(data);
        let unrefinedPrice = c(".cmc-details-panel-price__price").text();
        let priceCheck = /\D?([0-9\.\,]+)/
        refinedPrice = Number(unrefinedPrice.replace(priceCheck, "$1").replace(",", ""));
    }

    return refinedPrice;
}

module.exports = {
    refine,
    createToken
}
