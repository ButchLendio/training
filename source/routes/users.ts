import Router from 'koa-router'
import {addUser,login} from '../controllers/users';

const router = new Router();

router.post('/users', addUser);

router.post('/auth', login);

export = router;

