import { Router } from 'express';
import { listServices, getService } from '../controllers/serviceController.js';

const router = Router();

router.get('/', listServices);
router.get('/:id', getService);

export default router;