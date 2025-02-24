import { t } from '@superset-ui/core';
import React, { useState } from 'react'
import { Form, FormItem } from 'src/components/Form';

const DeckChart = (props:any) => {
    const { chart, controls, form_data } = props.props;

    const [longitude,setLongitude] = useState(form_data?.spatial ? form_data?.spatial?.lonCol : undefined);
    const [latitude,setLatitude] = useState(form_data?.spatial ? form_data?.spatial?.latCol : undefined);
    const [size,setSize] = useState(chart?.latestQueryFormData?.size ? chart?.latestQueryFormData?.size?.column?.column_name : undefined);
    const [startLongitude,setStartLongitude] = useState(form_data?.start_spatial ? form_data?.start_spatial?.lonCol : undefined);
    const [startLatitude,setStartLatitude] = useState(form_data?.start_spatial ? form_data?.start_spatial?.latCol : undefined);
    const [endLongitude,setEndLongitude] = useState(form_data?.end_spatial ? form_data?.end_spatial?.lonCol : undefined);
    const [endLatitude,setEndLatitude] = useState(form_data?.end_spatial ? form_data?.end_spatial?.latCol : undefined);
    const [geoJson,setGeoJson] = useState(form_data?.geojson ? form_data?.geojson : undefined);
    const [lineEncodings,setLineEncodings] = useState(form_data?.line_type ? form_data?.line_type : undefined);
    const [lineColumn,setLineColumn] = useState(form_data?.line_column ? form_data?.line_column : undefined);
    const [metric,setMetric] = useState(form_data?.metric ? form_data?.metric?.column?.column_name : undefined);
    
    const handleChangeForMetric = (event: { target: { value: any; }; }) => {
        setMetric(event.target.value); 
    };
    const handleChangeForLineColumn = (event: { target: { value: any; }; }) => {
        setLineColumn(event.target.value); 
    };
    const handleChangeForLineEncodings = (event: { target: { value: any; }; }) => {
        setLineEncodings(event.target.value); 
    };
    const handleChangeForGeoJson = (event: { target: { value: any; }; }) => {
        setGeoJson(event.target.value); 
    };
    const handleChangeForStartLongitude = (event: { target: { value: any; }; }) => {
        setStartLongitude(event.target.value); 
    };
    const handleChangeForEndLongitude = (event: { target: { value: any; }; }) => {
        setEndLongitude(event.target.value); 
    };
    const handleChangeForStartLatitude = (event: { target: { value: any; }; }) => {
        setStartLatitude(event.target.value); 
    };
    const handleChangeForEndLatitude = (event: { target: { value: any; }; }) => {
        setEndLatitude(event.target.value); 
    };
    const handleChangeForSize = (event: { target: { value: any; }; }) => {
        setSize(event.target.value); 
    };
    const handleChangeForLongitude = (event: { target: { value: any; }; }) => {
        setLongitude(event.target.value); 
    };
    const handleChangeForLatitude = (event: { target: { value: any; }; }) => {
        setLatitude(event.target.value); 
    };
      
const lines = controls?.line_type?.choices;
const lineNames = lines?.map((item: [string, string]) => item[1]);
const columns = controls?.adhoc_filters?.columns;

const columnNames = columns?.map((item: { column_name: any; }) => item.column_name);  

  return (
    <>
    <Form data-test="save-modal-body" layout="vertical">
    {lineColumn !== undefined && (
        <div className='dropdown-container'>
          <label htmlFor="dropdown">Line Columns </label>
          <select id="dropdown" value={lineColumn} onChange={handleChangeForLineColumn}>
            {columnNames.map((name: string, index: number) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      )}
    {lineEncodings !== undefined && (
        <div className='dropdown-container'>
          <label htmlFor="dropdown">Line Encodings </label>
          <select id="dropdown" value={lineEncodings} onChange={handleChangeForLineEncodings}>
            {lineNames.map((name: string, index: number) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      )}
    {geoJson !== undefined && (
        <div className='dropdown-container'>
          <label htmlFor="dropdown">GeoJson Column </label>
          <select id="dropdown" value={geoJson} onChange={handleChangeForGeoJson}>
            {columnNames.map((name: string, index: number) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      )}
    {startLongitude !== undefined && (
        <div className='dropdown-container'>
          <label htmlFor="dropdown">Start Longitude </label>
          <select id="dropdown" value={startLongitude} onChange={handleChangeForStartLongitude}>
            {columnNames.map((name: string, index: number) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      )}
      {startLatitude !== undefined && (
        <div className='dropdown-container'>
          <label htmlFor="dropdown">Start Latitude </label>
          <select id="dropdown" value={startLatitude} onChange={handleChangeForStartLatitude}>
            {columnNames.map((name: string, index: number) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      )}
      {endLongitude !== undefined && (
        <div className='dropdown-container'>
          <label htmlFor="dropdown">End Longitude </label>
          <select id="dropdown" value={endLongitude} onChange={handleChangeForEndLongitude}>
            {columnNames.map((name: string, index: number) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      )}
      {endLatitude !== undefined && (
        <div className='dropdown-container'>
          <label htmlFor="dropdown">End Latitude </label>
          <select id="dropdown" value={endLatitude} onChange={handleChangeForEndLatitude}>
            {columnNames.map((name: string, index: number) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      )}
    {size !== undefined && (
        <div className='dropdown-container'>
          <label htmlFor="dropdown">Bubble Size </label>
          <select id="dropdown" value={size} onChange={handleChangeForSize}>
            {columnNames.map((name: string, index: number) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      )}
      {longitude !== undefined && (
          <div className='dropdown-container'>
            <label htmlFor="dropdown">Longitude</label>
            <select id="dropdown" value={longitude} onChange={handleChangeForLongitude}>
              {columnNames.map((name: string, index: number) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
      )}
       {latitude !== undefined && (
          <div className='dropdown-container'>
            <label htmlFor="dropdown">Latitude</label>
            <select id="dropdown" value={latitude} onChange={handleChangeForLatitude}>
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
      </Form>
    </>
  )
}

export default DeckChart