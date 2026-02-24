import { Router } from 'express';
import { getProfile } from '../controllers/userController.js';
import requireAuth from '../middleware/auth.js';

const router = Router();

router.get('/profile', requireAuth, getProfile);

export default router;
