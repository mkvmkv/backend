const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        const token = req.header('x-auth-token');
        if (!token)
            res.status(400).json({ msg: "No Authentication token, authorization denied" });
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified)
            res.status(401).json({ msg: "Token Verification failed!!" });
        req.user = verified.id;
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}
module.exports = auth;