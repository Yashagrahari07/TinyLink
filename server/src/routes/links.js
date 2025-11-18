import express from 'express';
import { createLink, getAllLinks } from '../controllers/linksController.js';

const router = express.Router();

router.post('/links', createLink);
router.get('/links', getAllLinks);

export default router;

