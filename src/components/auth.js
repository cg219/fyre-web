import m from 'mithril';
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { vow } from 'batboy.mente';

var Auth = {
    loginEmail: '',
    signupEmail: '',
    name: '',
    async sendMagicLink(url) {
        var settings = {
            handleCodeInApp: true,
            url
        }

        await sendSignInLinkToEmail(getAuth(), Auth.loginEmail, settings);

        localStorage.setItem('emailMagic', Auth.loginEmail);
    },
    async createUser(url) {
        var settings = {
            handleCodeInApp: true,
            url
        }

        let functions = getFunctions();
        let createUser = httpsCallable(functions, 'user-create');
        let [user, userError] = await vow(createUser({ name: Auth.name, email: Auth.signupEmail}));

        if (userError) throw new Error(userError);

        await sendSignInLinkToEmail(getAuth(), Auth.signupEmail, settings);

        localStorage.setItem('emailMagic', Auth.signupEmail);
    },
    async isSignInLink() {
        return isSignInWithEmailLink(getAuth(), location.href);
    },
    async login() {
        var auth = getAuth();

        if (isSignInWithEmailLink(auth, location.href)) {
            let email = localStorage.getItem('emailMagic');

            if (!email) return new Error('Email missing');

            var [success, error] = await vow(signInWithEmailLink(auth, email, location.href));

            if (error) return new Error(error);

            let functions = getFunctions();
            let getUser = httpsCallable(functions, 'user-get');
            let [user, userError] = await vow(getUser());

            if (userError) throw new Error(userError);

            return user;
        }

        return null;
    }
}

export default Auth;
