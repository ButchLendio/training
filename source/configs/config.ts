import Dotenv from 'dotenv';
import Mongo from './mongo';
import Jwt from './jwt';

Dotenv.config();

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 8000;

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT
};

const config = {
    server: SERVER,
    mongo: Mongo,
    token: Jwt
};

export default config;
