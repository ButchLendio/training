import console from 'console';
import Products from '../models/products';

export const deleteProduct = async (ctx, next) => {
    const foundProduct = await Products.findById(ctx.params.id);

    if (!foundProduct) {
        ctx.throw(400, 'Product does not exist');
        return;
    }

    if (foundProduct.createdBy !== ctx.userName) {
        ctx.throw(400, 'Not the owener of the product');
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
    console.log(first, last, after, before, sort, order);

    let convertedCurser,
        totalProducts,
        startCursor,
        endCursor,
        products,
        hasNextPage,
        hasPreviousPage,
        finalReturn: any = []

    //for first and after
    if (first && after) {
        convertedCurser = Buffer.from(after, 'base64');
        hasNextPage = await Products.exists({ cursor: { $gt: convertedCurser } });
        hasPreviousPage = await Products.exists({ cursor: { $lt: convertedCurser } });

        products = await Products.find({
            cursor: {
                $gt: convertedCurser
            }
        }).limit(first * 1);

        for (let index = 0; index < products.length; index++) {
            const element = products[index];
            const data = {
                product: {
                    id: element._id,
                    name: element.name,
                    price: element.price,
                    createdAt: element.createdAt,
                    updatedAt: element.updatedAt
                },
                cursor: Buffer.from(element.cursor, 'base64').toString('base64')
            };
            finalReturn.push(data);
        }

        startCursor = Buffer.from(products[0].cursor, 'base64').toString('base64');
        endCursor = Buffer.from(products[products.length - 1].cursor, 'base64').toString('base64');

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

        convertedCurser = Buffer.from(before, 'base64');
        hasNextPage = await Products.exists({ cursor: { $gt: convertedCurser } });
        hasPreviousPage = await Products.exists({ cursor: { $lt: convertedCurser } });

        products = await Products.find({
            cursor: {
                $lt: convertedCurser
            }
        }).skip(totalProducts.length - 1 - last);

        for (let index = 0; index < products.length; index++) {
            const element = products[index];
            const data = {
                product: {
                    id: element._id,
                    name: element.name,
                    price: element.price,
                    createdAt: element.createdAt,
                    updatedAt: element.updatedAt
                },
                cursor: Buffer.from(element.cursor, 'base64').toString('base64')
            };
            finalReturn.push(data);
        }

        startCursor = Buffer.from(products[0].cursor, 'base64').toString('base64');
        endCursor = Buffer.from(products[products.length - 1].cursor, 'base64').toString('base64');

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
