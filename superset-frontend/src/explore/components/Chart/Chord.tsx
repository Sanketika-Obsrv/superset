import React, { useState } from 'react'
import { Form, FormItem } from 'src/components/Form';

const Chord = (props:any) => {
  const { chart, controls, form_data } = props.props;
console.log(chart);
console.log(props);

const [source,setSource] = useState(form_data?.groupby ? form_data?.groupby : undefined);
const [target,setTarget] = useState(form_data?.columns ? form_data?.columns : undefined);
const [sourceGraph,setSourceGraph] = useState(form_data?.source ? form_data?.source : undefined);
const [targetGraph,setTargetGraph] = useState(form_data?.target ? form_data?.target : undefined);
const [metric,setMetric] = useState(form_data?.metric ? form_data?.metric?.column?.column_name : undefined);

const handleChangeForMetric = (event: { target: { value: any; }; }) => {
    setMetric(event.target.value); 
  };
const handleChangeForSource = (event: { target: { value: any; }; }) => {
    setSource(event.target.value); 
  };
  const handleChangeForTarget = (event: { target: { value: any; }; }) => {
    setTarget(event.target.value); 
  };
  const handleChangeForSourceGraph = (event: { target: { value: any; }; }) => {
    setSourceGraph(event.target.value); 
  };
  const handleChangeForTargetGraph = (event: { target: { value: any; }; }) => {
    setTargetGraph(event.target.value); 
  };

const columns = controls.adhoc_filters.columns;
const columnNames = columns.map((item: { column_name: any; }) => item.column_name);  
  return (
    <>
    <Form data-test="save-modal-body" layout="vertical">
    {sourceGraph !== undefined && (
        <div className='dropdown-container'>
          <label htmlFor="dropdown">Source </label>
          <select id="dropdown" value={sourceGraph} onChange={handleChangeForSourceGraph}>
            {columnNames.map((name: string, index: number) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      )}
      {targetGraph !== undefined && (
        <div className='dropdown-container'>
          <label htmlFor="dropdown">Target </label>
          <select id="dropdown" value={targetGraph} onChange={handleChangeForTargetGraph}>
            {columnNames.map((name: string, index: number) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      )}
      {source !== undefined && (
        <div className='dropdown-container'>
          <label htmlFor="dropdown">Source </label>
          <select id="dropdown" value={source} onChange={handleChangeForSource}>
            {columnNames.map((name: string, index: number) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      )}

      {target !== undefined && (
          <div className='dropdown-container'>
            <label htmlFor="dropdown">Target </label>
            <select id="dropdown" value={target} onChange={handleChangeForTarget}>
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

export default Chord