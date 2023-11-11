import { Request, Response, Router } from 'express';

import authController from './controllers/auth.controller';
import metaController from './controllers/meta.controller';
import authMiddleware from './middleware/auth.middleware';

const router = Router();

router.get('/config/frontend', metaController.getFrontendConfig);

router.get('/auth/login', authController.authUser);
router.get('/auth/logout', authController.logoutUser);
router.get('/auth/profile', authMiddleware, authController.getProfile);

router.use((req: Request, res: Response) => {
  // 404
  res.status(404).json({ msg: 'the requested resource could not be found' });
});

export default { router };
