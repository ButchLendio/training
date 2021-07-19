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

