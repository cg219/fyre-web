import m from 'mithril';
import Auth from './auth';
import { vow } from 'batboy.mente';

async function sendMagicLink() {
    await Auth.sendMagicLink(location.href);
}

async function createUser() {
    await Auth.createUser(location.href);
}

function onInput(field) {
    return function callback(event) {
        Auth[field] = event.target.value;
    }
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
        return m('div', [
            m('.signup', [
                m('input', { type: 'text', placeholder: 'Enter Name', value: Auth.name, oninput: onInput('name') }),
                m('input', { type: 'text', placeholder: 'Enter Email', value: Auth.email, oninput: onInput('signupEmail') }),
                m('button', { class: 'signup', onclick: createUser }, 'Sign Up w/ Magic Link')
            ]),
            m('.login', [
                m('input', { type: 'text', placeholder: 'Enter Email', value: Auth.email, oninput: onInput('loginEmail') }),
                m('button', { class: 'login', onclick: sendMagicLink }, 'Login w/ Magic Link')
            ])
        ])
    }
}
