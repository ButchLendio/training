import Router from 'koa-router'
import { verifyToken } from '../middlewares/extract-jwt';
import {
    addUser,
    login,
    getAllProductsPerUser
} from '../controllers/users';

const router = new Router();

router.post('/users', addUser);

router.post('/auth', login);

router.get('/:userId/products',verifyToken,getAllProductsPerUser)

export = router;

