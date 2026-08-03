import {Router} from 'express';
import {login, logout} from '../controllers/auth';
import {loginLimiter} from '../middleware/rateLimit';
const router = Router();

//loginLimiter used on login route specifically to avoid normal unrelated activities inadvertently counting towards rate limit. 
router.post('/login', loginLimiter, login);
router.post('/logout', logout);




export default router;