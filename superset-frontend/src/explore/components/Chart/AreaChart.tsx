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

  const params = new URLSearchParams(window.location.search);
  const sliceId = params.get('slice_id') || 0;

  const theme = useTheme();
  const charts = store.getState();
  const data = props.dbData || {} 
  
  const [checkData,setCheckData] = useState(true);

  


  const { chart, controls, form_data } = props;
  let metrics = charts?.explore?.form_data?.metrics;
  let x_axis = charts?.explore?.form_data?.x_axis;
  if(typeof charts?.explore?.form_data?.x_axis === "object"){
    x_axis = charts?.explore?.form_data?.x_axis.label;
  }

  const groupbyValue = charts?.explore?.controls?.groupby?.value;

let dimensions: any = [];

if (Array.isArray(groupbyValue)) {
    if (typeof groupbyValue[0] === 'string') {
        dimensions = groupbyValue;
        
    } else if (typeof groupbyValue[0] === 'object' && groupbyValue[0] !== null) {
        dimensions = groupbyValue.map((item: any) => item.label);
    }
}



  const [dimensionValues, setDimensionValues] = useState<string[]>([]);
 

  const [metricValues, setMetricValues] = useState<string[]>([]);
  
  const [metric,setMetric] = useState(form_data?.metric ? form_data?.metric?.column?.column_name : undefined);
  const [distribute,setDistribute] = useState(form_data?.columns ? form_data?.columns[0] : undefined);
  const [timeCol,setTimeCol] = useState(form_data?.granularity_sqla ? form_data?.granularity_sqla : undefined);
  const [series,setSeries] = useState( form_data?.series ? form_data?.series : undefined);
  const [cols,setCols] = useState(form_data?.groupbyColumns ? form_data?.groupbyColumns[0] : undefined);
  const [columnValueNames, setColumnValueNames] = useState<string[]>(props.dbData.responseCode === "OK" ? props.dbData?.result?.configuration?.filters : undefined);
  const filters = charts?.explore?.form_data?.adhoc_filters;

  const [dbDescription,setDbDescription] = useState(data?.result?.configuration?.dimensions || undefined);
  
  const [newDim,setNewDim] = useState<string[]>([data?.result?.configuration?.dimensions]);
  const [newFil,setNewFil] = useState<string[]>([data?.result?.configuration?.filters]);
  const [newMet,setNewMet] = useState<string[]>([data?.result?.configuration?.metrics]);
  const [newX,setNewX] = useState(x_axis);




  useEffect(() => {
    if(data.responseCode === "FAILED"){
      setCheckData(false)
    }else {
      setCheckData(true)
    }
    setNewDim(data?.result?.configuration?.dimensions)
    setNewFil(data?.result?.configuration?.filters)
    setNewMet(data?.result?.configuration?.metrics)
    setNewX(data?.result?.configuration?.x_axis)

    

  props.setConfiguration(configuration);
    if (filters && filters.length > 0) {
      const columns = filters.map((filter: { operator: any; comparator: any; subject: any; sqlExpression: any; expressionType: any;}) => {
        const { operator, comparator, subject, sqlExpression, expressionType } = filter;
    
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
        } else if (expressionType === "SQL") {
          return `${sqlExpression}`;

        } else if (operator && comparator && Array.isArray(comparator)) {
          return `${subject} ${operator} ${JSON.stringify(comparator)}`;
        } else if (subject) {
          return `${subject} ${operator} ${comparator}`;
        }
        return null;
      });
      setColumnValueNames(columns.filter((value: any): value is string => value));
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
        .map((metric: { aggregate?: string; column?: { column_name?: string }; label?: string }) => {
          if (typeof metric === "string") {
            return metric;
          } else if (metric?.aggregate && metric?.column?.column_name) {
            return `${metric.aggregate}(${metric.column.column_name})`;
          } else if (typeof metric?.label === "string") {
            return metric.label;
          }
          return null; 
        })
        .filter((value: any): value is string => typeof value === "string"); 
    
      setMetricValues(values);
    } else {
      setMetricValues([]);
    }
    
  }, [data]);



  
  const metricLabels = metrics
  .filter((metric: { label: string }) => metric.label)
  .map((metric: { label: any }) => metric.label);

