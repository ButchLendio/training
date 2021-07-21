import Products from '../models/products';

export const deleteProduct = async(ctx,next) =>{
    const foundProduct = await Products.findById(ctx.params.id)
    
    if(!foundProduct){
        ctx.throw(400,"Product does not exist")
        return
    } 
    
    if(foundProduct.createdBy !== ctx.userName){
        ctx.throw(400,"Not the owener of the product")
    }

    const result = await foundProduct.delete()

    if(result){
        ctx.status=200
    }else{
        ctx.throw(400,"Error on delete")
    } 

}
export const addProduct = async(ctx,next) =>{
   
    const { id, name, price} = ctx.request.body;
    const createdAt = new Date();
    const cursor = Buffer.concat([
        Buffer.from(`${createdAt.getTime()}`),
        Buffer.from(id),
    ]);
    const decodedUsername = ctx.userName
 
    if(!id){
        ctx.throw(400, 'Id required');
    }
    if(!name){
        ctx.throw(400, 'Name required');
    }
    if(typeof name!=="string"){
        ctx.throw(400, 'Name must be string');
    }
    if(!price){
        ctx.throw(400, 'Price required');
    }
    if(typeof price!=="number"){
        ctx.throw(400, 'Price must be number');
    }
    const productExists = await Products.exists({id})  


    if(productExists){
        ctx.throw(400, 'Product already exist')
    }else{
        const res = await Products.create({ 
                id,
                name,
                price,
                createdBy:decodedUsername,
                cursor:cursor,
            })
        ctx.status=200
        ctx.body={res}
    }
}

