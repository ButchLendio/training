import Jwt from 'jsonwebtoken'
import Config from '../configs/config'
import IUser from '../interfaces/users'

const  signJWT = async(user: IUser, callback: (error:Error | null, token:string | null) => void) => {
    const timeInMilliseconds = new Date().getTime();
    const expirationTime  = timeInMilliseconds + Number(Config.token.expireTime) * 10_000;
    const expireTimeInSeconds = Math.floor(expirationTime/1_000);

        Jwt.sign({
            username:user.username,
            password:user.password
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
    }

export default signJWT
 