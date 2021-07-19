import Router from 'koa-router'
import {updateProduct} from '../controllers/products';

const router = new Router();

router.patch('/products/:id', updateProduct);

export = router;
 
