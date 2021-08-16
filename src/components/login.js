const m = require('mithril');
const Auth = require('./auth');
const { vow } = require('batboy.mente');

async function sendMagicLink() {
    await Auth.sendMagicLink(location.href);
}

function onInput(event) {
    Auth.email = event.target.value;
}

module.exports = {
    async oninit(vnode) {
        var [user, error] = await vow(Auth.login());

        if (error) {
            console.error(error)
        }

        if (user) {
            console.log(user);
        } else {
            Auth.test();
        }
    },
    view() {
        return m('.login', [
            m('input', { type: 'text', placeholder: 'Enter Email', value: Auth.email, oninput: onInput }),
            m('button', { class: 'login', onclick: sendMagicLink }, 'Login w/ Magic Link')
        ])
    }
}
