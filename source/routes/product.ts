import Express from 'express';
import Controller from '../controllers/product';

const ROUTER = Express.Router();

ROUTER.get('/products', Controller.getAllBooks);

export = ROUTER;
