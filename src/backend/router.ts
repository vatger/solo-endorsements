import { Request, Response, Router } from 'express';

import authController from './controllers/auth.controller';
import endorsementController from './controllers/endorsement.controller';
import metaController from './controllers/meta.controller';
import stationController from './controllers/station.controller';
import authMiddleware from './middleware/auth.middleware';

const router = Router();

router.get('/config/frontend', metaController.getFrontendConfig);

router.get('/auth/login', authController.authUser);
router.get('/auth/logout', authController.logoutUser);
router.get('/auth/profile', authMiddleware, authController.getProfile);

router.get('/station', authMiddleware, stationController.getStations);
router.post('/station', authMiddleware, stationController.addStation);
router.patch('/station/:id', authMiddleware, stationController.updateStation);
router.delete('/station/:id', authMiddleware, stationController.deleteStation);

router.get('/solos', authMiddleware, endorsementController.getSoloEndorsements);
router.post('/solos', authMiddleware, endorsementController.addSoloEndorsement);
router.patch('/solos/extend/:id', authMiddleware, endorsementController.extendSoloEndorsement);
router.delete('/solos/:id', authMiddleware, endorsementController.deleteSoloEndorsement);

router.use((req: Request, res: Response) => {
  // 404
  res.status(404).json({ msg: 'the requested resource could not be found' });
});

export default { router };
