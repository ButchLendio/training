import Products from '../models/products';

export const updateProduct = async(ctx,next) =>{
        const id =ctx.params.id
        let body = ctx.request.body;

        const execute = await Products.findByIdAndUpdate(id, body)

        if(execute){
            const result = await Products.findById(id)
            ctx.status=200
            ctx.body={result}
        }else{
            ctx.throw(400,"Error on update");
        } 
}

