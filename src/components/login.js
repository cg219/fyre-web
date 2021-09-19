import m from 'mithril';
import Auth from './auth';
import { vow } from 'batboy.mente';

async function sendMagicLink() {
    await Auth.sendMagicLink(location.href);
}

function onInput(event) {
    Auth.email = event.target.value;
}

export default {
    async oninit(vnode) {
        var [user, error] = await vow(Auth.login());

        if (error) {
            console.error(error)
        }

        if (user) {
            console.log(user);
            m.route.set('/dashboard');
        } else {
            // Auth.test();
        }
    },
    view() {
        return m('.login', [
            m('input', { type: 'text', placeholder: 'Enter Email', value: Auth.email, oninput: onInput }),
            m('button', { class: 'login', onclick: sendMagicLink }, 'Login w/ Magic Link')
        ])
    }
}
