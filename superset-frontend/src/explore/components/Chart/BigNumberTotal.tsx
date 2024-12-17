import { t } from '@superset-ui/core';
import React, { useState } from 'react'
import { FormItem } from 'src/components/Form';
import { Input } from 'src/components/Input';

const BigNumberTotal = (props:any) => {
  const { chart, controls, form_data } = props.props;
  const [metric,setMetric] = useState(form_data?.metric ? form_data?.metric?.column?.column_name : undefined);
  const [metrics,setMetrics] = useState(form_data?.metrics ? form_data?.metrics[0]?.column?.column_name : undefined);
  const [x_axis,setX_axis] = useState(form_data?.x_axis ? form_data?.x_axis : undefined);
  const [y_axis,setY_axis] = useState(form_data?.groupby ? form_data?.groupby[0] : undefined);
  const [col_x,setCol_X] = useState(form_data?.all_columns_x ? form_data?.all_columns_x : undefined);
  const [col_y,setCol_Y] = useState(form_data?.all_columns_y ? form_data?.all_columns_y : undefined);
  const [column,setColumn] = useState(form_data?.column ? form_data?.column : undefined);
  const [timeCol,setTimeCol] = useState(form_data?.granularity_sqla ? form_data?.granularity_sqla : undefined);

  


  const handleChangeForTimeCol = (event: { target: { value: any; }; }) => {
    setTimeCol(event.target.value); 
  };
  const handleChangeForColumn = (event: { target: { value: any; }; }) => {
    setColumn(event.target.value); 
  };
  const handleChangeForX_Axis = (event: { target: { value: any; }; }) => {
    setX_axis(event.target.value); 
  };
  const handleChangeForY_Axis = (event: { target: { value: any; }; }) => {
    setY_axis(event.target.value); 
  };
  const handleChangeForCol_X = (event: { target: { value: any; }; }) => {
    setCol_X(event.target.value); 
  };
  const handleChangeForCol_Y = (event: { target: { value: any; }; }) => {
    setCol_Y(event.target.value); 
  };
  const handleChangeForMetric = (event: { target: { value: any; }; }) => {
    setMetric(event.target.value); 
  };
  const handleChangeForMetrics = (event: { target: { value: any; }; }) => {
    setMetrics(event.target.value); 
  };
  const columns = controls?.adhoc_filters?.columns;
  const columnNames = columns?.map((item: { column_name: any; }) => item.column_name);  
  const newColumns = controls?.column?.options;
  const newColumnNames = newColumns?.map((item: { column_name: any; }) => item.column_name); 
  return (
    <>
    {/* {timeCol !== undefined  && (
          <div className='dropdown-container'>
            <label htmlFor="dropdown">Column </label>
            <select id="dropdown" value={timeCol} onChange={handleChangeForTimeCol}>
              {newColumnNames?.map((name: string, index: number) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
            {timeCol}
          </div>
      )} */}
      {timeCol !== undefined && 
     <div>
        <div>Time Column</div><br></br>
     <Input
            name="timeColumn"
            type="text"
            data-test="druid-sql-query"
            value={timeCol}
            onChange={handleChangeForTimeCol}
          />
     </div>
        }
        
    {column !== undefined  && (
          <div className='dropdown-container'>
            <label htmlFor="dropdown">Column </label>
            <select id="dropdown" value={column} onChange={handleChangeForColumn}>
              {newColumnNames?.map((name: string, index: number) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
      )}
      {metrics !== undefined  && (
          <div className='dropdown-container'>
            <label htmlFor="dropdown">Column </label>
            <select id="dropdown" value={metrics} onChange={handleChangeForMetrics}>
              {columnNames?.map((name: string, index: number) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
      )}
    {col_x !== undefined  && (
          <div className='dropdown-container'>
            <label htmlFor="dropdown">X-Axis </label>
            <select id="dropdown" value={col_x} onChange={handleChangeForCol_X}>
              {columnNames.map((name: string, index: number) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
      )}
      {col_y !== undefined  && (
          <div className='dropdown-container'>
            <label htmlFor="dropdown">Y-Axis </label>
            <select id="dropdown" value={col_y} onChange={handleChangeForCol_Y}>
              {columnNames.map((name: string, index: number) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
      )}
    {x_axis !== undefined  && (
          <div className='dropdown-container'>
            <label htmlFor="dropdown">X-Axis </label>
            <select id="dropdown" value={x_axis} onChange={handleChangeForX_Axis}>
              {columnNames.map((name: string, index: number) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
      )}
     {metric !== undefined  && (
          <div className='dropdown-container'>
            <label htmlFor="dropdown">Metric </label>
            <select id="dropdown" value={metric} onChange={handleChangeForMetric}>
              {columnNames.map((name: string, index: number) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
      )}
      {y_axis !== undefined  && (
          <div className='dropdown-container'>
            <label htmlFor="dropdown">Y-Axis </label>
            <select id="dropdown" value={y_axis} onChange={handleChangeForY_Axis}>
              {columnNames.map((name: string, index: number) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
      )}
    </>
  )
}

export default BigNumberTotal