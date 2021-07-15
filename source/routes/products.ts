import Router from 'koa-router'
import Controller from '../controllers/products';
import verifyToken from '../middleware/extract-jwt';

const router = new Router();
router.post('/products',verifyToken, Controller.addProducts);

router.patch('/products/:id',verifyToken,Controller.updateProduct);

router.get('/products', verifyToken,Controller.getAllProducts);

export = router;
 
