import Koa from 'koa';
import BodyParser from 'koa-bodyparser';
import Cors from 'koa-cors'
import Logger from 'koa-logger'

import Config from './configs/config';
import ProductsRoutes from './routes/products';
import UsersRoutes from './routes/users';
import Mongoose from 'mongoose';

const DB_URL = "http://localhost:50001/testing"
//Connect to mongo

Config.mongo.connectWithRetry()

async function Connect(){
   const connect= Config.mongo.connectWithRetry()
   return connect
} 

const APP = new Koa()

APP.use(BodyParser());
APP.use(
    Cors({
        origin:'*'
    })
);
APP.use(Logger())

APP.use(ProductsRoutes.routes());
APP.use(UsersRoutes.routes());



const SERVER = APP.listen(Config.server.port, async ()=>{
    await Connect()
    console.log(`Server running on ${Config.server.hostname}:${Config.server.port}`)
})

export = SERVER 
