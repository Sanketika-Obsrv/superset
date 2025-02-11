import { t } from '@superset-ui/core';
import React, { useEffect, useState } from 'react'
import { FormItem } from 'src/components/Form';
import { Input } from 'src/components/Input';
import { store } from 'src/views/store';

const BigNumberTotal = (props:any) => {
  const charts = store.getState();
  const { chart, controls, form_data } = props.props;
  const [y_axis,setY_axis] = useState(form_data?.groupby ? form_data?.groupby[0] : undefined);
  const [col_x,setCol_X] = useState(form_data?.all_columns_x ? form_data?.all_columns_x : undefined);
  const [col_y,setCol_Y] = useState(form_data?.all_columns_y ? form_data?.all_columns_y : undefined);
  const [column,setColumn] = useState(form_data?.column ? form_data?.column : undefined);
  const [timeCol,setTimeCol] = useState(form_data?.granularity_sqla ? form_data?.granularity_sqla : undefined);
  const [columnValueNames, setColumnValueNames] = useState<string[]>([]);
  const [metricValues, setMetricValues] = useState<string[]>([]);
  const filters = charts?.explore?.form_data?.adhoc_filters;
  const x_axis = charts?.explore?.form_data?.x_axis;
  
  const metrics = charts?.explore?.form_data?.metrics;
  useEffect(() => {
    if (metrics && metrics.length > 0) {
      const values = metrics
        .map((metric: { aggregate: any; column: { column_name: any; }; label: any; }) => {
          if (typeof metric === "string") {
            return metric;
          } else if (metric.aggregate && metric.column?.column_name) {
            return `${metric.aggregate}(${metric.column.column_name})`; 
          } else if (metric.label) {
            return metric.label; 
          }
          return null; 
        })
        .filter((value: any): value is string => !!value); 
      setMetricValues(values);
    } else {
      setMetricValues([]);
    }

    if (filters && filters.length > 0) {
      const columns = filters.map((filter: { operator: any; comparator: any; subject: any; }) => {
        const { operator, comparator, subject } = filter;
    
        if (operator === "TEMPORAL_RANGE" && typeof comparator === "string") {
          const parts = comparator.split(" : ");
          const start = parts[0] || ""; 
          const end = parts[1] || ""; 
          if(start === 'No filter'){
            return `${subject}(${start})`
          }
          
          if (start && end) {
            return `${start} <= ${subject} < ${end}`;
          } else if (start) {
            return `${start} <= ${subject}`;
          } else if (end) {
            return `${subject} < ${end}`;
          }
        } else if (operator && comparator && Array.isArray(comparator)) {
          return `${subject} ${operator} ${JSON.stringify(comparator)}`;
        } else if (subject) {
          return `${subject} ${operator} ${comparator}`;
        }
        return null;
      });
    
      setColumnValueNames(columns.filter((value: any): value is string => !!value));
    } else {
      setColumnValueNames([]);
    }
  }, [metrics,filters]);

  const handleChangeForTimeCol = (event: { target: { value: any; }; }) => {
    setTimeCol(event.target.value); 
  };
  const handleChangeForColumn = (event: { target: { value: any; }; }) => {
    setColumn(event.target.value); 
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
     <div className="container-chart">
      
      {metricValues.length > 0 && (
          <div className="section">
            <div className="column-label">Metrics:</div> 
            <div className='column-set'>
            {metricValues.map((metric, index) => (
              <div key={index} className="column">{metric}</div>
            ))}
            </div>
          </div>
        )}
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
        {columnValueNames.length > 0 && (
          <div className="section">
            <div className="column-label">Filters:</div> 
            <div className='column-set'>
            {columnValueNames.map((name, index) => (
              <div key={index} className="column">{name}</div>
            ))}
              </div>
          </div>
        )}
        {x_axis && (
          <div className="section">
            <div className="column-label">X-Axis</div> 
            <div className='column-set'>
              <div className='column'>
            {x_axis}
            </div>
              </div>
          </div>
        )}
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
      </div>
    </>
  )
}

export default BigNumberTotal