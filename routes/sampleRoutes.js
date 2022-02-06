import express from 'express';
import { getHelloWorld } from '../controllers/sampleController.js';

const sampleRouter = express.Router();

sampleRouter.get('/sample', getHelloWorld);

export default sampleRouter;
