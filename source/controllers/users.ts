
import Bcryptjs from 'bcryptjs';
import Mongoose from 'mongoose';
import Users from '../models/users';
import SignJwt from '../functions/sign-jwt';


const addUser = async(ctx ,next) => {
    let { username, password } = ctx.request.body;

    const user = new Users({
        _id: new Mongoose.Types.ObjectId(),
        username,
        password: await Bcryptjs.hash(password, 10)
    })

    const find = await Users.find({username})  

    if(find.length!=0){
        ctx.status = 400
        ctx.body='User already exist'
    }else{
        const res = await user.save()
    
        ctx.status=200
        ctx.body={res}
    }
 
};

const login = async(ctx ,next) => {
    let {username, password} = ctx.body;

    await Users.find({username})
    .then((users) => {
        if(users.length !==1 ){
            ctx.status = 401
            ctx.message='Unauthorized'
        }

        Bcryptjs.compare(password, users[0].password,(error, result) =>{
            if(error){
                 ctx.status= 401
                 ctx.message='Unauthorized'
                
            }else if(result){
                SignJwt(users[0],(_error, token) => {
                    if(_error){
                        ctx.status= 401
                        ctx.message='Unauthorized'
                    }else if(token){
                        ctx.status= 200
                        ctx.message='Auth Successfu'
                        token
                        ctx.body={user:users[0]}
                    }
                })

            }
             
        })
    })
    .catch(error => {
        ctx.status= 500
        ctx.message=error.message
        error
    })
};


export default { addUser,login };
