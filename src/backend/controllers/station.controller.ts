import { NextFunction, Request, Response } from 'express';

import stationService from '../services/station.service';

async function getStations(req: Request, res: Response, next: NextFunction) {
  try {
    const stations = await stationService.getStations();

    res.json(stations);
  } catch (error) {
    next(error);
  }
}

async function addStation(req: Request, res: Response, next: NextFunction) {
  try {
    console.log(req.body.station);

    const station = await stationService.addStation(req.body.station);

    res.json(station);
  } catch (error) {
    next(error);
  }
}

async function updateStation(req: Request, res: Response, next: NextFunction) {
  try {
    const station = stationService.updateStation(req.body.station);

    res.json(station);
  } catch (error) {
    next(error);
  }
}

async function deleteStation(req: Request, res: Response, next: NextFunction) {
  try {
    const station = stationService.deleteStation(req.params.id);

    res.json(station);
  } catch (error) {
    next(error);
  }
}

export default { getStations, addStation, updateStation, deleteStation };
