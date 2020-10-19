const signup = require('./signup');
const login = require('./login');

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

        case '/login':
            return login(req, res);
            break;

        case '/signup':
            return signup(req, res);
            break;
    }
}
