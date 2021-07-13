import Http from 'http';
import Express from 'express';
import Logging from './configs/logging';
import Config from './configs/config';
import ProductsRoutes from './routes/products';
import UsersRoutes from './routes/users';
import Mongoose from 'mongoose';

const NAMESPACE = 'Server';
const ROUTER = Express();

//Connect to mongo
Mongoose.connect(Config.mongo.url, Config.mongo.options)
    .then((result) => {
        Logging.info(NAMESPACE, 'Connected to mongoDB!');
    })
    .catch((error) => {
        Logging.error(NAMESPACE, error.message, error);
    });

//Logging the request
ROUTER.use((req, res, next) => {
    Logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        Logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`);
    });

    next();
});

//parse the request
ROUTER.use(Express.urlencoded({ extended: false }));
ROUTER.use(Express.json());

//API rules
ROUTER.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST PUT');
        return res.status(200).json({});
    }

    next();
});

//routes
ROUTER.use('/api/products', ProductsRoutes);

ROUTER.use('/api/users', UsersRoutes);

//Error Handling
ROUTER.use((req, res, next) => {
    const error = new Error('Not Found');

    return res.status(404).json({
        message: error.message
    });
});

//Create the Server
const HTTP_SERVER = Http.createServer(ROUTER);
HTTP_SERVER.listen(Config.server.port, () => Logging.info(NAMESPACE, `Server running on ${Config.server.hostname}:${Config.server.port}`));
