import React, {  useEffect, useState } from 'react'
import { Form, FormItem } from 'src/components/Form';
import { Input } from 'src/components/Input';
import {  t,useTheme } from '@superset-ui/core';
import '../saveChart.css'
import { store } from 'src/views/store';
import { AddControlLabel, DndLabelsContainer } from '../controls/OptionControls';
import Icons from 'src/components/Icons';
import dayjs from 'dayjs';
import './style.css';

const AreaChart = (props:any) => {
  const a = dayjs()

// Get dynamic date values using dayjs
const startDate = dayjs().subtract(7, 'days')
// .startOf('day').format('YYYY-MM-DD HH:mm:ss.SSSSSS');
const endDate = dayjs().add(20,'days')
// .startOf('day').format('YYYY-MM-DD HH:mm:ss.SSSSSS');

  // console.log({props});
  const theme = useTheme();
  const charts = store.getState();

  const { chart, controls, form_data } = props.props;
  const metrics = charts?.explore?.form_data?.metrics;
  const dimensions = charts?.explore?.controls?.groupby?.value;
  const x_axis = charts?.explore?.form_data?.x_axis;

  const [dimensionValues, setDimensionValues] = useState<string[]>([]);
 
  const [metricValues, setMetricValues] = useState<string[]>([]);
  const [metric,setMetric] = useState(form_data?.metric ? form_data?.metric?.column?.column_name : undefined);
  // const [metrics,setMetrics] = useState(form_data?.metrics ? form_data?.metrics[0]?.column?.column_name : undefined);
  const [distribute,setDistribute] = useState(form_data?.columns ? form_data?.columns[0] : undefined);
  const [timeCol,setTimeCol] = useState(form_data?.granularity_sqla ? form_data?.granularity_sqla : undefined);
  const [series,setSeries] = useState(form_data?.series ? form_data?.series : undefined);
  const [cols,setCols] = useState(form_data?.groupbyColumns ? form_data?.groupbyColumns[0] : undefined);
  const [columnValueNames, setColumnValueNames] = useState<string[]>([]);
  const filters = charts?.explore?.form_data?.adhoc_filters;

  useEffect(() => {
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
    
    if (dimensions && dimensions.length > 0) {
      setDimensionValues(dimensions);
    } else {
      setDimensionValues([]);
    }
  
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
  }, [metrics, dimensions, filters]);
  
  
  
  const handleChangeForCols = (event: { target: { value: any; }; }) => {
    setCols(event.target.value); 
  };
  const handleChangeForSeries = (event: { target: { value: any; }; }) => {
    setSeries(event.target.value); 
  };
  const handleChangeForTimeCol = (event: { target: { value: any; }; }) => {
    setTimeCol(event.target.value); 
  };
  const handleChangeForDistribute = (event: { target: { value: any; }; }) => {
    setDistribute(event.target.value); 
  };
  
  const handleChangeForMetric = (event: { target: { value: any; }; }) => {
    setMetric(event.target.value); 
  };
  let timeInterval = '';
  if(chart.latestQueryFormData.adhoc_filters[0]?.comparator !== undefined){
    timeInterval = chart.latestQueryFormData.adhoc_filters[0].comparator;
  }

  const columns = controls.adhoc_filters.columns;
  const columnNames = columns.map((item: { column_name: any; }) => item.column_name);  
  return (
    <>

    <Form data-test="save-modal-body" layout="vertical">
    <div className="container-chart">
    {metric !== undefined  && (
          <div className='dropdown-container'>
            <label htmlFor="dropdown">Metrics </label>
            <select id="dropdown" value={metric} onChange={handleChangeForMetric}>
              {columnNames?.map((name: string, index: number) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
      )}
    {cols !== undefined  && (
          <div className='dropdown-container'>
            <label htmlFor="dropdown">Columns </label>
            <select id="dropdown" value={cols} onChange={handleChangeForCols}>
              {columnNames?.map((name: string, index: number) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
      )}
    
        {series !== undefined && (
        <div className='dropdown-container'>
          <label htmlFor="dropdown"> Dimensions </label>
          <select id="dropdown" value={series} onChange={handleChangeForSeries}>
            {columnNames.map((name: string, index: number) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      )}
    {distribute !== undefined && (
        <div className='dropdown-container'>
          <label htmlFor="dropdown">Distribute Across </label>
          <select id="dropdown" value={distribute} onChange={handleChangeForDistribute}>
            {columnNames.map((name: string, index: number) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
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
        {dimensionValues.length > 0 && (
          <div className="section">
            <div className="column-label">Dimensions:</div> 
            <div className='column-set'>
            {dimensionValues.map((dimension, index) => (
              <div key={index} className="column">{dimension}</div>
            ))}
            </div>
          </div>
        )}
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
        
      </div>
     
    
    </Form>
    
    </>
  )
}

export default AreaChart