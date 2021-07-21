import Products from '../models/products';
import R from 'ramda'

export const deleteProduct = async (ctx, next) => {
    const foundProduct = await Products.findById(ctx.params.id);

    if (!foundProduct) {
        ctx.throw(400, 'Product does not exist');
        return;
    }

    if (foundProduct.createdBy !== ctx.userName) {
        ctx.throw(400, 'Not the owner of the product');
    }

    const result = await foundProduct.delete();

    if (result) {
        ctx.status = 200;
    } else {
        ctx.throw(400, 'Error on delete');
    }
};
export const addProduct = async (ctx, next) => {
    const { id, name, price } = ctx.request.body;

    const decodedUsername = ctx.userName;

    if (!id) {
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
            createdBy: decodedUsername
        });
        ctx.status = 200;
        ctx.body = { res };
    }
};

export const getAllProducts = async (ctx, next) => {
    const { first, last, after, before, sort, order } = ctx.request.query;

    let convertedCursor,
        totalProducts,
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
        console.log
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
    if (first && !after) {
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
    if (first && after) {
        convertedCursor = Buffer.from(after, 'base64');
        hasNextPage = await Products.exists({ cursor: { $gt: convertedCursor } });
        hasPreviousPage = await Products.exists({ cursor: { $lt: convertedCursor } });

        products = await Products.find({
            cursor: {
                $gt: convertedCursor
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

    //for last and before
    if (last && before) {
        totalProducts = await Products.find();

        convertedCursor = Buffer.from(before, 'base64');
        hasNextPage = await Products.exists({ cursor: { $gt: convertedCursor } });
        hasPreviousPage = await Products.exists({ cursor: { $lt: convertedCursor } });

        products = await Products.find({
            cursor: {
                $lt: convertedCursor
            }
        }).skip(totalProducts.length - 1 - last);

        products.map((product) => {
            console.log(product )
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
