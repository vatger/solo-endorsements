import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { useEffect, useState } from 'react';

import stationService from '../../services/station.service';

function StationAddDialog({ onCompleted }: { onCompleted: () => void }) {
  // ui states
  const [name, setName] = useState<string>('');
  const [subStations, setSubStations] = useState<string>('');
  const [fir, setFir] = useState<string[]>([]);

  const [isDataValid, setIsDataValid] = useState<boolean>(false);

  useEffect(() => {
    setIsDataValid(name.trim().length !== 0 && subStations.trim().length !== 0 && fir.length !== 0);
  }, [name, subStations, fir]);

  const submitClick = () => {
    if (isDataValid === false) {
      return;
    }

    // send data
    // split data from InputText by , or ; and remove all entries consisting only of spaces
    const splitSubstations = subStations.split(/[;,]+/).filter(entry => entry.trim().length > 0);

    //@ts-ignore
    const station: Station = {
      name: name,
      subStations: splitSubstations,
      fir: fir,
    };

    stationService.addStation(station).then(() => { onCompleted(); });
  };

  return (
    <>
      <div className="p-inputgroup flex-1">
        <span className="p-inputgroup-addon">
          <i className="pi pi-database"></i>
        </span>
        <InputText placeholder="Name" value={name} style={{ maxWidth: '10rem' }} onChange={(e) => { setName(e.target.value); }} />
        <InputText placeholder="Substations - separated by ; or ," value={subStations} style={{ minWidth: '18rem' }} onChange={(e) => { setSubStations(e.target.value); }} />
        <MultiSelect placeholder='FIRs' options={['EDGG', 'EDWW', 'EDMM']} value={fir} onChange={(e) => setFir(e.target.value)} style={{ minWidth: '15rem' }} />
      </div>
      <Divider />
      <div className="p-inputgroup flex-1">
        <Button
          label='Submit'
          tooltip={isDataValid === true ? '' : 'Name, substations and FIR must be set'}
          severity={isDataValid === true ? 'success' : 'danger'}
          style={{ width: '100%' }}
          onClick={submitClick}
        />
      </div>
    </>
  );
}

export default StationAddDialog;
