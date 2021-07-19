import Products from '../models/products';


export const deleteProduct = async(ctx,next) =>{
    const findproduct = await Products.findById(ctx.params.id)
    
    if(!findproduct){
        ctx.throw(400,"Product does not exist")
        return
    } 
    
    if(findproduct.createdBy !== ctx.userName){
        ctx.throw(400,"Not the owener of the product")
    }

    const execute = await Products.deleteOne({id:ctx.params.id})

    if(execute){
        ctx.status=200
    }else{
        ctx.throw(400,"Error on delete")
    } 

}
