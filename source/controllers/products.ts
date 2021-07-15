import Products from '../models/products';

const getAllProducts = async (ctx,next) => {
    try {
        const results =  await Products.find()  
        ctx.status=200
        ctx.body={results} 
    } catch (error) {
        ctx.status=500
        ctx.message=error 
    }
};

export default { getAllProducts };
