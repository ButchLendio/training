import Bcryptjs from 'bcryptjs';
import Users from '../models/users';
import Config from '../configs/config';
import Jwt from 'jsonwebtoken';

import Auth from 'basic-auth';

export const addUser = async (ctx, next) => {
    const authCredentials = Auth(ctx);
    const { name } = ctx.request.body;
    const username = authCredentials.name;
    const password = authCredentials.pass;

    if(!name || typeof name==="string"){
        ctx.throw(400, 'Name required.');
        return
    }
    if(!username || typeof name==="string"){
        ctx.throw(400, 'Username required.');
        return
    }
    if(!password || typeof name==="string"){
        ctx.throw(400, 'Password required.');
        return
    }

    const user = new Users({
        name,
        username,
        password: await Bcryptjs.hash(password, 10)
    });

    const userExists = await Users.exists({ username });

    if (userExists) {
        ctx.throw(400, 'User already exist');
    } else {
        const res = await Users.create(user);
        ctx.status = 200;
        ctx.body = { res };
    }
};

export const login = async (ctx, next) => {
    const authCredentials = Auth(ctx);
    
    const username = authCredentials.name;
    const password = authCredentials.pass;

    const user = await Users.findOne({ username });
    if (!user) {
        ctx.throw(400, 'User not registerd');
        return;
    }

    const passwordIsValid = await Bcryptjs.compare(password, user.password);

    if (passwordIsValid) {
        const timeInMilliseconds = new Date().getTime();
        const expirationTime = timeInMilliseconds + Number(Config.token.expireTime) * 10_000;
        const expireTimeInSeconds = Math.floor(expirationTime / 1_000);

        const token = await Jwt.sign(
            {
                username: user.username,
                password: user.password
            },
            Config.token.secret,
            {
                issuer: Config.token.issUser,
                algorithm: 'HS256',
                expiresIn: expireTimeInSeconds
            }
        );
        ctx.status = 200;
        ctx.message = 'Auth Successful';
        ctx.body = { token };
    } else {
        ctx.throw(401, 'Unauthorized');
    }
};