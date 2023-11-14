import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { ListBox, ListBoxChangeEvent } from 'primereact/listbox';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { useEffect, useState } from 'react';

import { addDaysToDate, calculateDayDifference, createDateWithDayOffset } from '../../../../shared/utils/date.util';
import endorsementService from '../../services/endorsement.service';

import { UserEndorsement } from '@/shared/interfaces/endorsement.interface';
import { FIR } from '@/shared/interfaces/fir.interface';
import { Station } from '@/shared/interfaces/station.interface';


function AddSoloEndorsementDialog({ firData, onCompleted }: { firData: FIR[], onCompleted: () => void }) {
  // ui states
  const soloLengthOptions = [30, 180, 0];
  const [soloLength, setSoloLength] = useState(soloLengthOptions[0]);


  const [selectedStation, setSelectedStation] = useState<Station>();
  const [id, setId] = useState<string>('');
  const [selectedStartDate, setSelectedStartDate] = useState<Date>(createDateWithDayOffset(0));
  const [selectedEndDate, setSelectedEndDate] = useState<Date>(createDateWithDayOffset(soloLengthOptions[0]));

  const [disableSubmitButton, setDisableSubmitButton] = useState<boolean>(false);

  const [dataValid, setDataValid] = useState<boolean>(false);
  useEffect(() => {
    const dayDifference = calculateDayDifference(selectedStartDate, selectedEndDate);
    for (const option of soloLengthOptions) {
      if (option === dayDifference) {
        setSoloLength(option);
        return;
      }
    }

    setSoloLength(0);
  }, [selectedEndDate]);

  useEffect(() => {
    if (soloLength === 0) {
      return;
    }

    let result = new Date(selectedStartDate);
    if (soloLength === 180) {
      result = addDaysToDate(selectedStartDate, soloLength + 1);
    } else {
      result = addDaysToDate(selectedStartDate, soloLength);
    }

    setSelectedEndDate(result);
  }, [soloLength, selectedStartDate]);

  useEffect(() => {
    if (!id) {
      setDataValid(false);
      return;
    }

    const soloLengthValid = soloLength <= 180 && calculateDayDifference(selectedStartDate, selectedEndDate) <= 180;
    const datesValid = selectedStartDate.getTime() < selectedEndDate.getTime();
    const idValid = id.length >= 6;
    const selectedStationValid = selectedStation !== undefined;

    setDataValid(soloLengthValid && datesValid && idValid && selectedStationValid);
  }, [selectedStartDate, selectedEndDate, soloLength, id, selectedStation]);

  const clickSubmit = () => {
    if (!dataValid || selectedStation === undefined) {
      return;
    }
    setDisableSubmitButton(true);

    const endorsement: UserEndorsement = {
      vatsim_id: Number(id),
      soloEndorsement: {
        station: selectedStation,
        startDate: selectedStartDate,
        endDate: selectedEndDate,
        completedDays: 0,
        maxDays: 180, //TODO: replace with station.maxDays
      },
    };

    endorsementService.addSoloEndorsement(endorsement).then(() => { setDisableSubmitButton(false); onCompleted(); });
  };

  const groupTemplate = (option: FIR) => {
    return (
      <div className="flex align-items-center gap-2">
        <div>{option.name}</div>
      </div>
    );
  };

  return (
    <>
      <div className="card">
        <div className="p-inputgroup flex-1">
          <span className="p-inputgroup-addon">
            <i className="pi pi-user" ></i>
          </span>
          <span className="p-float-label">
            <InputText
              id="id-input"
              value={id}
              onChange={(e) => setId(e.target.value)}
              style={{ width: '7rem' }} />
            <label htmlFor="id-input">Vatsim ID</label>
          </span>
          <span className="p-float-label">
            <Calendar
              id="startDate"
              value={selectedStartDate}
              onChange={(e) => { setSelectedStartDate(e.target.value as Date); }}
              dateFormat="dd.mm.yy"
              // minDate={createDateWithDayOffset(0)}
              maxDate={createDateWithDayOffset(14)}
              style={{ width: '8rem' }} />
            <label htmlFor="startDate">Startdate</label>
          </span>
          <span className="p-float-label">
            <Calendar
              id="endDate"
              value={selectedEndDate}
              onChange={(e) => { setSelectedEndDate(e.target.value as Date); }}
              dateFormat="dd.mm.yy"
              minDate={createDateWithDayOffset(0)}
              maxDate={createDateWithDayOffset(180)}
              style={{ width: '8rem' }} />
            <label htmlFor="endDate">Enddate</label>
          </span>
          <div className="flex align-items-center" style={{ marginLeft: '1vw', marginTop: '1%', marginBottom: '1%' }}>
            {soloLengthOptions.map((item) => {
              return (
                <div key={'RadioButton' + item} style={{ width: '10vw', marginTop: '1vh' }}>
                  <RadioButton inputId={String(item)} value={item} checked={soloLength === item} onChange={(e: RadioButtonChangeEvent) => setSoloLength(e.value)} />
                  <label
                    htmlFor={String(item)}
                    className="ml-2">
                    {item !== 0 ? ' ' + String(item) + ' Days' :
                      ' Custom' + ((soloLength !== 30 && soloLength !== 180) ? ': ' + String(calculateDayDifference(selectedStartDate, selectedEndDate)) + ' Days' : '')}
                  </label>
                </div>);
            })}
          </div>
        </div>
        <ListBox
          value={selectedStation}
          onChange={(e: ListBoxChangeEvent) => setSelectedStation(e.value)}
          options={firData}
          optionLabel="name"
          optionGroupLabel="name"
          optionGroupChildren="stations"
          optionGroupTemplate={groupTemplate}
          className="w-full md:w-14rem"
          style={{ marginTop: '2%' }}
          listStyle={{ maxHeight: '25vh' }} />
        <Divider />
        <div className="p-inputgroup flex-1">
          <Button
            label='Submit'
            severity={dataValid ? 'success' : 'danger'}
            style={{ minWidth: '100%' }}
            disabled={disableSubmitButton}
            onClick={clickSubmit} />
        </div>
      </div>
    </>
  );
}

export default AddSoloEndorsementDialog;
