import { Router } from 'express';
import { z } from 'zod';
import validate from '../middleware/validate.js';
import requireAuth from '../middleware/requireAuth.js';
import * as ctrl from '../controllers/cart.controller.js';

const addSchema = z.object({
  productId: z.coerce.number().int().positive(),
  quantity:  z.coerce.number().int().positive().max(99).default(1),
});

const updateSchema = z.object({
  quantity: z.coerce.number().int().min(1).max(99),
});

const router = Router();
router.use(requireAuth);
router.get('/', ctrl.getCart);
router.post('/items', validate(addSchema), ctrl.addItem);
router.patch('/items/:id', validate(updateSchema), ctrl.updateItem);
router.delete('/items/:id', ctrl.removeItem);

export default router;
