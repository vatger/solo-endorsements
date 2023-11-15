import { Button } from 'primereact/button';
import { useState } from 'react';

import { calculateDayDifference } from '../../../../shared/utils/date.util';
import endorsementService from '../../services/endorsement.service';

import { UserEndorsement } from '@/shared/interfaces/endorsement.interface';

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
  const maxExtensionsReached = rowData.soloEndorsement.extensionNumber >= 2;
  const severity = !maxExtensionsReached ? 'success' : 'danger';

  const extendSolo = () => {
    endorsementService.extendSoloEndorsement(rowData).then(() => { setDisableExtendButton(false); onCompleted(); });
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
          tooltip={maxExtensionsReached ? 'Solo can not be extended, max extensions reached' : ''}
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
