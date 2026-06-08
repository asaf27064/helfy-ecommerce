import { Router } from 'express';
import { z } from 'zod';
import validate from '../middleware/validate.js';
import requireAuth from '../middleware/requireAuth.js';
import * as ctrl from '../controllers/auth.controller.js';

const registerSchema = z.object({
  email:     z.string().email(),
  password:  z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().max(100).optional(),
  lastName:  z.string().max(100).optional(),
});

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

const router = Router();
router.post('/register', validate(registerSchema), ctrl.register);
router.post('/login', validate(loginSchema), ctrl.login);
router.get('/me', requireAuth, ctrl.me);

export default router;
