import mongoose, { HydratedDocument } from 'mongoose';

import { Station } from '@/shared/interfaces/station.interface';

export type StationDocument = HydratedDocument<Station>;

const stationSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    subStations: { type: [String], default: [] },
    fir: { type: [String], default: [] },
  },
  { timestamps: true },
);

export default mongoose.model<StationDocument>('Stations', stationSchema);
