import Router from 'koa-router'
import Controller from '../controllers/products';
import {verifyToken} from '../middlewares/extract-jwt'

const router = new Router();

router.get('/products',verifyToken, Controller.getAllProducts);

export = router;
 
