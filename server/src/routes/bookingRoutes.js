import { Router } from 'express';
import {
  createBooking,
  listMyBookings,
  getBooking,
  updateBooking,
  cancelBooking,
} from '../controllers/bookingController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth); // every booking route needs a logged-in user

router.post('/', createBooking);
router.get('/mine', listMyBookings); // must come before '/:id'
router.get('/:id', getBooking);
router.patch('/:id', updateBooking);
router.delete('/:id', cancelBooking);

export default router;