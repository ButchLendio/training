import console from 'console';
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

export const getAllProducts = async (ctx,next) => {
        const {first,last,after,before,sort,order} = ctx.request.query  
        console.log(first,last,after,before,sort,order)
        let convertedCurser,
            totalProducts

        // const convertedCurser=Buffer.from(after || before, 'base64')
        // console.log(convertedCurser)

        // const sortBy =sort.split(',')
        const hasNextPage = await Products.exists({ cursor: { $gt: convertedCurser} });
        console.log(hasNextPage)

        if(first && after){
            console.log("1")
            convertedCurser=Buffer.from(after, 'base64')

            const products = await Products.find({
                cursor:{
                    $gt:convertedCurser
                }
        }) 
                    .limit(first * 1)
        console.log(products)
        }    
        
        if(last && before){
            console.log("2")
            totalProducts = await Products.find()
            convertedCurser=Buffer.from(before, 'base64')

            console.log(convertedCurser)
            const products = await Products.find({
                cursor:{
                    $lt:convertedCurser
                }
        }) 
                    .skip(totalProducts.length-last)
        console.log(products)
        }  

        // const totalProducts =  await Products.find()  
        // let filterlast
        // if(first){

        // }
        // if(last){
        // filterlast = await Products.aggregate([
        //         { 
        //             $skip: (totalProducts.length-Number(last))
        //         },  
        //     ]) 
        // }
        // console.log(filterlast) 
        // console.log(last)

        // const filter = await Products.$where(`cursor < '${before || after}'`)
        // console.log(filter)
        // console.log(results)
        // const wew = await Products.aggregate([
            // { $match:{ 
            //     cursor: { 
            //         $gt: after || before
            //         }
            //     } 
            // },
            // { 
            //     $skip: (totalProducts.length-Number(last))
            // },
            // {
            //     $sort:{
            //             name: 1 ,
            //             id: 1,   
            //     }
            // }     
        // ])

        // console.log(wew)
        // console.log(wew.length)
        // const pageInfo = {
        //     startCursor: after || before,
        //     endCursor:after || before,
        //     totalCount: wew.length
        // }
        // console.log(pageInfo)

        // for (let index = 0; index < results.length; index++) {
        //     const element = results[index];
            
        // }

        // if(results){   
        //     ctx.status=200
        //     ctx.body={results} 
        // }else{
        //    ctx.throw(400,"Not found.") 
        // }
};

