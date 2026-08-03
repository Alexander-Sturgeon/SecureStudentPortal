import {Router} from 'express';
import {requireAuth} from '../middleware/auth';
import {getClassDetail, getClasses} from '../controllers/classes';
const router = Router();


router.get('/', requireAuth, getClasses);
router.get('/:classId', requireAuth, getClassDetail);




export default router;
