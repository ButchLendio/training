import Products from '../models/products';

const addProducts = async(ctx,next) =>{
   
    let { name, price} = ctx.request.body;

    const product = new Products({
        name,
        price
    })

    if(!name){
        ctx.status= 400
        ctx.message='Name require'
        return
    }
    if(!price){
        ctx.status= 400
        ctx.message='Price require'
        return
    }

    const find = await Products.exists({name})  

    if(find){
        ctx.status = 400
        ctx.body='Product already exist'
    }else{
        const res = await product.save()
    
        ctx.status=200
        ctx.body={res}
    }
}

const updateProduct = async(ctx,next) =>{
    try {
        const id =ctx.params.id
        let body = ctx.request.body;

        const execute = await Products.findByIdAndUpdate(id, body)

        if(execute){
            const result = await Products.findById(id)
            ctx.status=200
            ctx.body={result}
        }else{
        ctx.status=400
        ctx.message="Error on updated " 
        } 
    } catch (error) {
        ctx.status=400
        ctx.message=error 
    }
}

const getAllProducts = async (ctx,next) => {
    try {
        const results =  await Products.find()  
        ctx.status=200
        ctx.body={results} 
    } catch (error) {
        ctx.status=400
        ctx.message=error 
    }
};

export default {
     addProducts, 
     updateProduct, 
     getAllProducts };
