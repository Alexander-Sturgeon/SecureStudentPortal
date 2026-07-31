import {Router} from 'express';
import {requireAuth} from '../middleware/auth';
import {uploadSubmission} from '../middleware/upload';
import {submitAssignment} from '../controllers/submissions';
const router = Router();


//Authenticate first so an unauthenticated request never gets a file written
router.post('/:assignmentId/submit', requireAuth, uploadSubmission, submitAssignment);




export default router;
