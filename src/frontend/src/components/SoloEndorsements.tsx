import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { TabMenu } from 'primereact/tabmenu';
import { useEffect, useState } from 'react';

import endorsementService from '../services/endorsement.service';
import stationService from '../services/station.service';

import AddSoloEndorsementDialog from './_soloEndorsements/AddSoloEndorsementDialog';

import { UserEndorsement } from '@/shared/interfaces/endorsement.interface';
import { FIR } from '@/shared/interfaces/fir.interface';
import { Station } from '@/shared/interfaces/station.interface';

function SoloEndorsements() {
  // ui states
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [fir, setFir] = useState<'EDGG' | 'EDWW' | 'EDMM' | 'All'>('All');

  const [AddDialogVisibility, setAddDialogVisibility] = useState<boolean>(false);

  // data
  const [soloData, setSoloData] = useState<UserEndorsement[]>([]);
  const [filteredSoloData, setFilteredSoloData] = useState<UserEndorsement[]>([]);

  const [stationData, setStationData] = useState<Station[]>([]);
  const [firData, setFirData] = useState<FIR[]>([]);
  const [filteredFirData, setFilteredFirData] = useState<FIR[]>([]);

  const updateEndorsementData = () => {
    endorsementService.getSoloEndorsements().then((data: UserEndorsement[]) => {
      if (data === undefined || !Array.isArray(data) || typeof data === 'string') {
        return;
      }

      const convertedData: UserEndorsement[] = data.map((element: UserEndorsement) => {
        return {
          vatsim_id: element.vatsim_id,
          endorsements: [],
          soloEndorsement: {
            station: element.soloEndorsement.station as Station,
            startDate: new Date(element.soloEndorsement.startDate),
            endDate: new Date(element.soloEndorsement.endDate),
            completedDays: element.soloEndorsement.completedDays,
            maxDays: element.soloEndorsement.maxDays,
          },
        };
      });

      setSoloData(convertedData.sort((a, b) => a.vatsim_id - b.vatsim_id));
    });
  };

  const updateStationData = () => {
    stationService.getStations().then((data: Station[]) => {
      if (data === undefined || !Array.isArray(data)) {
        return;
      }

      const convertedData: Station[] = data.map((element: Station) => {
        return {
          _id: element._id,
          name: element.name,
          fir: element.fir,
          subStations: element.subStations,
        };
      });

      setStationData(convertedData);
    });
  };

  useEffect(() => { updateEndorsementData(); updateStationData(); }, []);

  useEffect(() => {
    if (soloData.length === 0 || !soloData) { return; }

    if (fir === 'All') {
      setFilteredSoloData(soloData);
      return;
    }

    const filteredData = soloData.filter((element: UserEndorsement) => element.soloEndorsement.station.fir.includes(fir));

    setFilteredSoloData(filteredData);
  }, [soloData, fir]);


  useEffect(() => {
    const FIRs: FIR[] = [
      { name: 'EDGG', stations: [] as Station[] },
      { name: 'EDWW', stations: [] as Station[] },
      { name: 'EDMM', stations: [] as Station[] },
    ];

    for (const station of stationData) {
      for (const firElement of FIRs) {
        if (station.fir.includes(firElement.name)) {
          firElement.stations.push(station);
        }
      }
    }

    setFirData(FIRs);
  }, [stationData]);

  useEffect(() => {
    if (firData.length === 0 || !firData) { return; }

    if (fir === 'All' || activeIndex === 0) {
      setFilteredFirData(firData);
      return;
    }

    const filteredData = firData.filter((element: FIR) => element.name === fir);
    setFilteredFirData(filteredData);
  }, [firData, fir, activeIndex]);

  return (
    <>
      <Dialog visible={AddDialogVisibility} onHide={() => setAddDialogVisibility(false)}>
        <AddSoloEndorsementDialog onCompleted={() => { setAddDialogVisibility(false); updateEndorsementData(); }} firData={filteredFirData} />
      </Dialog>
      <TabMenu
        model={[
          { label: 'All' },
          { label: 'EDGG' },
          { label: 'EDMM' },
          { label: 'EDWW' },
        ]}
        activeIndex={activeIndex}
        onTabChange={(e) => { setFir(e.value.label as 'EDGG' | 'EDWW' | 'EDMM' | 'All'); setActiveIndex(e.index); }}
      />
      <div style={{ display: 'flex' }}>
        <Button
          icon='pi pi-plus'
          label='Add Solo Endorsement'
          severity='success'
          style={{ minWidth: '100%' }}
          onClick={() => { setAddDialogVisibility(true); }} />
      </div>
      <DataTable value={filteredSoloData}>
        <Column header='ID' field='vatsim_id' />
        <Column header='Station' body={(rowData: UserEndorsement) => { return rowData.soloEndorsement.station.name; }} />
        <Column header='Start Date' body={(rowData: UserEndorsement) => { return rowData.soloEndorsement.startDate.toLocaleDateString(); }} />
        <Column header='End date' body={(rowData: UserEndorsement) => { return rowData.soloEndorsement.endDate.toLocaleDateString(); }} />
        <Column header='Completed days' body={(rowData: UserEndorsement) => { return String(rowData.soloEndorsement.completedDays) + '/' + String(rowData.soloEndorsement.maxDays); }} />
      </DataTable>
    </>
  );
}

export default SoloEndorsements;
