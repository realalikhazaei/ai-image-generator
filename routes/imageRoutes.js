import express from 'express';
import { getModels, getImage } from '../controllers/imageController.js';

const router = express.Router();

router.route('/image').get(getModels).post(getImage);

export default router;
