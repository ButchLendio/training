import Router from 'koa-router'
import Controller from '../controllers/products';
import verifyToken from '../middleware/extract-jwt';

const router = new Router();
router.post('/products',verifyToken, Controller.addProducts);

router.get('/products', Controller.getAllProducts);

export = router;
 
