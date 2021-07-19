import Router from 'koa-router'
import {deleteProduct} from '../controllers/products';
import { verifyToken } from '../middlewares/extract-jwt';
const router = new Router();

router.delete('/products/:id', verifyToken,deleteProduct);

export = router;
 
