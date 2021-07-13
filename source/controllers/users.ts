import { Request, Response, NextFunction } from 'express';
import Logging from '../configs/logging';
import Bcryptjs, { hash } from 'bcryptjs';
import Mongoose from 'mongoose';
import Users from '../models/users';
import SignJwt from '../functions/sign-JWT'




const NAMESPACE = 'User';
const validateToken = (req: Request, res: Response, next: NextFunction) => {
    Logging.info(NAMESPACE, 'Token validated');

    return res.status(200).json({
        message: 'Authorized'
    });
};

const addUser = (req: Request, res: Response, next: NextFunction) => {
    let { username, password } = req.body;

    Bcryptjs.hash(password, 10, (hashError, hash) => {
        if (hashError) {
            return res.status(500).json({
                message: hashError.message,
                error: hashError
            });
        }

        //insert user to DB
        const user = new Users({
            _id: new Mongoose.Types.ObjectId(),
            username,
            password:hash
        })

        return user.save()
        .then(user => {
            return res.status(201).json({
                user
            })
        })
        .catch(error => {
            return res.status(500).json({
                message:error.message,
                error
            }) 
        })
    });
};

const login = (req: Request, res: Response, next: NextFunction) => {
    let {username, password} = req.body;

    Users.find({username})
    .exec()
    .then((users) => {
        if(users.length !==1 ){
            return res.status(401).json({
                message:'Unauthorized'
            })
        }

        Bcryptjs.compare(password, users[0].password,(error, result) =>{
            if(error){
                return res.status(401).json({
                    message:'Unauthorized'
                })
            }else if(result){
                SignJwt(users[0],(_error, token) => {
                    if(_error){
                        return res.status(401).json({
                            message:'Unauthorized',
                            error:_error
                        })
                    }else if(token){
                        return res.status(200).json({
                            message:'Auth Successful',
                            token,
                            user:users[0]
                        })
                    }
                })

            }
             
        })
    })
    .catch(error => {
        return res.status(500).json({
            message:error.message,
            error
        }) 
    })


};

const getAllUsers = (req: Request, res: Response, next: NextFunction) => {};

export default { validateToken, addUser, login, getAllUsers };
