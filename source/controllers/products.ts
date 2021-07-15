import Products from '../models/products';

export const getAllProducts = async (ctx,next) => {
    try {
        const results =  await Products.find()  
        ctx.status=200
        ctx.body={results} 
    } catch (error) {
        ctx.status=400
        ctx.message=error 
    }
};
