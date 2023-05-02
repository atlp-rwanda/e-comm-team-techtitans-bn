import express from 'express';

import checkStats from '../controllers/statistics/statistics.controller';

const statsRouter = express.Router();
statsRouter.get('/check-stats', checkStats);

export default statsRouter;
