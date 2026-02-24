import { Router } from 'express';
import { searchDonors } from '../controllers/donorController.js';
import requireAuth from '../middleware/auth.js';

const router = Router();

router.post('/search', requireAuth, searchDonors);

export default router;
