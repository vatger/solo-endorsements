import axios from 'axios';

import { UserEndorsement } from '@/shared/interfaces/endorsement.interface';

async function getSoloEndorsements() {
  try {
    const response = await axios.get('/api/v1/solos');

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function addSoloEndorsement(endorsement: UserEndorsement) {
  try {
    const response = await axios.post('/api/v1/solos', { endorsement });

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function extendSoloEndorsement(endorsement: UserEndorsement, extension: number) {
  try {
    const response = await axios.patch('/api/v1/solos/extend/' + endorsement.vatsim_id, { endorsement, extension });

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function deleteSoloEndorsement(endorsement: UserEndorsement) {
  try {
    const response = await axios.delete('/api/v1/solos/' + endorsement.vatsim_id);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export default { getSoloEndorsements, addSoloEndorsement, extendSoloEndorsement, deleteSoloEndorsement };
