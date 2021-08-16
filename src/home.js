const m = require('mithril');
const Login = require('./components/login');

module.exports = {
    view() {
        return m('div.home', m(Login))
    }
}
