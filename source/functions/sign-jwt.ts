import Jwt from 'jsonwebtoken'
import Config from '../configs/config'
import IUser from '../interfaces/users'

const  signJWT =  (user: IUser, callback: (error:Error | null, token:string | null) => void): void => {
    const timeInMilliseconds = new Date().getTime();
    const expirationTime  = timeInMilliseconds + Number(Config.token.expireTime) * 10_000;
    const expireTimeInSeconds = Math.floor(expirationTime/1_000);

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

                console.log("WEW")
                callback(error,null)
            }
            else if(token){
                console.log("WOW")
                callback(null,token)
            }
        })
    } catch (error) {
    callback(error,null)
    }
}

export default signJWT
 