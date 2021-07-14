

import Bcryptjs from 'bcryptjs';
import Users from '../models/users';
import Config from '../configs/config'
import Jwt from 'jsonwebtoken'

const addUser = async(ctx ,next) => {
    let { username, password } = ctx.request.body;

    const user = new Users({
        username,
        password: await Bcryptjs.hash(password, 10)
    })

    const find = await Users.exists({username})  

    if(find){
        ctx.status = 400
        ctx.body='User already exist'
    }else{
        const res = await user.save()
    
        ctx.status=200
        ctx.body={res}
    }
}

const login = async(ctx ,next) => {
    let {username, password} = ctx.request.body;

    try {
        const user = await Users.findOne({username})

        if(!user){
            ctx.status = 400
            throw new Error("Not found")
        }

        const Bcrypt = await Bcryptjs.compare(password, user.password)
        if(Bcrypt){
            const timeInMilliseconds = new Date().getTime();
            const expirationTime  = timeInMilliseconds + Number(Config.token.expireTime) * 10_000;
            const expireTimeInSeconds = Math.floor(expirationTime/1_000);

            const token = await Jwt.sign({
                username:user.username,
                password:user.password
            },Config.token.secret ,
            {
                issuer:Config.token.issUser,
                algorithm: 'HS256',
                expiresIn: expireTimeInSeconds
            }
            )
            ctx.status= 200
            ctx.message='Auth Successful'
            ctx.body={user,token}
        }else{
            ctx.status= 401
            ctx.message='Unauthorized'
        }
        
    } catch (error) {
        ctx.status= 500
        ctx.message=error.message
        error
    }
};



export default { addUser,login }
