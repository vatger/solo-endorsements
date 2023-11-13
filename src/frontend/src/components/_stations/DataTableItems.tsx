import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { useState } from 'react';

import { calculateDayDifference } from '../../../../shared/utils/date.util';
import endorsementService from '../../services/endorsement.service';

import { UserEndorsement } from '@/shared/interfaces/endorsement.interface';

export function completedDays(rowData: UserEndorsement) {
  const totalCompletedDays = calculateDayDifference(rowData.soloEndorsement.startDate, new Date()) + rowData.soloEndorsement.completedDays;

  if (totalCompletedDays < 0) {
    return `Solo begins in ${-totalCompletedDays} Days`;
  }

  const maxSoloLength = String(rowData.soloEndorsement.maxDays);

  return `${totalCompletedDays}` + '/' + maxSoloLength;
}

export function remainingDays(rowData: UserEndorsement) {

  const remainingSoloDays = calculateDayDifference(new Date(), rowData.soloEndorsement.endDate);

  if (remainingSoloDays < 0) {
    return 'Solo has ended.';
  }

  return `${remainingSoloDays}`;
}

export function Actions({ rowData, onCompleted }: { rowData: UserEndorsement, onCompleted: () => void }) {

  const [disableExtendButton, setDisableExtendButton] = useState<boolean>(false);
  const [disableDeleteButton, setDisableDeleteButton] = useState<boolean>(false);
  const totalCompletedDays = calculateDayDifference(rowData.soloEndorsement.startDate, new Date()) + rowData.soloEndorsement.completedDays;
  const remainingSoloDays = rowData.soloEndorsement.maxDays - totalCompletedDays;
  const severity = remainingSoloDays >= 30 ? 'success' : (remainingSoloDays > 0 ? 'warning' : 'danger');

  const extendSolo = () => {
    endorsementService.extendSoloEndorsement(rowData, remainingSoloDays > 30 ? 30 : remainingSoloDays).then(() => { setDisableExtendButton(false); onCompleted(); });
  };

  const deleteSolo = () => {
    endorsementService.deleteSoloEndorsement(rowData).then(() => { setDisableDeleteButton(false); onCompleted(); });
  };

  return (
    <>
      <div className="p-inputgroup flex-1">
        <Button
          label='Extend Endorsement'
          severity={severity}
          icon='pi pi-calendar-plus'
          onClick={() => { extendSolo(); setDisableExtendButton(true); }}
          disabled={disableExtendButton} />
        <Button
          label='Delete Endorsement'
          severity='danger'
          icon='pi pi-trash'
          onClick={() => { deleteSolo(); setDisableDeleteButton(true); }}
          disabled={disableDeleteButton}
        />
      </div>
    </>
  );
}
