import axios from 'axios';

import { Station } from '@/shared/interfaces/station.interface';


async function getStations() {
  try {
    const response = await axios.get('/api/v1/station');

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function addStation(station: Station) {
  try {
    const response = await axios.post('/api/v1/station', { station });

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function updateStation(station: Station) {
  try {
    const response = await axios.patch('/api/v1/station/' + station._id, { station });

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function deleteStation(station: Station) {
  try {
    const response = await axios.delete('/api/v1/station/' + station._id);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export default { getStations, addStation, updateStation, deleteStation };
