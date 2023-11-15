import endorsementModel, { UserEndorsementDocument } from '../models/endorsement.model';
import stationModel from '../models/station.model';

import { UserEndorsement } from '@/shared/interfaces/endorsement.interface';
import { Station } from '@/shared/interfaces/station.interface';
import { addDaysToDate, calculateDayDifference } from '@/shared/utils/date.util';

async function getSoloEndorsements() {
  try {
    const userEntries: UserEndorsement[] = await endorsementModel.find().exec();

    const userEndorsements: UserEndorsement[] = [];
    for (const user of userEntries) {
      if (user.soloEndorsement.station === null) {
        continue;
      }

      const station = await stationModel.findById(user.soloEndorsement.station._id);

      if (user.soloEndorsement.endDate.getTime() === new Date(-1).getTime() || user.soloEndorsement.startDate.getTime() === new Date(-1).getTime()) {
        continue;
      }

      const userEndorsement: UserEndorsement = {
        vatsim_id: user.vatsim_id,
        soloEndorsement: {
          station: station as Station,
          startDate: user.soloEndorsement.startDate,
          endDate: user.soloEndorsement.endDate,
          completedDays: user.soloEndorsement.completedDays,
          extensionNumber: user.soloEndorsement.extensionNumber,
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

    // create new endorsement, use saved completedDays from DB
    user.soloEndorsement = {
      station: endorsement.soloEndorsement.station,
      startDate: endorsement.soloEndorsement.startDate,
      endDate: endorsement.soloEndorsement.endDate,
      completedDays: user.soloEndorsement.completedDays,
      extensionNumber: endorsement.soloEndorsement.extensionNumber,
    };

    await user.save();

    return user;
  } catch (error) {
    console.error(error);
  }
}

async function extendSoloEndorsement(endorsement: UserEndorsement) {
  try {
    const user: UserEndorsementDocument | null = await endorsementModel.findOne({ vatsim_id: endorsement.vatsim_id });

    if (!user) {
      return;
    }

    // if two extension have already been granted, do not grant another
    if (user.soloEndorsement.extensionNumber >= 2) {
      return;
    }

    const currentDate = new Date();
    // end date is in past
    if (user.soloEndorsement.endDate < currentDate) {
      // solo endorsement is expired, assign a new startDate and a new endDate
      user.soloEndorsement.startDate = currentDate;
      user.soloEndorsement.endDate = addDaysToDate(currentDate, 30);
    } else {
      // solo endorsement is on-going, extend endDate by thirty days
      user.soloEndorsement.endDate = addDaysToDate(user.soloEndorsement.endDate, 30);
    }

    user.soloEndorsement.extensionNumber += 1;

    await user.save();

    return user;
  } catch (error) {
    console.error(error);
  }
}

async function deleteSoloEndorsement(id: string) {
  try {
    const user: UserEndorsementDocument | null = await endorsementModel.findOne({ vatsim_id: id });

    if (!user) {
      return;
    }

    // calculate used days of solo endorsement
    const usedDays = calculateDayDifference(user.soloEndorsement.startDate, new Date()) + user.soloEndorsement.completedDays;

    user.soloEndorsement.completedDays = usedDays >= 0 ? usedDays : 0;
    user.soloEndorsement.startDate = new Date(-1);
    user.soloEndorsement.endDate = new Date(-1);

    await user.save();

    return user;
  } catch (error) {
    console.error(error);
  }
}

export default { getSoloEndorsements, addSoloEndorsement, extendSoloEndorsement, deleteSoloEndorsement };
