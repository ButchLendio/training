import { Request, Response, NextFunction } from 'express';
import Logging from '../configs/logging';

const NAMESPACE = 'Sample Controller';

const getAllBooks = (req: Request, res: Response, next: NextFunction) => {
    Logging.info(NAMESPACE, 'Sample health check route called.');

    return res.status(200).json({
        message: 'pong'
    });
};

export default { getAllBooks };
