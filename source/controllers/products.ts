import Products from '../models/products';

const addProducts = async(ctx,next) =>{
    try {
    let { name, price } = ctx.request.body;

    const product = new Products({
        name,
        price
    })

    const find = await Products.exists({name})  

    if(find){
        ctx.status = 400
        ctx.body='Product already exist'
    }else{
        const res = await product.save()
    
        ctx.status=200
        ctx.body={res}
    }
    } catch (error) {
        ctx.status=500
        ctx.message=error 
    }
}


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

export default { addProducts,getAllProducts };
