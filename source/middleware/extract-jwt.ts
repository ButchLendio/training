
import Jwt from 'jsonwebtoken';
import Config from '../configs/config'


const extractJWT = async (ctx, next) => {

    let token = ctx.headers.authorization?.split(' ')[1];

    if (token) {
        Jwt.verify(token, Config.token.secret,(error,decode)=>{
            if(error){
                ctx.status = 404
                ctx.body.message=error.message
              
            }else{
                ctx.locals.jwt = decode
                next();
            }
        })
    }else{
        ctx.status = 401
        ctx.body='Unauthorized'
    }
    ctx.status = 200
};
export default extractJWT
