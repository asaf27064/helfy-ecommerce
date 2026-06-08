import { Router } from 'express';
import { z } from 'zod';
import validate from '../middleware/validate.js';
import requireAuth from '../middleware/requireAuth.js';
import * as ctrl from '../controllers/order.controller.js';

// Shipping details captured at checkout and snapshotted onto the order.
const checkoutSchema = z.object({
  name:       z.string().min(1, 'Name is required').max(200),
  street1:    z.string().min(1, 'Street is required').max(200),
  street2:    z.string().max(200).optional(),
  city:       z.string().min(1, 'City is required').max(100),
  state:      z.string().max(100).optional().default(''),
  postalCode: z.string().min(1, 'Postal code is required').max(20),
  country:    z.string().min(1, 'Country is required').max(100),
});

const router = Router();
router.use(requireAuth);
router.post('/', validate(checkoutSchema), ctrl.create);
router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);

export default router;
