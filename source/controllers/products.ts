
import Mongoose from 'mongoose';
import Products from '../models/products';


const getAllProducts = async (ctx,next) => {
    try {
        const results =  await Products.find()  
        console.log(results)
        ctx.status=200
        ctx.body={results} 
    } catch (error) {
        ctx.status=500
        ctx.message=error 
    }
};

export default { getAllProducts };
