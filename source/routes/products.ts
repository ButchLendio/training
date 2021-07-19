import Router from 'koa-router'
import {updateProduct} from '../controllers/products';
import { verifyToken } from '../middlewares/extract-jwt';

const router = new Router();

router.patch('/products/:id', verifyToken,updateProduct);

export = router;
 
