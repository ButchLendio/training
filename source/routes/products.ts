import Router from 'koa-router'
import {deleteProduct,addProduct} from '../controllers/products';
import { verifyToken } from '../middlewares/extract-jwt';

const router = new Router();

router.post('/products', verifyToken, addProduct)

router.delete('/products/:id', verifyToken,deleteProduct);


export = router;
 
