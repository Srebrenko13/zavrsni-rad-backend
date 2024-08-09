import jwt, {JwtPayload, Secret} from "jsonwebtoken";
import {NextFunction, Request, Response} from "express";

const SECRET_KEY: Secret = process.env.SESSION_SECRET || "something to fill in the gaps";

function generateToken(payload: any): string{
    const options = {
        expiresIn: '2d',
    };

    return jwt.sign(payload, SECRET_KEY, options);
};

const validateToken = async (req: Request, res: Response, next: NextFunction)=>{
    try{
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if(!token) throw new Error("No token in header");

        const decode = jwt.verify(token, SECRET_KEY);
        req.body.token = decode;
        next();
    } catch(err){
        res.status(401).send("Authentication failed");
    }
};

export {generateToken, validateToken}