const admin = require('firebase-admin');

//TODO Implement Login somehow

module.exports = async (req, res) => {
    res.set('Content-Type', 'application/json');
    if (!req.body.email || !req.body.pass) return res.status(406).send({ error: "Email or Password missing"});
    if (req.method == 'POST') {
        const email = req.body.email;
        const password = req.body.pass;
        let user;

        try {
            user = await admin.auth().getUserByEmail(email)
        } catch (error) {
            return res.status(403).send({ error });
        }

        res.send({
            email,
            password,
            user
        })
    }
}
