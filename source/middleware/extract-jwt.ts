import { Request, Response, NextFunction } from 'express';
import Logging from '../configs/logging';
import Jwt from 'jsonwebtoken';
import Config from '../configs/config'

const NAMESPACE = 'Auth';

const extractJWT = (req: Request, res: Response, next: NextFunction) => {
    Logging.info(NAMESPACE, 'Validating token');

    let token = req.headers.authorization?.split(' ')[1];

    if (token) {
        Jwt.verify(token, Config.token.secret,(error,decode)=>{
            if(error){
                return res.status(404).json({
                    message: error.message,
                    error
                })
            }else{
                res.locals.jwt = decode
                next();
            }
        })
    }else{
        return res.status(401).json({
            message:'Unauthorized'
        })
    }
    return res.status(200).json({
        message: 'Authorized'
    });
};
export default extractJWT
