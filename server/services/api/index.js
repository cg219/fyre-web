const stocks = require('./stocks');
const cryptos = require('./cryptos');
const assets = require('./assets');
const accounts = require('./accounts');

const validate = req => {
    const symbol = req.query.symbol;

    if (typeof symbol !== 'string') return null;

    req.symbol = symbol.toUpperCase();
    return true;
}

module.exports = async (req, res) => {
    switch (req.path) {
        case '/':
            return res.status(404);
            break;

        case '/stocks':
            return stocks(req, res);
            break;

        case '/cryptos':
            return cryptos(req, res);
            break;

        case '/accounts':
            return accounts(req, res);
            break;

        case '/assets':
            return assets(req, res);
            break;
    }
}
