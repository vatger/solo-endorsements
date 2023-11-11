import stationModel, { StationDocument } from '../models/station.model';

import { Station } from '@/shared/interfaces/station.interface';

async function getStations() {
  try {
    const stations: Station[] = await stationModel.find().exec();

    return stations;
  } catch (error) {
    console.error(error);
  }
}

async function addStation(station: Station) {
  try {
    const newStation = new stationModel(station);
    const savedStation = await newStation.save();
    return savedStation;
  } catch (error) {
    console.error(error);
  }
}

async function updateStation(station: Station) {
  try {
    const existingStation: StationDocument | null = await stationModel.findById(station._id);

    if (!existingStation) {
      return undefined;
    }

    existingStation.name = station.name;
    existingStation.subStations = station.subStations;
    existingStation.fir = station.fir;

    await existingStation.save();

  } catch (error) {
    console.error(error);
  }
}

async function deleteStation(id: string) {
  try {
    const deletedStation = await stationModel.findByIdAndDelete(id);
    if (!deletedStation) {
      return;
    }
    return deletedStation;

  } catch (error) {
    console.error(error);
  }
}

export default { getStations, addStation, updateStation, deleteStation };
