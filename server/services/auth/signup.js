const { createHash } = require('crypto');
const admin = require('firebase-admin');
const firestore = admin.firestore();
const { createToken } = require('./../../helpers');

module.exports = async (req, res) => {
    res.set('Content-Type', 'application/json');
    if (!req.body.email || !req.body.pass) return res.status(406).send({ error: "Email or Password missing"});
    if (req.method == 'POST') {
        const email = req.body.email.toLowerCase();
        const password = req.body.pass;
        let user;

        try {
            const query = firestore.collection('users').where('email', '==', email).limit(1);
            const snap = await query.get();

            if (snap.empty) {
                const hash = createHash('sha512');

                hash.update(password);

                const hashedPass = hash.digest('hex');
                const ref = await firestore.collection('users').add({ email, password: hashedPass });
                const userSnap = await ref.get();
                const token = await createToken(ref.id);

                if (token) {
                    return res.send({ success: true, token });
                }

                return res.send({ success: false, code: 'auth/token-error' });
            } else {
                return res.send({ success: false, code: 'auth/email-exists' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send({ success: false, error });
        }
    }
}
