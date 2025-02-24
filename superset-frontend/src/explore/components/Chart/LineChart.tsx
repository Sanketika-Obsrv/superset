import React, { useState } from 'react'
import { Form, FormItem } from 'src/components/Form';
import { Input } from 'src/components/Input';
import {  t } from '@superset-ui/core';
import { set } from 'lodash';

const LineChart = (props: any) => {
  const { chart, controls, form_data } = props.props;

  const columns = controls.adhoc_filters.columns;
  const columnNames = columns.map((item: { column_name: any }) => item.column_name);
  
  const [cols, setCols] = useState<string[]>(
    form_data?.groupbyColumns ? form_data?.groupbyColumns : []
  );
  const handleChangeForCols = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValues = Array.from(event.target.selectedOptions, option => option.value);
    setCols(selectedValues);
    console.log('Selected values:', selectedValues);
  };
  
  return (
    <>
     <div className="dropdown-container">
      <label htmlFor="dropdown">Columns</label>
      {/* <MultiSelect value={cols} onChange={(e: { value: any; }) => set(e.value)} options={columnNames} optionLabel="name" 
                placeholder="Select Cities" maxSelectedLabels={columnNames.length} /> */}
    </div>
    </>
  )
}

export default LineChart