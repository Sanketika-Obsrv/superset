import React, { useState } from 'react'
import { Form, FormItem } from 'src/components/Form';

const EventChart = (props:any) => {
  const { chart, controls, form_data } = props.props;

const [entityId,setEntityId] = useState(form_data?.entity ? form_data?.entity : undefined);
const [eventNames,setEventNames] = useState(form_data?.all_columns_x ? form_data?.all_columns_x : undefined);

const handleChangeForEventNames = (event: { target: { value: any; }; }) => {
    setEventNames(event.target.value); 
  };
const handleChangeForEntityId = (event: { target: { value: any; }; }) => {
    setEntityId(event.target.value); 
  };

const columns = controls.adhoc_filters.columns;
const columnNames = columns.map((item: { column_name: any; }) => item.column_name);  
  return (
    <>
    <Form data-test="save-modal-body" layout="vertical">
      {entityId !== undefined && (
        <div className='dropdown-container'>
          <label htmlFor="dropdown">Entity Id </label>
          <select id="dropdown" value={entityId} onChange={handleChangeForEntityId}>
            {columnNames.map((name: string, index: number) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      )}
      {eventNames !== undefined && (
          <div className='dropdown-container'>
            <label htmlFor="dropdown">Event Names </label>
            <select id="dropdown" value={eventNames} onChange={handleChangeForEventNames}>
              {columnNames.map((name: string, index: number) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
      )}
      </Form>
    </>
  )
}

export default EventChart