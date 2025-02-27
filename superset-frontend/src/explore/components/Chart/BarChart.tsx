import React, { useEffect, useState } from 'react'
import { Form } from 'src/components/Form';
import { store } from 'src/views/store';
import './style.css';

const BarChart = (props:any) => {


const charts = store.getState();
const data = props.dbData;

const [metrics,setMetrics] = useState(charts.explore.form_data.metrics.map((metric:any) =>
  metric.label ? metric.label : "COUNT(*)"
));

const [dimensions,setDimensions] = useState(charts.explore.form_data.groupby.map((dimension:any) =>
  typeof dimension === "string" ? dimension : dimension.label));


const [getDbData,setGetDbData] = useState(false);
const [filtersArray,setFiltersArray] = useState(charts.explore.form_data.adhoc_filters);
const [filters,setFilters] = useState(props.dbData.responseCode === "OK" && props.dbData?.result?.configuration?.filters);

const [dbDimensions,setDbDimensions] = useState(props.dbData.responseCode === "OK" && props.dbData?.result?.configuration?.dimensions);
const [dbMetrics,setDbMetrics] = useState(props.dbData.responseCode === "OK" && props.dbData?.result?.configuration?.metrics);
const [dbFilters,setDbFilters] = useState(props.dbData.responseCode === "OK" && props.dbData?.result?.configuration?.filters);
const [checkData,setCheckData] = useState(false);


useEffect(()=>{
  if(typeof charts?.explore?.form_data?.x_axis === "object"){
    setDimensions([charts?.explore?.form_data?.x_axis.label,...dimensions]);
  }else {
    setDimensions([charts?.explore?.form_data?.x_axis,...dimensions])
  }
},[])



useEffect(()=>{
  props.setConfiguration(configuration)
  if (filtersArray && filtersArray?.length > 0) {
    const columns = filtersArray.map((filter: { operator: any; comparator: any; subject: any; sqlExpression: any; expressionType: any;}) => {
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
    setFilters(columns.filter((value: any): value is string => value));
  }


  if(data.responseCode === "OK"){
    setDbDimensions(data.result.configuration.dimensions)
    setDbMetrics(data.result.configuration.metrics)
    setDbFilters(data.result.configuration.filters)
    setCheckData(true)
    }else {
      setCheckData(false)
    }

  

},[data])






  useEffect(()=> {
    if(dbMetrics?.length !== metrics?.length || JSON.stringify(dbMetrics) !== JSON.stringify(metrics)
      || dbDimensions?.length!== dimensions.length || JSON.stringify(dbDimensions) !== JSON.stringify(dimensions)
      || dbFilters?.length !== filters.length || JSON.stringify(dbFilters) !== JSON.stringify(filters)
    ){
      setCheckData(false)
    }else {
      setCheckData(true)
    }
  },[
    dimensions,filters,
    metrics
    
  ])

const configuration = {
  metrics: [] ,
  dimensions: [],
  filters: []
};


if(dimensions.length > 0){
  configuration.dimensions = dimensions
}
if(metrics.length > 0){
  configuration.metrics = metrics
}
if(filters?.length > 0){
  configuration.filters = filters
}


  
  return (
    <Form data-test="save-modal-body" layout="vertical">
    <div className="container-chart">
       {
      checkData && <> 
      {dbMetrics?.length > 0 && (
        <div className="section">
          <div className="column-label">Metrics</div> 
            <div className='column-set'>
              {dbMetrics.map((metric: string, index: number) => (
                <div key={index} className="column">{metric}</div>
              ))}
            </div>
          </div>
        )}
      {dbDimensions?.length > 0 && (
        <div className="section">
          <div className="column-label">Dimensions</div> 
            <div className='column-set'>
              {dbDimensions.map((dimension: string, index: number) => (
                <div key={index} className="column">{dimension}</div>
              ))}
            </div>
          </div>
        )}
      {dbFilters?.length > 0 && (
        <div className="section">
          <div className="column-label">Filters</div> 
            <div className='column-set'>
              {dbFilters.map((filter: string, index: number) => (
                <div key={index} className="column">{filter}</div>
              ))}
            </div>
          </div>
        )}
    </>  }  { !checkData && 
      <> 
      {metrics?.length > 0 && (
        <div className="section">
          <div className="column-label">Metrics</div> 
            <div className='column-set'>
              {metrics.map((metric: string, index: number) => (
                <div key={index} className="column">{metric}</div>
              ))}
            </div>
          </div>
        )}
      {dimensions?.length > 0 && (
        <div className="section">
          <div className="column-label">Dimensions</div> 
            <div className='column-set'>
              {dimensions.map((dimension: string, index: number) => (
                <div key={index} className="column">{dimension}</div>
              ))}
            </div>
          </div>
        )}
      {filters?.length > 0 && (
        <div className="section">
          <div className="column-label">Filters</div> 
            <div className='column-set'>
              {filters.map((filter: string, index: number) => (
                <div key={index} className="column">{filter}</div>
              ))}
            </div>
          </div>
        )}
      </>
    }
        
    </div>
    </Form>
  )
}

export default BarChart