import Koa from 'koa';
import BodyParser from 'koa-bodyparser';
import Cors from 'koa-cors'
import Logger from 'koa-logger'

import Config from './configs/config';
import ProductsRoutes from './routes/products';
import UsersRoutes from './routes/users';
import Mongoose from 'mongoose';


//Connect to mongo
async function Connect(){
    const connect = await Mongoose.connect(Config.mongo.url, Config.mongo.options)
    if(connect){
        console.log("Connected to mongoDB!")
    }else{
        throw new Error("Error")
    }
} 

Connect()


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
    console.log(`Server running on ${Config.server.hostname}:${Config.server.port}`)
})

export = SERVER 

