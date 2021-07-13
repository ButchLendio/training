import { Request, Response, NextFunction } from 'express';
import Mongoose from 'mongoose';
import Products from '../models/products';

const addProducts = (req: Request, res: Response, next: NextFunction) => {
    let { name, price } = req.body;

    const product = new Products({
        _id: new Mongoose.Types.ObjectId(),
        name,
        price
    });

    return product
        .save()
        .then((result) => {
            return res.status(201).json({
                product: result
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const getAllProducts = (req: Request, res: Response, next: NextFunction) => {
    Products.find()
        .exec()
        .then((results) => {
            return res.status(200).json({
                products: results,
                count: results.length
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

export default { addProducts, getAllProducts };
