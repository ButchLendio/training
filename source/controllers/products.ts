import Products from '../models/products';

export const addProducts = async(ctx,next) =>{
   
    let { name, price} = ctx.request.body;
    const decodedUsername = ctx.userName
    const product = new Products({
        name,
        price,
        createdBy:decodedUsername
    })

    if(!name){
        ctx.throw(400, 'Name required');
        return
    }
    if(typeof name!="string"){
        ctx.throw(400, 'Name must be string');
        return
    }
    if(!price){
        ctx.throw(400, 'Price required');
        return
    }
    if(typeof price!="number"){
        ctx.throw(400, 'Price must be number');
        return
    }
    const find = await Products.exists({name})  


    if(find){
        ctx.throw(400, 'Product already exist')
        return
    }else{
        const res = await Products.create(product)
        ctx.status=200
        ctx.body={res}
    }
}

export const getAllProducts = async (ctx,next) => {
    try {
        const results =  await Products.find()  
        ctx.status=200
        ctx.body={results} 
    } catch (error) {
        ctx.status=500
        ctx.message=error 
    }
};

