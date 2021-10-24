import m from 'mithril';
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { vow } from 'batboy.mente';

var Auth = {
    email: '',
    async sendMagicLink(url) {
        var settings = {
            handleCodeInApp: true,
            url
        }

        await sendSignInLinkToEmail(getAuth(), Auth.email, settings);

        localStorage.setItem('emailMagic', Auth.email);
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
