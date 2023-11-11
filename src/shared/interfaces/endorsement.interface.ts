import { Station } from './station.interface';

export interface UserEndorsement {
  vatsim_id: number;
  soloEndorsement: {
    station: string | Station,
    startDate: Date,
    endDate: Date,
    completedDays: number,
    maxDays: number,
  }
}
