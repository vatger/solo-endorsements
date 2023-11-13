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

    await user.save();

    return user;
  } catch (error) {
    console.error(error);
  }
}

async function extendSoloEndorsement(endorsement: UserEndorsement, requestedExtensionDays: number) {
  try {
    const user: UserEndorsementDocument | null = await endorsementModel.findOne({ vatsim_id: endorsement.vatsim_id });

    if (!user) {
      return;
    }

    // calculate the maximum of days for that an extension can be granted
    const daysUsed = calculateDayDifference(user.soloEndorsement.startDate, user.soloEndorsement.endDate) + user.soloEndorsement.completedDays;

    const remainingDaysOfSolo = user.soloEndorsement.maxDays - daysUsed;

    if (remainingDaysOfSolo < requestedExtensionDays) {
      // requestedExtensionDays exceeds remainingDaysOfSolo, an extension cannot be granted
      return;
    }

    const newEndDate = addDaysToDate(user.soloEndorsement.endDate, requestedExtensionDays);

    user.soloEndorsement.endDate = newEndDate;

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
