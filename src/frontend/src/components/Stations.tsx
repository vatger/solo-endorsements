import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { TabMenu } from 'primereact/tabmenu';
import { useEffect, useState } from 'react';

import { PermissionWrapper } from '../contexts/PermissionWrapper';
import stationService from '../services/station.service';

import AddStationDialog from './_stations/AddStationDialog';
import EditStationDialog from './_stations/EditStationDialog';

import { Station } from '@/shared/interfaces/station.interface';

function Stations() {
  const [stationData, setStationData] = useState<Station[]>([]);
  const [filteredData, setFilteredData] = useState<Station[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [fir, setFir] = useState<'EDGG' | 'EDWW' | 'EDMM'>('EDGG');

  const [AddDialogVisibility, setAddDialogVisibility] = useState<boolean>(false);

  const [EditDialogVisibility, setEditDialogVisibility] = useState<boolean>(false);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  useEffect(() => {
    // Filter the stationData based on the condition
    setFilteredData(
      stationData.filter((station) => {
        return station.fir?.includes(fir);
      }),
    );
  }, [stationData, fir]);

  const updateStationData = () => {
    stationService.getStations().then((data: Station[]) => {
      if (data === undefined) {
        return;
      }

      const convertedData: Station[] = data.map((element: Station) => {
        return {
          _id: element._id,
          name: element.name,
          subStations: element.subStations as string[],
          fir: element.fir as string[],
        };
      });

      setStationData(convertedData);
    });
  };

  useEffect(() => updateStationData(), []);

  const formatSubStations = (subStations: string[]) => {
    subStations = [...subStations].sort();
    return subStations.join(', ');
  };

  const actionsTemplate = (station: Station) => {
    const accept = () => {
      stationService.deleteStation(station).then(() => { updateStationData(); });
    };

    const confirm = () => {
      confirmDialog({
        message: 'Do you want to delete this record? \n Deleting it will also delete any endorsement referencing this station.',
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        acceptClassName: 'p-button-danger',
        accept,
      });
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Button
          severity="warning"
          icon="pi pi-file-edit"
          tooltip='Edit'
          tooltipOptions={{ position: 'left' }}
          onClick={() => { setEditDialogVisibility(true); setSelectedStation(station); }}
          style={{ marginRight: '5%' }}
        />
        <Button
          severity="danger"
          icon="pi pi-trash"
          tooltipOptions={{ position: 'left' }}
          onClick={confirm}
        />
      </div>
    );
  };

  return (
    <>
      <PermissionWrapper requiredPermission={'Mentor'}>
        <ConfirmDialog />
        <Dialog visible={AddDialogVisibility} onHide={() => setAddDialogVisibility(false)}>
          <AddStationDialog onCompleted={() => { setAddDialogVisibility(false); updateStationData(); }} />
        </Dialog>
        <Dialog visible={EditDialogVisibility} onHide={() => setEditDialogVisibility(false)}>
          <EditStationDialog station={selectedStation} onCompleted={() => { setEditDialogVisibility(false); updateStationData(); }} />
        </Dialog>
        <TabMenu model={[
          { label: 'EDGG' },
          { label: 'EDMM' },
          { label: 'EDWW' },
        ]}
          activeIndex={activeIndex}
          onTabChange={(e) => { setFir(e.value.label as 'EDGG' | 'EDWW' | 'EDMM'); setActiveIndex(e.index); }}
        />
        <div style={{ display: 'flex' }}>
          <Button
            icon='pi pi-plus'
            label='Add Station'
            severity='success'
            style={{ minWidth: '90%' }}
            onClick={() => { setAddDialogVisibility(true); }} />
          <Button
            icon='pi pi-refresh'
            severity='warning'
            style={{ minWidth: '10%' }}
            onClick={() => { updateStationData(); }}
          />
        </div>
        <DataTable header='Stations' value={filteredData}>
          <Column field='name' header='Name' />
          <Column field="subStations" header="Substations" body={(station: Station) => formatSubStations(station.subStations)} />
          <Column header="Actions" body={actionsTemplate} />
        </DataTable>
      </PermissionWrapper>
    </>
  );
}

export default Stations;
