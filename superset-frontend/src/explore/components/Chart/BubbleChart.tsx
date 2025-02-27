import React, {  useState } from 'react'
import { Form, FormItem } from 'src/components/Form';
import { Input } from 'src/components/Input';
import {  t } from '@superset-ui/core';
import '../saveChart.css'
import { store } from 'src/views/store';

const BubbleChart = (props:any) => {
  // console.log({props});
  const { chart, controls, form_data } = props.props;
  const [x_axis,setX_axis] = useState(controls?.x?.value ? controls.x?.value?.column?.column_name : undefined);
  const [y_axis,setY_axis] = useState(controls?.y?.value ? controls.y?.value?.column?.column_name : undefined);
  const [metric,setMetric] = useState(form_data?.metrics ? form_data?.metrics[0]?.column?.column_name : undefined);
  const [entity,setEntity] = useState(controls?.entity ? controls?.entity?.value : undefined);
  const [dimension,setDimension] = useState(form_data?.series ? form_data?.series : undefined);

  
  const charts = store.getState();
  // const metric = charts.explore.form_data?.metrics;
  const handleChangeForEntity = (event: { target: { value: any; }; }) => {
    setEntity(event.target.value); 
  };
  const handleChangeForDimension = (event: { target: { value: any; }; }) => {
    setDimension(event.target.value); 
  };
  const handleChangeForX = (event: { target: { value: any; }; }) => {
    setX_axis(event.target.value); 
  };
  const handleChangeForY = (event: { target: { value: any; }; }) => {
    setY_axis(event.target.value); 
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
    {dimension !== undefined && (
        <div className='dropdown-container'>
          <label htmlFor="dropdown">Dimension </label>
          <select id="dropdown" value={dimension} onChange={handleChangeForDimension}>
            {columnNames.map((name: string, index: number) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      )}
    {entity !== undefined && (
        <div className='dropdown-container'>
          <label htmlFor="dropdown">Entity </label>
          <select id="dropdown" value={entity} onChange={handleChangeForEntity}>
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

export default BubbleChart