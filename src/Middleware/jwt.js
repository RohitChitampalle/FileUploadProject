const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');

    //error handling 

    if (token === undefined) {
        return res.status(401).json({
            message: 'user is not present'
        });
    }

    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded.user;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid token'
        });
    }
};

module.exports = verifyToken;