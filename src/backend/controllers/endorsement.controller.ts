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
    const userEndorsement = await endorsementService.addSoloEndorsement(req.body.endorsement);

    res.json(userEndorsement);
  } catch (error) {
    next(error);
  }
}

async function extendSoloEndorsement(req: Request, res: Response, next: NextFunction) {
  try {
    const userEndorsement = await endorsementService.extendSoloEndorsement(req.body.endorsement);

    res.json(userEndorsement);
  } catch (error) {
    next(error);
  }
}

async function pauseSoloEndorsement(req: Request, res: Response, next: NextFunction) {
  try {
    const userEndorsement = await endorsementService.pauseSoloEndorsement(req.params.id);

    res.json(userEndorsement);
  } catch (error) {
    next(error);
  }
}

async function deleteSoloEndorsement(req: Request, res: Response, next: NextFunction) {
  try {
    const userEndorsement = await endorsementService.deleteSoloEndorsement(req.params.id);

    res.json(userEndorsement);
  } catch (error) {
    next(error);
  }
}

export default { getSoloEndorsements, addSoloEndorsement, extendSoloEndorsement, pauseSoloEndorsement, deleteSoloEndorsement };
