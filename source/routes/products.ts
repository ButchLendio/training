import Router from 'koa-router'
import Controller from '../controllers/products';

const router = new Router();
router.post('/products',Controller.addProducts);

router.patch('/products/:id',Controller.updateProduct);

router.get('/products', Controller.getAllProducts);

export = router;
 
