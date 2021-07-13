// import Express from 'express';
import Router from 'koa-router'

import Controller from '../controllers/products';

const router = new Router();

// ROUTER.post('/products', Controller.addProducts);

router.get('/products', Controller.getAllProducts);

export = router;
 
