import Router from 'koa-router'
import {updateProduct} from '../controllers/products';
import { verifyToken } from '../middlewares/extract-jwt';
const router = new Router();

router.delete('/products/:id', verifyToken,updateProduct);

export = router;
 
