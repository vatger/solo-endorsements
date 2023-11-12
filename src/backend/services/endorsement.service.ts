import endorsementModel, { UserEndorsementDocument } from '../models/endorsement.model';
import stationModel from '../models/station.model';

import { UserEndorsement } from '@/shared/interfaces/endorsement.interface';
import { Station } from '@/shared/interfaces/station.interface';

async function getSoloEndorsements() {
  try {
    const userEntries: UserEndorsement[] = await endorsementModel.find().exec();

    const userEndorsements: UserEndorsement[] = [];
    for (const user of userEntries) {
      const station = await stationModel.findById(user.soloEndorsement.station._id);

      const userEndorsement: UserEndorsement = {
        vatsim_id: user.vatsim_id,
        soloEndorsement: {
          station: station as Station,
          startDate: user.soloEndorsement.startDate,
          endDate: user.soloEndorsement.endDate,
          completedDays: user.soloEndorsement.completedDays,
          maxDays: user.soloEndorsement.maxDays,
        },
      };
      userEndorsements.push(userEndorsement);
    }
    return userEndorsements;
  } catch (error) {
    console.error(error);
  }
}

async function addSoloEndorsement(endorsement: UserEndorsement) {
  try {
    let user: UserEndorsementDocument | null = await endorsementModel.findOne({ 'vatsim_id': endorsement.vatsim_id });

    if (!user) {
      user = new endorsementModel(endorsement);
    }
    console.log(user);
    await user.save();
  } catch (error) {
    console.error(error);
  }
}

export default { getSoloEndorsements, addSoloEndorsement };
