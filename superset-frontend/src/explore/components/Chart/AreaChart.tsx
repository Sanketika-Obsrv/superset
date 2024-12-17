import React, {  useState } from 'react'
import { Form, FormItem } from 'src/components/Form';
import { Input } from 'src/components/Input';
import {  t } from '@superset-ui/core';
import '../saveChart.css'
import { store } from 'src/views/store';

const AreaChart = (props:any) => {
  // console.log({props});
  const { chart, controls, form_data } = props.props;
  const [x_axis,setX_axis] = useState(controls.x_axis?.value);
  const [y_axis,setY_axis] = useState(form_data.groupby ? form_data.groupby[0]: undefined);
  const [metric,setMetric] = useState(form_data?.metric ? form_data?.metric?.column?.column_name : undefined);
  const [metrics,setMetrics] = useState(form_data?.metrics ? form_data?.metrics[0]?.column?.column_name : undefined);
  const [distribute,setDistribute] = useState(form_data?.columns ? form_data?.columns[0] : undefined);
  const [timeCol,setTimeCol] = useState(form_data?.granularity_sqla ? form_data?.granularity_sqla : undefined);
  const [series,setSeries] = useState(form_data?.series ? form_data?.series : undefined);
  const [cols,setCols] = useState(form_data?.groupbyColumns ? form_data?.groupbyColumns[0] : undefined);


  const charts = store.getState();
  // const metric = charts.explore.form_data?.metrics;
  
  console.log(metric);
  
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
  const handleChangeForX = (event: { target: { value: any; }; }) => {
    setX_axis(event.target.value); 
  };
  const handleChangeForY = (event: { target: { value: any; }; }) => {
    setY_axis(event.target.value); 
  };
  const handleChangeForMetrics = (event: { target: { value: any; }; }) => {
    setMetrics(event.target.value); 
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
      {x_axis !== undefined && (
        <div className='dropdown-container'>
          <label htmlFor="dropdown">X-axis </label>
          <select id="dropdown" value={x_axis} onChange={handleChangeForX}>
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
            <label htmlFor="dropdown">Y-axis </label>
            <select id="dropdown" value={y_axis} onChange={handleChangeForY}>
              {columnNames.map((name: string, index: number) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
      )}
      {/* {controls?.metrics?.column === 1 
      ? 
        <FormItem label={t('Metric')} required>
          <Input
            name="y-axis"
            type="text"
            placeholder="Name"
            value={form_data.metric}
            data-test="new-chart-name"
          />
        </FormItem>
      :
      <FormItem label={t('Metric')} required>
      {form_data.metrics && form_data.metrics.length > 0 && (
        <div 
        style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}
        >
          {form_data.metrics.map((metric: { label: any; }, index: React.Key | null | undefined) => (
            <button key={index} type="button">
              {metric.label|| `Metric ${index }`}
            </button>
          ))}
        </div>
      )}
      </FormItem>
     }  */}
       {metrics !== undefined  && (
          <div className='dropdown-container'>
            <label htmlFor="dropdown">Metric </label>
            <select id="dropdown" value={metrics} onChange={handleChangeForMetrics}>
              {columnNames.map((name: string, index: number) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
      )}

     {/* {timeInterval !== undefined && (
        <FormItem label={t('Filters')} required>
          <Input
            name="filters"
            type="text"
            placeholder="Name"
            value={timeInterval}
            data-test="new-chart-name"
          />
        </FormItem>
      )} */}
    </Form>
    </>
  )
}

export default AreaChart