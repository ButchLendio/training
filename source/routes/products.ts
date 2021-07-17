import Router from 'koa-router'
import {verifyToken} from '../middlewares/extract-jwt'
import {
    addProduct
} from '../controllers/products';

const router = new Router();

router.post('/products', verifyToken, addProduct)

export = router;
 
