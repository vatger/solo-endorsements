import { NextFunction, Request, Response } from 'express';

import endorsementService from '../services/endorsement.service';

async function getSoloEndorsements(req: Request, res: Response, next: NextFunction) {
  try {
    const userEndorsements = await endorsementService.getSoloEndorsements();

    res.json(userEndorsements);
  } catch (error) {
    next(error);
  }
}

async function addSoloEndorsement(req: Request, res: Response, next: NextFunction) {
  try {
    await endorsementService.addSoloEndorsement(req.body.endorsement);
  } catch (error) {
    next(error);
  }
}

export default { getSoloEndorsements, addSoloEndorsement };
