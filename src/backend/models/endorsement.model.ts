import mongoose, { HydratedDocument } from 'mongoose';

import { UserEndorsement } from '@/shared/interfaces/endorsement.interface';

export type UserEndorsementDocument = HydratedDocument<UserEndorsement>;

const userEndorsementSchema = new mongoose.Schema(
  {
    vatsim_id: { type: Number, unique: true },
    soloEndorsement: {
      station: { type: mongoose.Schema.Types.ObjectId, ref: 'Station' },
      startDate: { type: Date, default: '' },
      endDate: { type: Date, default: '' },
      completedDays: { type: Number, default: 0 },
      extensionNumber: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

export default mongoose.model<UserEndorsementDocument>('Endorsements', userEndorsementSchema);
