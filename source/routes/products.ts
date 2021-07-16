import Router from 'koa-router'
import {verifyToken} from '../middlewares/extract-jwt'
import {
    getAllProducts,
    addProducts
} from '../controllers/products';

const router = new Router();

router.post('/products', verifyToken, addProducts)

router.get('/products', getAllProducts);

export = router;
 
