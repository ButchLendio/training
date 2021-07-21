import Products from '../models/products';
import R from 'ramda'

export const updateProduct = async(ctx,next) =>{
    const {id} =ctx.params
    const decodedUsername=ctx.userName
    let body = ctx.request.body;

    const updatedAt = new Date();
    const cursor = Buffer.concat([
        Buffer.from(`${updatedAt.getTime()}`),
        Buffer.from(id),
    ]); 

    const product = await Products.findById(id)
    
    if(!product){
        ctx.throw(404,"Product does not exist");
        return
    }
    if(product.createdBy !== decodedUsername    ){
        ctx.throw(400,"Not the owner of the product")
    }

    const updatedProduct = await Products.updateOne(
        { _id: id },
        body,
        cursor
    )

    if(updatedProduct){
        const foundProduct = await Products.findById(ctx.params.id)
        ctx.status=200
        ctx.body = {
            message: "Product updated",
            product:foundProduct
           }
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
    const createdAt = new Date();
    const cursor = Buffer.concat([
        Buffer.from(`${createdAt.getTime()}`),
        Buffer.from(id),
    ]);
    const decodedUsername = ctx.userName
 
    if(!id){
        ctx.throw(400, 'Id required');
    }
    if (!name) {
        ctx.throw(400, 'Name required');
    }
    if (typeof name !== 'string') {
        ctx.throw(400, 'Name must be string');
    }
    if (!price) {
        ctx.throw(400, 'Price required');
    }
    if (typeof price !== 'number') {
        ctx.throw(400, 'Price must be number');
    }
    const productExists = await Products.exists({ id });

    if (productExists) {
        ctx.throw(400, 'Product already exist');
    } else {
        const res = await Products.create({
            id,
            name,
            price,
            createdBy: decodedUsername,
            cursor
        });
        ctx.status = 200;
        ctx.body = { res };
    }
};

export const getAllProducts = async (ctx, next) => {
    const { first, after, sort } = ctx.request.query;

    let convertedCursor,
        startCursor,
        endCursor,
        products,
        hasNextPage,
        hasPreviousPage
        
    const finalReturn:{
        product:{
            id:string,
            name:string,
            price:string,
            createdAt:Date,
            updatedAt:Date
        },
        cursor:string
    }[]=[]

    //for first only
    if (!first && !after) {
        products = await Products.find().limit(5)
        if(!products){
            ctx.throw(400,"No data")
        }
        convertedCursor = Buffer.from(R.head(products).cursor, 'base64');
        hasNextPage = await Products.exists({ cursor: { $gt: convertedCursor } });
        hasPreviousPage = await Products.exists({ cursor: { $lt: convertedCursor } });

        products.map((product) => {
            const data = {
              product: {
                id: product._id,
                name: product.name,
                price: product.price,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
              },
              cursor: Buffer.from(product.cursor).toString('base64'),
            };
            finalReturn.push(data);
          });

        startCursor = Buffer.from(R.head(products).cursor, 'base64').toString('base64');
        endCursor = Buffer.from(R.last(products).cursor, 'base64').toString('base64');

        ctx.body = {
            products: finalReturn,
            pageInfo: {
                startCursor,
                endCursor,
                hasNextPage,
                hasPreviousPage,
                totalCount: products.length
            }
        };
    }

    //for first only
    if (first && !after && !sort) {
        products = await Products.find().limit(Number(first))

        convertedCursor = Buffer.from(R.head(products).cursor, 'base64');
        hasNextPage = await Products.exists({ cursor: { $gt: convertedCursor } });
        hasPreviousPage = await Products.exists({ cursor: { $lt: convertedCursor } });

        products.map((product) => {
            const data = {
              product: {
                id: product._id,
                name: product.name,
                price: product.price,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
              },
              cursor: Buffer.from(product.cursor).toString('base64'),
            };
            finalReturn.push(data);
          });

        startCursor = Buffer.from(R.head(products).cursor, 'base64').toString('base64');
        endCursor = Buffer.from(R.last(products).cursor, 'base64').toString('base64');

        ctx.body = {
            products: finalReturn,
            pageInfo: {
                startCursor,
                endCursor,
                hasNextPage,
                hasPreviousPage,
                totalCount: products.length
            }
        };
    }

    //for first and after
    if (first && after && !sort) {
        convertedCursor = Buffer.from(after, 'base64');
        hasNextPage = await Products.exists({ cursor: { $gt: convertedCursor } });
        hasPreviousPage = await Products.exists({ cursor: { $lt: convertedCursor } });

        products = await Products.find({
            cursor: {
                $gte: convertedCursor
            }
        }).limit(Number(first));

        products.map((product) => {
            const data = {
              product: {
                id: product._id,
                name: product.name,
                price: product.price,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
              },
              cursor: Buffer.from(product.cursor).toString('base64'),
            };
            finalReturn.push(data);
          });

        startCursor = Buffer.from(R.head(products).cursor, 'base64').toString('base64');
        endCursor = Buffer.from(R.last(products).cursor, 'base64').toString('base64');

        ctx.body = {
            products: finalReturn,
            pageInfo: {
                startCursor,
                endCursor,
                hasNextPage,
                hasPreviousPage,
                totalCount: products.length
            }
        };
    }

    // for first,after and sort
    if (first && after && sort) {
        console.log("WEWs")
        convertedCursor = Buffer.from(after, 'base64');
        hasNextPage = await Products.exists({ cursor: { $gt: convertedCursor } });
        hasPreviousPage = await Products.exists({ cursor: { $lt: convertedCursor } });

        products = await Products.find({
            cursor: {
                $gte: convertedCursor
            }
        })
        .limit(Number(first))
        .sort({sort : 1})

        products.map((product) => {
            const data = {
              product: {
                id: product._id,
                name: product.name,
                price: product.price,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
              },
              cursor: Buffer.from(product.cursor).toString('base64'),
            };
            finalReturn.push(data);
          });

        startCursor = Buffer.from(R.head(products).cursor, 'base64').toString('base64');
        endCursor = Buffer.from(R.last(products).cursor, 'base64').toString('base64');

        ctx.body = {
            products: finalReturn,
            pageInfo: {
                startCursor,
                endCursor,
                hasNextPage,
                hasPreviousPage,
                totalCount: products.length
            }
        };
    }

};
