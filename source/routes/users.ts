import Express from 'express';
import Controller from '../controllers/users';

const ROUTER = Express.Router();

// ROUTER.post('/post', Controller.addProducts);

ROUTER.get('/validate', Controller.validateToken);

ROUTER.post('/register', Controller.addUser);

ROUTER.post('/login', Controller.login);

ROUTER.get('/get', Controller.getAllUsers);

export = ROUTER;
