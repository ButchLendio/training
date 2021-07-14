

import Bcryptjs from 'bcryptjs';
import Mongoose from 'mongoose';
import Users from '../models/users';
import SignJwt from '../functions/sign-jwt';


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
 
};

export default { addUser };
