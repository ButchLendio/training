import Jwt from 'jsonwebtoken'
import Config from '../configs/config'
import Logging from '../configs/logging'
import IUser from '../interfaces/users'

const NAMESPACE = 'Auth';

const signJWT = (user: IUser, callback: (error:Error | null, token:string | null) => void): void => {
    const timeInMilliseconds = new Date().getTime();
    const expirationTime  = timeInMilliseconds + Number(Config.token.expireTime) * 10_000;
    const expireTimeInSeconds = Math.floor(expirationTime/1_000);

    Logging.info(NAMESPACE,`Attempting to sign token for ${user.username}`)
    try {
        Jwt.sign({
            username:user.username
        },Config.token.secret ,
        {
            issuer:Config.token.issUser,
            algorithm: 'HS256',
            expiresIn: expireTimeInSeconds
        },
        (error, token) =>{
            if(error){
                callback(error,null)
            }
            else if(token){
                callback(null,token)
            }
        })
    } catch (error) {
    Logging.info(NAMESPACE, error.message, error)
    callback(error,null)
    }
}

export default signJWT
 