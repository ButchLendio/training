import Products from '../models/products';


export const deleteProduct = async(ctx,next) =>{
    const id =ctx.params.id
    const decodedUsername= ctx.userName

    const findproduct = await Products.findById(id)
    
    if(!findproduct){
        ctx.throw(400,"Product does not exist")
        return
    } 
    
    if(findproduct.createdBy !== decodedUsername){
        ctx.throw(400,"Not the owener of the product")
    }

    const execute = await Products.findByIdAndDelete(id)

    if(execute){
        ctx.status=200
    }else{
        ctx.throw(400,"Error on delete")
    } 

}
