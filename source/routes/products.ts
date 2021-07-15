import Router from 'koa-router'
import {getAllProducts} from '../controllers/products';

const router = new Router();
router.get('/products', getAllProducts);

export = router;
 
