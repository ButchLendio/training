import Mongoose, { Schema } from 'mongoose';
import IProducts from '../interfaces/products';

const ProductSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        price: { type: String, required: true }
    },
    {
        timestamps: true
    }
);

export default Mongoose.model<IProducts>('Products', ProductSchema);
