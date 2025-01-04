import jwt from 'jsonwebtoken';

function verifyToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).send('Not Authenticated');
    }

   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send('Invalid Token');
        }
        req.user = user;
        next();
    });

}

 function checkRole(roles) {
    return (req, res, next) => {
        if (req.user.role === roles[0] || req.user.role === roles[1] || req.user.role === roles[2]) {
            next();
        } else {
            res.status(401).send('Not Authorized');
        }
    }
}

export { verifyToken, checkRole };