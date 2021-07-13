const MONGO_SETTINGS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    // socketTimeoutMS: 30_000,
    keepAlive: true,
    poolSize: 50,
    autoIndex: false,
    retryWrites: false
};

const MONGO_USERNAME = process.env.MONGO_USERNAME || 'admin';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || 'admin';
const MONGO_DB = process.env.MONGO_DB || 'Testing';
const MONGO_HOST = process.env.MONGO_URL || `testing.sgatu.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`;

const MONGO = {
    host: MONGO_HOST,
    username: MONGO_USERNAME,
    password: MONGO_PASSWORD,
    options: MONGO_SETTINGS,
    url: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}`
};

export default MONGO;
