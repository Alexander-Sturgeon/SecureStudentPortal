import {Router} from 'express';
import {requireAuth, requireTeacher} from '../middleware/auth';
import {getClassDetail, getClasses} from '../controllers/classes';
import {addLecture} from '../controllers/lectures';

const router = Router();


router.get('/', requireAuth, getClasses);
router.get('/:classId', requireAuth, getClassDetail);
router.post('/:classId/lectures', requireAuth, requireTeacher, addLecture);



export default router;
