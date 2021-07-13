import Express from 'express';
import Controller from '../controllers/products';

const ROUTER = Express.Router();

ROUTER.post('/post', Controller.addProducts);

ROUTER.get('/get', Controller.getAllProducts);

export = ROUTER;
