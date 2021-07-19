import Products from '../models/products';

export const updateProduct = async(ctx,next) =>{
    const id =ctx.params.id
    const decodedUsername=ctx.userName
    let body = ctx.request.body;

    const product = await Products.findById(id)
    
    if(!product){
        ctx.throw(404,"Product does not exist");
        return
    }
    if(product.createdBy !== decodedUsername){
        ctx.throw(400,"Not the owner of the product")
    }

    const updateProduct = await Products.findByIdAndUpdate(id, body)

    if(updateProduct){
        const result = await Products.findById(id)
        ctx.status=200
        ctx.body={result}
    }else{
        ctx.throw(400,"Error on update");
    } 
}        

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
                createdBy:decodedUsername
            })
        ctx.status=200
        ctx.body={res}
    }
}

