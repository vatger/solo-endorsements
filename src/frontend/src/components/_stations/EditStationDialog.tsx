import { Button } from 'primereact/button';
import { Chips } from 'primereact/chips';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { useEffect, useState } from 'react';

import stationService from '../../services/station.service';

import { Station } from '@/shared/interfaces/station.interface';

function arraysContainSameData(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  const sortedArr1 = arr1.slice().sort();
  const sortedArr2 = arr2.slice().sort();

  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false;
    }
  }

  return true;
}

function EditStationDialog({ station, onCompleted }: { station: Station | null, onCompleted: () => void }) {
  if (station === null) {
    return <> Error: Station undefined </>;
  }

  // ui states
  const [name, setName] = useState<string>(station.name);
  const [subStations, setSubStations] = useState<string[]>(station.subStations);
  const [fir, setFir] = useState<string[]>(station.fir);

  const [dataHasChanged, setDataHasChanged] = useState<boolean>(false);
  const [buttonSeverity, setButtonSeverity] = useState<'success' | 'warning' | 'danger'>('warning');

  useEffect(() => {
    setDataHasChanged(!arraysContainSameData(station.subStations, subStations) || station.name !== name);

    const entriesAreInvalid = fir.length === 0 || subStations.length === 0 || name.trim().length === 0;
    if (entriesAreInvalid) {
      setButtonSeverity('danger');
    } else if (!dataHasChanged) {
      setButtonSeverity('warning');
    } else {
      setButtonSeverity('success');
    }
  }, [subStations, name, fir, buttonSeverity]);

  const submitClick = () => {
    if (!dataHasChanged || fir.length === 0) {
      onCompleted();
    }

    const updatedStation: Station = { _id: station._id, name: name, subStations: subStations, fir: fir };

    stationService.updateStation(updatedStation).then(() => { onCompleted(); });
  };

  return (
    <>
      <div className="p-inputgroup flex-1" >
        <span className="p-inputgroup-addon">
          <i className="pi pi-database"></i>
        </span>
        <InputText value={name} style={{ maxWidth: '8rem' }} onChange={(e) => { setName(e.target.value); }} />
        <Chips value={subStations} onChange={(e) => setSubStations(e.value as string[])} style={{ height: '20%' }} separator="," />
        <MultiSelect placeholder='FIRs' options={['EDGG', 'EDWW', 'EDMM']} value={fir} onChange={(e) => setFir(e.target.value)} style={{ minWidth: '15rem' }} virtualScrollerOptions={{ itemSize: 43 }} />
      </div>
      <Divider />
      <div className="p-inputgroup flex-1">
        <Button
          label='Submit'
          tooltip={dataHasChanged === true ? '' : 'No change to submit'}
          severity={buttonSeverity}
          style={{ width: '100%' }}
          onClick={submitClick}
        />
      </div>
    </>
  );
}

export default EditStationDialog;
