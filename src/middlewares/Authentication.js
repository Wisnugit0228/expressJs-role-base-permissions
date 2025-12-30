import jwt from "jsonwebtoken";

export const Authenticate = (req, res, next) => {
    const header = req.headers['authorization'];
    const token = header && header.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.user = {
            userId: decoded.sub,
            email: decoded.email,
            roles: decoded.roles || [],
            permissions: decoded.permissions || []
        };
        next();
    });
}