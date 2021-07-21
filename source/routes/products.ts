import Router from 'koa-router'
import { verifyToken } from '../middlewares/extract-jwt';
import {
    updateProduct,
    deleteProduct,
    addProduct,
    getAllProducts
} from '../controllers/products';

const router = new Router();

router.post('/products', verifyToken, addProduct)

router.patch('/products/:id', verifyToken,updateProduct);

router.delete('/products/:id', verifyToken,deleteProduct);

router.get('/products', verifyToken, getAllProducts)

export = router;
 
