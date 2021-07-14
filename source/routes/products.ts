import Router from 'koa-router'

import Controller from '../controllers/products';

const router = new Router();

router.get('/products', Controller.getAllProducts);

export = router;
 
