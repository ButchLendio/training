import { Document } from 'mongoose';

export default interface IUser extends Document{
    name: string
    username: string;
    password: string;
}
