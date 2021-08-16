const m = require('mithril');
const { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } = require('firebase/auth');
const { vow } = require('batboy.mente');

var Auth = {
    email: '',
    test() {
        console.log(localStorage);
        console.log(location);
        console.log(Auth);
    },
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

            return {
                user: success.user,
                extra: success.additionalUserInfo
            }
        }

        return null;
    }
}

module.exports = Auth;
