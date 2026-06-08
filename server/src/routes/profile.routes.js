import { Router } from 'express';
import { z } from 'zod';
import validate from '../middleware/validate.js';
import requireAuth from '../middleware/requireAuth.js';
import * as ctrl from '../controllers/profile.controller.js';

const updateSchema = z.object({
  firstName: z.string().max(100).optional().default(''),
  lastName:  z.string().max(100).optional().default(''),
});

const router = Router();
router.use(requireAuth);
router.get('/', ctrl.get);
router.patch('/', validate(updateSchema), ctrl.update);

export default router;