if (metrics.includes("count")) {
  metricLabels.push("count(*)");
}


  const dimensionLabels = dimensions
  .filter((dim:{label:string;})=> dim)
  .map((dim: {label:any;})=>dim);

  
  const filterLabels = filters
  .map((filter: { operator: any; comparator: any; subject: any; sqlExpression: any; expressionType:any }) => {
    const { operator, comparator, subject, sqlExpression, expressionType } = filter;
    if (operator === "TEMPORAL_RANGE") {
      if(comparator === "No filter"){
        return `${subject}(${comparator})`
      }
      const [start, end] = comparator.split(" : ");
      return `${start} <= ${subject} < ${end}`;
    } else if (expressionType === "SQL"){
      return `${sqlExpression}`
    }
    return `${subject} ${operator} ${JSON.stringify(comparator)}`;
  });
  const configuration = {
    x_axis:'',
    metrics: '' ,
    dimensions: '',
    filters: ''
  };

  if(x_axis !== undefined){
    configuration.x_axis = x_axis;
  }
  if(dimensionLabels.length > 0){
    configuration.dimensions = dimensionLabels
  }
  if(metricLabels.length > 0){
    configuration.metrics = metricLabels
  }
  if(filterLabels.length > 0){
    configuration.filters = filterLabels
  }

  // useEffect(()=> {
  //   if(newMet?.length !== metricLabels?.length 
  //     || newDim?.length!== dimensionLabels.length 
  //     || newFil?.length !== filterLabels.length 
  //     || newX?.length !== x_axis.length
  //   ){
  //     setCheckData(false)
  //   }else {
  //     setCheckData(true)
  //   }
  // },[
  //   dimensionLabels,filterLabels,
  //   metricLabels
  //   ,x_axis
  // ])

  useEffect(() => {
    if (
      newMet?.length === metricLabels?.length && 
      newMet?.every((value: any, index: number) => value === metricLabels[index]) &&
      newDim?.length !== dimensionLabels.length &&  
      newDim?.every((value: any, index: number) => value === dimensionLabels[index]) &&
      newFil?.length !== filterLabels.length  &&  
      newFil?.every((value: any, index: number) => value === filterLabels[index]) &&
      newX?.length !== x_axis.length
    ) {
      setCheckData(true);
    } else {
      setCheckData(false);
    }
  }, [dimensionLabels, filterLabels, metricLabels, x_axis]);

  // console.log(newMet?.every((value: any, index: number) => value === metricLabels[index]),"metric check");
  // console.log(newDim?.every((value: any, index: number) => value === dimensionLabels[index]),"dimensions check");
  // console.log(newFil?.every((value: any, index: number) => value === filterLabels[index]),"filter check");
  // console.log(newX === x_axis,"x axis check");
  

  
  
console.log(newMet,"newMet");
console.log(metricLabels,"metricLabels");



  const columns = controls.adhoc_filters.columns;
  const columnNames = columns.map((item: { column_name: any; }) => item.column_name);  

  return (
    <>

    <Form data-test="save-modal-body" layout="vertical">
    <div className="container-chart">
      { !checkData && 
      <>  from redux
    {metricLabels?.length > 0 && (
          <div className="section">
            <div className="column-label">Metrics:</div> 
            <div className='column-set'>
            {metricLabels.map((met: string, index: number) => (
              <div key={index} className="column">{met}</div>
            ))}
            </div>
          </div>
        )}
    
        {dimensions?.length > 0 && (
          <div className="section">
            <div className="column-label">Dimensions:</div> 
            <div className='column-set'>
            {dimensions.map((dim: string, index: number) => (
              <div key={index} className="column">{dim}</div>
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
        {columnValueNames?.length > 0 && (
          <div className="section">
            <div className="column-label">Filters:</div> 
            <div className='column-set'>
            {columnValueNames.map((fil: string, index: number) => (
              <div key={index} className="column">{fil}</div>
            ))}
            </div>
          </div>
          )} 
        </>
        } { checkData && <> from db
        {newX && (
          <div className="section">
            <div className="column-label">X-Axis</div> 
            <div className='column-set'>
              <div className='column'>
            {newX}
            </div>
              </div>
          </div>
        )}

        {newMet?.length > 0 && (
          <div className="section">
            <div className="column-label">Metrics:</div> 
            <div className='column-set'>
            {newMet.map((met: string, index: number) => (
              <div key={index} className="column">{met}</div>
            ))}
            </div>
          </div>
        )}
          {newDim?.length > 0 && (
          <div className="section">
            <div className="column-label">Dimensions:</div> 
            <div className='column-set'>
            {newDim.map((dim: string, index: number) => (
              <div key={index} className="column">{dim}</div>
            ))}
            </div>
          </div>
          )} 
        {newFil?.length > 0 && (
          <div className="section">
            <div className="column-label">Filters:</div> 
            <div className='column-set'>
            {newFil.map((fil: string, index: number) => (
              <div key={index} className="column">{fil}</div>
            ))}
            </div>
          </div>
          )} 
        </>}
      </div>
     
    
    </Form>
    
    </>
  )
}

export default AreaChart