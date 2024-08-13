const jwt = require('jsonwebtoken');

// Middleware to verify token
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json({ message: 'Authorization header not provided.' });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(403).json({ message: 'Token not provided.' });
    }

    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token has expired.' });
            } else if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Invalid token.' });
            } else {
                return res.status(500).json({ message: 'Failed to authenticate token.' });
            }
        }

        req.userId = decoded.id;
        next();
    });
}

module.exports = verifyToken;
