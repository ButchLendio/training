import Bcryptjs from 'bcryptjs';
import Users from '../models/users';
import Products from '../models/products';
import Config from '../configs/config';
import Jwt from 'jsonwebtoken';
import R,{ map } from 'ramda';

import Auth from 'basic-auth';

export const addUser = async (ctx, next) => {
    const authCredentials = Auth(ctx);
    const { name } = ctx.request.body;
    const username = authCredentials.name;
    const password = authCredentials.pass;

    if(!name){
        ctx.throw(400, 'Name required');
    }
    if(typeof name!="string"){
        ctx.throw(400, 'Name must be string');
    }
    if(!username ){
        ctx.throw(400, 'Username required');
    }
    if(typeof username!="string"){
        ctx.throw(400, 'Username must be string');
    }
    if(!password){
        ctx.throw(400, 'Password required');
    }
    if(typeof password!="string"){
        ctx.throw(400, 'Password must be string');
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

export const getAllProductsPerUser = async (ctx, next) => {
    const { first, after, sort } = ctx.request.query;
    const {userId} = ctx.params

    let convertedCursor, startCursor, endCursor, hasNextPage, hasPreviousPage, sortFilter;

    const foundDefault = await Products.find().limit( first ? +first : 5)
    const foundUser = await Users.findById(userId)

    if(!foundUser){
        ctx.throw(400,"User not found")
        return
    }

    const getCreatedBy=foundUser.username

    convertedCursor = Buffer.from(after?after:R.head(foundDefault).cursor, 'base64');
    hasNextPage = await Products.exists({ cursor: { $gt: convertedCursor } });
    hasPreviousPage = await Products.exists({ cursor: { $lt: convertedCursor } });
    sortFilter=(`${sort ? {sort : 1} : {"cursor": 1} }`)  
    const products = await Products.find({
        createdBy: getCreatedBy,
        cursor: {
            $gte: convertedCursor
        }
    })
        .limit( first ? +first : 5)
        .sort(sortFilter);

        const returnables = map((product) =>
            ({product:{   
                    id: product._id,
                    name:product.name,
                    price: product.price,
                    createdAt: product.createdAt,
                    updatedAt: product.updatedAt, 
                },
                cursor:Buffer.from(product.cursor).toString('base64')
            }),
                products 
            )

    startCursor = Buffer.from(R.head(products).cursor, 'base64').toString('base64');
    endCursor = Buffer.from(R.last(products).cursor, 'base64').toString('base64');

    ctx.body = {
        products: returnables,
        pageInfo: {
            startCursor,
            endCursor,
            hasNextPage,
            hasPreviousPage,
            totalCount: products.length
        }
    };
};