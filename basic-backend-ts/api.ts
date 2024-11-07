import express from 'express';
import cors from 'cors';

import { echoController } from "./controllers/echo.js";
import { logRequest } from "./util/logger.js";

export const router = express.Router();

router.use(cors());
router.use(express.json());
router.use(logRequest);

router.use('/echo', echoController);

router.use((_req, res) => {
    res.status(404);
    res.json({ message: 'Route does not exist' });
});

export { router as apiRouter };
