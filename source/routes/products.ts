import Router from 'koa-router'
import {updateProduct,addProduct} from '../controllers/products';
import { verifyToken } from '../middlewares/extract-jwt';

const router = new Router();

router.post('/products', verifyToken, addProduct)

router.patch('/products/:id', verifyToken,updateProduct);


export = router;
 
