import jwt from 'jsonwebtoken';

function auth(req, res, next){
    try {
        const token = req.cookies.token;

        if(!token) return res.status(401).json({message: "Unautorized"});

        const validatedUser = jwt.verify(token, process.env.JWT_SECRET);
        req.user = validatedUser.id;
        next();
    } catch (error) {
        return res.status(401).json({error: "Unauthorised"});
    }
}

export default auth;