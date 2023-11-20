import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { TabMenu } from 'primereact/tabmenu';
import { InputText } from 'primereact/inputtext';
import { useContext, useEffect, useState } from 'react';

import AuthContext from '../contexts/AuthProvider';
import { AuthWrapper } from '../contexts/AuthWrapper';
import endorsementService from '../services/endorsement.service';
import stationService from '../services/station.service';

import AddSoloEndorsementDialog from './_soloEndorsements/AddSoloEndorsementDialog';
import { Actions, remainingDays, userID } from './_stations/DataTableItems';
import { RenderIf } from './conditionals/RenderIf';

import { UserEndorsement } from '@/shared/interfaces/endorsement.interface';
import { FIR } from '@/shared/interfaces/fir.interface';
import { Station } from '@/shared/interfaces/station.interface';
import User from '@/shared/interfaces/user.interface';

function SoloEndorsements() {
  const auth: any = useContext(AuthContext);
  const [user, setUser] = useState<User>();
  useEffect(() => {
    setUser(auth.auth.user);
  }, [auth]);

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

  const [searchTerm, setSearchTerm] = useState('');

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
            extensionNumber: element.soloEndorsement.extensionNumber,
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

  useEffect(() => { updateEndorsementData(); updateStationData(); }, [auth]);

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
      <AuthWrapper>
        <RenderIf truthValue={user?.soloManagement.isMentor === true} elementTrue={
          <Dialog visible={AddDialogVisibility} onHide={() => setAddDialogVisibility(false)}>
            <AddSoloEndorsementDialog onCompleted={() => { setAddDialogVisibility(false); updateEndorsementData(); }} firData={filteredFirData} />
          </Dialog>} />
        <RenderIf truthValue={user?.soloManagement.isAdmin === true || user?.soloManagement.isMentor === true} elementTrue={
          <div style={{ display: 'flex' }}>
            <Button
              icon='pi pi-plus'
              label='Add Solo Endorsement'
              severity='success'
              style={{ minWidth: '100%' }}
              onClick={() => { setAddDialogVisibility(true); }} />
            <InputText value={searchTerm} onChange={handleSearch} placeholder="Search..." />
          </div>} />
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
        <DataTable sortField="soloEndorsement.endDate" sortOrder={1} value={filteredSoloData}>
          <Column
            body={userID}
            header='ID' field='vatsim_id'
            sortable
            align='center'
            filter />
          <Column
            header='Station'
            field='soloEndorsement.station.name'
            sortable
            align='center' />
          <Column
            header='Start Date'
            field='soloEndorsement.startDate'
            body={(rowData: UserEndorsement) => { return rowData.soloEndorsement.startDate.toLocaleDateString(); }}
            sortable
            align='center' />
          <Column
            header='End date'
            field='soloEndorsement.endDate'
            body={(rowData: UserEndorsement) => { return rowData.soloEndorsement.endDate.toLocaleDateString(); }}
            sortable
            align='center' />
          <Column
            header='Remaining days'
            field='soloEndorsement.endDate'
            body={remainingDays}
            sortable
            align='center' />
          <Column
            header='Extension Number'
            field='soloEndorsement.extensionNumber'
            sortable
            align='center' />
          <Column header='Actions' body={(rowData: UserEndorsement) => {
            return <Actions rowData={rowData} onCompleted={updateEndorsementData} />;
          }} hidden={user?.soloManagement.isMentor === false && user?.soloManagement.isAdmin === false} />
        </DataTable>
      </AuthWrapper>
    </>
  );
}

export default SoloEndorsements;
