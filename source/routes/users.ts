import Router from 'koa-router'
import Controller from '../controllers/users';
import ExtractJWT from '../middleware/extract-jwt';

const router = new Router();

router.post('/users', Controller.addUser);

export = router;

