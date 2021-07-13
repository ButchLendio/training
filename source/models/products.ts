import Mongoose, { Schema } from 'mongoose';
import IProducts from '../interfaces/products';

const ProductSchema: Schema = new Schema(
    {
        name: { type: String, require: true },
        price: { type: String, require: true }
    },
    {
        timestamps: true
    }
);

export default Mongoose.model<IProducts>('Products', ProductSchema);
