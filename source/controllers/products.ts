import Mongoose from 'mongoose';
import Products from '../models/products';



// const addProducts = (req: Request, res: Response, next: NextFunction) => {
//     let { name, price } = req.body;

//     const product = new Products({
//         _id: new Mongoose.Types.ObjectId(),
//         name,
//         price
//     });

//     return product
//         .save()
//         .then((result) => {
//             return res.status(201).json({
//                 product: result
//             });
//         })
//         .catch((error) => {
//             return res.status(500).json({
//                 message: error.message,
//                 error
//             });
//         });
// };

const getAllProducts = async (ctx,next) => {
    try {
        const results =  await Products.find()  
        console.log(results)
        ctx.status=200
        ctx.body={results} 
    } catch (error) {
        ctx.status=500
        ctx.message=error 
    }
};

export default { getAllProducts };
