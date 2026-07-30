import {Router} from 'express';
import {requireAuth} from '../middleware/auth';
import {getClassDetail} from '../controllers/classes';
const router = Router();


router.get('/:classId', requireAuth, getClassDetail);




export default router;
