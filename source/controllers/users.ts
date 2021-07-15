import Bcryptjs from 'bcryptjs';
import Users from '../models/users';
import Config from '../configs/config';
import Jwt from 'jsonwebtoken';

import Auth from 'basic-auth';

const addUser = async (ctx, next) => {
    const authCredentials = Auth(ctx);
    const { name } = ctx.request.body;
    const username = authCredentials.name;
    const password = authCredentials.pass;

    const user = new Users({
        name,
        username,
        password: await Bcryptjs.hash(password, 10)
    });

    const userExists = await Users.exists({ username });

    if (userExists) {
        ctx.status = 400;
        ctx.body = 'User already exist';
    } else {
        const res = await Users.create({user});
        ctx.status = 200;
        ctx.body = { res };
    }
};

const login = async (ctx, next) => {
    const authCredentials = Auth(ctx);
    
    const username = authCredentials.name;
    const password = authCredentials.pass;

    const user = await Users.findOne({ username });
    if (!user) {
        ctx.status = 400;
        ctx.message = 'User not registerd';
        return;
    }

    const ifMatch = await Bcryptjs.compare(password, user.password);
    
    if (ifMatch) {
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
        ctx.status = 401;
        ctx.message = 'Unauthorized';
    }
};

export default { addUser, login };
