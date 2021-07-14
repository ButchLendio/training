import { Document } from 'mongoose';

export default interface IProducts extends Document {
    name: string;
    price: string;
    createdBy: string;
}
