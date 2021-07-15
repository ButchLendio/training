import Router from 'koa-router'
import Controller from '../controllers/users';
import verifyToken from '../middleware/extract-jwt';

const router = new Router();

router.post('/users', Controller.addUser);

router.post('/auth', Controller.login);

export = router;

