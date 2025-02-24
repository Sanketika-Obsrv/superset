import React, { useCallback, useEffect, useState } from 'react';
import AreaChart from './Chart/AreaChart';
import { store } from 'src/views/store';
import { Input } from 'src/components/Input';
import { Form, FormItem } from 'src/components/Form';
import { styled, t } from '@superset-ui/core';
import Modal from 'src/components/Modal';
import {setAllChartModalVisibility} from 'src/explore/actions/saveModalActions';
import { useDispatch } from 'react-redux';
import Button from 'src/components/Button';
import Chord from './Chart/Chord';
import CountryChart from './Chart/CountryChart';
import BigNumberTotal from './Chart/BigNumberTotal';
import BubbleChart from './Chart/BubbleChart';
import Bubble from './Chart/Bubble';
import DeckChart from './Chart/DeckChart';
import EventChart from './Chart/EventChart';
import {  newQuery } from './utils/ModifiedQuery';
import {CHART_BASE_URL} from 'packages/superset-ui-core/src/connection/constants';
import { addDangerToast, addSuccessToast } from 'src/components/MessageToasts/actions';
import { newSetSaveChartModalVisibility } from 'src/explore/actions/saveModalActions';

import './AllChart.css';
import BarChart from './Chart/BarChart';
export const StyledModal = styled(Modal)`
  .ant-modal-body {
    max-height: 80vh;
    overflow-y: auto;
  }
  i {
    position: absolute;
    top: -${({ theme }) => theme.gridUnit * 5.25}px;
    left: ${({ theme }) => theme.gridUnit * 26.75}px;
  }
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999; /* Ensures it's above other elements */
`;

const AllChart = (props: any) => {
  console.log({props});
  
  const {onOpen, sliceName} = props;
  const params = new URLSearchParams(window.location.search);
  const sliceId = params.get('slice_id') || 0;
  // const sliceId:any = params.get('slice_id');


  const reduxQuery = store?.getState()?.charts[sliceId]?.queriesResponse[0]?.query;
  const redux_store = store.getState();
  console.log({charts: redux_store});
  const [name,setName] = useState(props.sliceName);
  const [query,setQuery] = useState(reduxQuery);
  const [dbDimensions,setDbDimensions] = useState([]);
  const [dbMetrics,setDbMetrics] = useState([]);
  const [dbFilters,setDbFilters] = useState([]);
  const [dbDescription,setDbDescription] = useState([]);
  const [dbQuery,setDbQuery] = useState();
  const [checkData,setCheckData] = useState(false)
  const dispatch = useDispatch();
  const storeValue = store.getState().charts[sliceId];
  const chartName = store?.getState()?.charts[sliceId]?.latestQueryFormData?.viz_type;
  const [configuration, setConfiguration] = useState<{ 
    metrics: any[], 
    dimensions: any[], 
    filters: string[] 
  }>({
    metrics: [], 
    dimensions: [], 
    filters: []
  });
  const [description,setDescription] = useState<any>();
  const [myQuery,setMyQuery] = useState(reduxQuery);
  const filters = redux_store?.explore?.form_data?.adhoc_filters;

  const [newFilters,setNewFilters] = useState(filters.map((filter:any) => {
    if (filter.operator === "TEMPORAL_RANGE" && filter.comparator) {
      return `${filter.subject} IN (${filter.comparator})`;
    }else if (filter.comparator === "No filter" && filter.subject) {
      return `${filter.subject} (${filter.comparator})`;
    } else if (Array.isArray(filter.comparator) && filter.operator === "IN") {
      return `${filter.subject} IN (${filter.comparator.join(", ")})`;
    } else if (Array.isArray(filter.comparator) && filter.operator === "NOT IN") {
      return `${filter.subject} NOT IN (${filter.comparator.join(", ")})`;
    }else if (typeof filter.comparator === "number" && filter.operator) {
      return `${filter.subject} ${filter.operator} ${filter.comparator}`;
    } else if (typeof filter.comparator === "string" && filter.operator) {
      return `${filter.subject} ${filter.operator} '${filter.comparator}'`; 
    } else if (filter.operator && filter.comparator === null) {
      return `${filter.subject} ${filter.operator}`;
    } else if (filter.sqlExpression) {
      return filter.sqlExpression;
    } 
    return null;
  })
  .filter(Boolean) as string[])
  const [newMetrics,setNewMetrics] = useState(redux_store.explore.form_data?.metrics?.map((metric:any) =>
    metric.label ? metric.label : "COUNT(*)"
  ));
  const [dimensions, setDimensions] = useState(() => {
    const groupby = redux_store?.explore?.form_data?.groupby;
    
    if (typeof groupby === "string") {
      return [groupby]; 
    } 
    
    if (Array.isArray(groupby)) {
      return groupby.map((dimension: any) => 
        typeof dimension === "string" ? dimension : dimension.label
      );
    }
  
    return []; 
  });
  
  const [breakdowns, setBreakdowns] = useState(() => {
    const columns = redux_store?.explore?.form_data?.columns;
  
    if (Array.isArray(columns) && columns.length > 0) {
      return columns.map(col => typeof col === "string" ? col : col.label);
    }
  
    return undefined;
  });
  

  const [latitude,setLatitude] = useState(()=>{
    const lat = redux_store?.explore?.form_data?.spatial;
    if(redux_store?.explore?.form_data?.spatial?.latCol !== undefined){
      return redux_store?.explore?.form_data?.spatial?.latCol; 
    }
    return undefined;
  })

  const [longitude,setLongitude] = useState(()=>{
    const lat = redux_store?.explore?.form_data?.spatial;
    if(redux_store?.explore?.form_data?.spatial?.lonCol !== undefined){
      return redux_store?.explore?.form_data?.spatial?.lonCol; 
    }
    return undefined;
  })

  const [xAxis,setXAxis] = useState(()=>{
   const initialXAxis = redux_store.explore.form_data?.x_axis
   if(initialXAxis?.label) return initialXAxis?.label;
   else if (initialXAxis) return initialXAxis;
   return undefined
  })

  const [metric, setMetric] = useState(
    redux_store?.explore?.form_data?.metric === 'count' ?  "COUNT(*)" :redux_store.explore.form_data.metric?.label
  );
  const [allColumns,setAllColumns] = useState(
    redux_store?.explore?.form_data?.all_columns !== undefined ? redux_store?.explore?.form_data?.all_columns : undefined
  )
  const [allColumnsX,setAllColumnsX] = useState(
    redux_store.explore?.form_data?.all_columns_x !== undefined ? redux_store.explore?.form_data?.all_columns_x : undefined
  )
  const [allColumnsY,setAllColumnsY] = useState(
    redux_store.explore?.form_data?.all_columns_y !== undefined ? redux_store.explore?.form_data?.all_columns_y : undefined
  )
  const [column,setColumn] = useState(
    redux_store.explore?.form_data?.column !== undefined ? redux_store.explore?.form_data?.column : undefined
  )
  const [granularitySqla,setGranularitySqla] = useState(()=>{
    const initialGranularitySqla = redux_store?.explore?.form_data?.granularity_sqla 
    if(initialGranularitySqla?.label !== undefined){
      return initialGranularitySqla?.label
    }else if(initialGranularitySqla !== undefined){
      return initialGranularitySqla
    }
    return undefined
})
  const [series,setSeries] = useState(
    redux_store?.explore?.form_data?.series !== undefined ? redux_store?.explore?.form_data?.series : undefined
  )
  const [secondaryMetric, setSecondaryMetric] = useState(() => {
    const secondaryMetric = redux_store?.explore?.form_data?.secondary_metric;
      if(secondaryMetric?.label !== undefined){
        return secondaryMetric?.label;
      }
    else if (Array.isArray(secondaryMetric)) {
      return secondaryMetric.length > 0 ? secondaryMetric.map((metric) => metric.label) : undefined;
    } 
    else if(secondaryMetric){
      return secondaryMetric
    }
  
    return undefined;
  });
  const [entity,setEntity] = useState(
    redux_store?.explore?.form_data?.entity !== undefined ? redux_store?.explore?.form_data?.entity : undefined
  )
  const [groupByColumn, setGroupByColumn] = useState(() => {
    const groupbyColumns = redux_store?.explore?.form_data?.groupbyColumns;
    return Array.isArray(groupbyColumns) && groupbyColumns.length > 0 ? groupbyColumns : undefined;
  });
  const [groupByRow, setGroupByRow] = useState(() => {
    const groupbyRow = redux_store?.explore?.form_data?.groupbyRows;
    return Array.isArray(groupbyRow) && groupbyRow.length > 0 ? groupbyRow : undefined;
  });
  const [source,setSource] = useState(
    redux_store?.explore?.form_data?.source !== undefined ? redux_store?.explore?.form_data?.source : undefined
  )
  const [target,setTarget] = useState(
    redux_store?.explore?.form_data?.target !== undefined ? redux_store?.explore?.form_data?.target : undefined
  )
  const [percentageMetrics, setPercentageMetrics] = useState<string[] | undefined>(() => {
    const initialMetrics = redux_store?.explore?.form_data?.percent_metrics;
    if (!initialMetrics) return undefined; 
    return initialMetrics
      .map((metric: string | { label?: string }) => {
        if (typeof metric === "string") {
          return metric === "count" ? "COUNT(*)" : metric;
        }
        return metric?.label ?? undefined;
      })
      .filter((value: any): value is string => Boolean(value)); 
  });
  
  const [size,setSize] = useState(()=>{
    redux_store?.explore?.form_data?.size !== undefined 
    const initialSize = redux_store?.explore?.form_data?.size
    if(initialSize === 'count') return 'Count(*)'
    else return initialSize?.label;
})
  const [x,setX] = useState(()=>{
    redux_store?.explore?.form_data?.x !== undefined 
    const initialX = redux_store?.explore?.form_data?.x
    if(initialX === 'count') return 'Count(*)'
    else return initialX?.label;
})
const [y,setY] = useState(()=>{
  redux_store?.explore?.form_data?.y !== undefined 
  const initialY = redux_store?.explore?.form_data?.y
  if(initialY === 'count') return 'Count(*)'
  else return initialY?.label;
})
  const [checkDescription,setCheckDescription] = useState(false);
  const [checkQuery,setCheckQuery] = useState(false);

  let modifiedQuery = '';
const newQuery1 = newQuery(query,filters);
// console.log(filters,"filters");


function modifyWhereClause(query: string,filters: any, newWhereClause: string) {
  try {
    const whereRegex = /WHERE(.*?)(GROUP BY|ORDER BY|LIMIT|$)/s;

    const match = query?.match(whereRegex);
    if (!match) {
      throw new Error("No WHERE clause found in the query");
      
    }
    
    const originalWhere = match[1];
    const trailingPart = match[2] || ""; 

    
     modifiedQuery = query.replace(
      `WHERE${originalWhere}${trailingPart}`,
      `${newWhereClause} ${trailingPart}`
    );
    
    return modifiedQuery;
  } catch (error) {
    return query; 
  }
}





let result = modifyWhereClause(query,filters,newQuery1);
if (modifiedQuery.includes(';')) {
  modifiedQuery = modifiedQuery.replace(/;/g, '');
} else {
}

  const [startLatCol,setStartLatCol] = useState(
    redux_store?.explore?.form_data?.start_spatial?.latCol !== undefined ? redux_store?.explore?.form_data?.start_spatial?.latCol : undefined
  ) 
  const [startLonCol,setStartLonCol] = useState(
    redux_store?.explore?.form_data?.start_spatial?.lonCol !== undefined ? redux_store?.explore?.form_data?.start_spatial?.lonCol : undefined
  ) 
  const [endLatCol,setEndLatCol] = useState(
    redux_store?.explore?.form_data?.end_spatial?.latCol !== undefined ? redux_store?.explore?.form_data?.end_spatial?.latCol : undefined
  ) 
  const [endLonCol,setEndLonCol] = useState(
    redux_store?.explore?.form_data?.end_spatial?.lonCol !== undefined ? redux_store?.explore?.form_data?.end_spatial?.lonCol : undefined
  ) 
  useEffect(()=>{
    let metricsArray = [];
    let dimensionsArray = [];
    if(newMetrics){
      if(newMetrics.length > 1){
        metricsArray.push(...newMetrics)
      }else if(newMetrics.length === 1) {
        metricsArray.push(newMetrics)
      }
    }

    if(dimensions){
      if(dimensions.length > 1){
        dimensionsArray.push(...dimensions)
      }else if(dimensions.length === 1) {
        dimensionsArray.push(dimensions)
      }
    }
    if (breakdowns) {
      if(breakdowns.length > 1){
        dimensionsArray.push(...breakdowns)
      }else if(breakdowns.length === 1){
      dimensionsArray.push(breakdowns)
      }
    }
    if(startLatCol){
      dimensionsArray.push(startLatCol)
    }
    if(startLonCol){
      dimensionsArray.push(startLonCol)
    } 
       if(endLatCol){
      dimensionsArray.push(endLatCol)
    } 
       if(endLonCol){
      dimensionsArray.push(endLonCol)
    }    
    if(xAxis !== undefined){
      dimensionsArray.push(xAxis)
    }
    if(latitude !== undefined && longitude !== undefined){
        dimensionsArray.push(latitude,longitude)
    }
    if(allColumns !== undefined){
      dimensionsArray.push(allColumns)
    }
    if(allColumnsX !== undefined){
      dimensionsArray.push(allColumnsX,allColumnsY)
    }
    if(column !== undefined){
      metricsArray.push(column)
    }
    if(granularitySqla !== undefined){
      dimensionsArray.push(granularitySqla)
    }
    if(series !== undefined){
      dimensionsArray.push(series)
    }
    if(secondaryMetric !== undefined){
      metricsArray.push(secondaryMetric)
    }
    if(groupByColumn !== undefined && groupByRow !== undefined){
      if(groupByColumn.length === 1){
        dimensionsArray.push(groupByColumn)
      }else if(groupByColumn.length > 1){
        dimensionsArray.push(...groupByColumn)
      }
      if(groupByRow.length === 1){
        dimensionsArray.push(groupByRow)
      }else if(groupByRow.length > 1){
        dimensionsArray.push(...groupByRow)
      }
    }
    if(source !== undefined && target !== undefined){
      dimensionsArray.push(source,target)
    }
    if(percentageMetrics && percentageMetrics.length > 0){
      if(percentageMetrics.length === 1){
        metricsArray.push(percentageMetrics)
      }else if(percentageMetrics.length > 1){
        metricsArray.push(...percentageMetrics)
      }
    }
    if(metric !== undefined){

      metricsArray.push(metric)
    }
    setMyQuery(modifiedQuery)
    if(size !== undefined){
      metricsArray.push(size)
    }
    if(entity !== undefined){
      dimensionsArray.push(entity)
    }
    if(x !== undefined || y !== undefined){
      metricsArray.push(x,y)
    }
    setNewMetrics(metricsArray)
    setDimensions(dimensionsArray)
  },[])



  
  useEffect(()=> {
    if(sliceId !== 0 && !getData){
      setGetData(true)
      getChart(sliceId)
    }
    setConfiguration(prevConfig => ({
      ...prevConfig,
      metrics: newMetrics, 
      dimensions: dimensions, 
      filters: newFilters 
    }));
    if(dbMetrics?.length !== newMetrics?.length || JSON.stringify(dbMetrics) !== JSON.stringify(newMetrics)
      || dbDimensions?.length!== dimensions.length || JSON.stringify(dbDimensions) !== JSON.stringify(dimensions)
      || dbFilters?.length !== newFilters.length || JSON.stringify(dbFilters) !== JSON.stringify(newFilters)
    ){
      setCheckData(false)
    }else {
      setCheckData(true)
    }
  },[newMetrics,dimensions,newFilters,dbDimensions,dbFilters,dbMetrics])
  




  const [getData,setGetData] = useState(false);

 
    

  const getChart = async (sliceId: any) => {
    
    const slice_ID = parseInt(sliceId)
    try {
      const response = await fetch(`${CHART_BASE_URL}/charts/search/${slice_ID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
      if (response.ok) {
        setDbDimensions(data?.result?.configuration?.dimensions)
        setDbMetrics(data?.result?.configuration?.metrics)
        setDbFilters(data?.result?.configuration?.filters)
        setDbDescription(data?.result?.description)
        setDbQuery(data?.result?.query)

      } else {
        // console.error(`Failed to get chart`);
      }
    } catch (error) {
      // console.error(`An error occurred while retriving the chart`);
    }
  };

  


  const handleCloseModal = useCallback(() => {
    dispatch(setAllChartModalVisibility(false));
  },[dispatch])

  const handleChangeForDescription = (event: { target: { value: any; }; }) => {
    setDescription(event.target.value); 
  };

  const handleChangeForDbDescription= (event: { target: { value: any; }; }) => {
    setDbDescription(event.target.value); 
  };

  

  if(modifiedQuery === ''){
    modifiedQuery=query;
  }




const saveChart = async (sliceId: string | number, dispatch: any) => {
  let updateData = {};
  if(checkData){
    updateData = {
      query: result,
      description: dbDescription,
      configuration: configuration,
      slice_id: sliceId,
    };
  }else {
   updateData = {
    query: result,
    description: description,
    configuration: configuration,
    slice_id: sliceId,
  };
}

  if (description?.length < 4) {
    setCheckDescription(true);
    dispatch(addDangerToast(t('Description length must be more than 4 characters.')));
    return;
  } else {
    setCheckDescription(false);
  }

  // if (result === undefined) {
  //   setCheckQuery(true);
  //   dispatch(addDangerToast(t('Query is required.')));
  //   return;
  // } else {
  //   setCheckQuery(false);
  // }

  if (sliceId !== 0) {
    try {
      const response = await fetch(`${CHART_BASE_URL}/charts/update/${sliceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      
      if (response.ok) {
        handleCloseModal();
        dispatch(addSuccessToast(t(`Chart [${name}] has been published successfully.`)));
      } else {
        setCheckDescription(true);
        dispatch(addDangerToast(t('Failed to publish the chart. Please try again.')));
      }
    } catch (error) {
      dispatch(addDangerToast(t('An error occurred while updating the chart.')));
    }
  } else {
    dispatch(addDangerToast(t('First save the chart to generate a slice ID.')));
  }
};



function onHide() {
  handleCloseModal()
}

  const renderFooter = () => (
    <div data-test="save-modal-footer">
      <Button className='cancel_chart'
      onClick={ onHide}
      >
        {t('Cancel')}
      </Button> 
       <Button className='update_chart'
        onClick={()=>saveChart(sliceId,dispatch)}
        data-test="btn-modal-save"
      buttonStyle="primary"
      >
        {t('Publish')}
      </Button> 
      </div>
  );
  return (    
    <>
      {onOpen && (
        <StyledModal
          show={onOpen}
          onHide={handleCloseModal}
          footer={renderFooter()}
          title={t('Review Chart')}
        >
          <div>
            {checkData && <> 
          <Form data-test="save-modal-body" layout="vertical">
            <FormItem label={t('Druid SQL Query')} required
            help={checkQuery ? <span style={{ color: 'red' }}>Druid SQL Query is required</span> : null}
            
            >
              <div className='outer-div'> 
              <Input 
                name="new_slice_name"
                type="text"
                placeholder="Name"
                value={dbQuery}
                data-test="new-chart-name"
                className='col-set'
              />
              </div>
            </FormItem>
            <FormItem label={t('Description')} required
            help={checkDescription ? <span style={{ color: 'red' }}>Description must be atleast 4 characters long.</span> : null}
            >
              <div className='outer-div'> 
              <Input 
                type="text"
                name="new_desc"
                placeholder="Description"
                value={dbDescription}
                onChange={handleChangeForDbDescription}
                data-test="new-chart-name"
                className='col-set'
              />
              </div>
            </FormItem>
          </Form>
          {/* {renderChildForms(dbData)} */}
          <div className='container-chart'>
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
          {dbDimensions?.filter((dim) => dim !== undefined).length > 0 && (
            <div className="section">
              <div className="column-label">Dimensions</div> 
              <div className='column-set'>
                {dbDimensions.filter((dim) => dim !== undefined).map((dimension: string, index: number) => (
                  <div key={index} className="column">{dimension}</div>
                ))}
              </div>
            </div>
          )}
         
            {dbFilters.length > 0 && (
              <div className="section">
                <div className="column-label">Filters</div> 
                <div className='column-set'>
                  {dbFilters.map((filter: string, index: number) => (
                    <div key={index} className="column">{filter}</div>
                  ))}
                </div>
              </div>
              )}
          </div>
          </>} {
            !checkData && <> 
          <Form data-test="save-modal-body" layout="vertical">
            <FormItem label={t('Druid SQL Query')} required
            help={checkQuery ? <span style={{ color: 'red' }}>Druid SQL Query is required</span> : null}
            
            >
              <div className='outer-div'> 
              <Input 
                name="new_slice_name"
                type="text"
                placeholder="Name"
                value={modifiedQuery}
                data-test="new-chart-name"
                className='col-set'
              />
              </div>
            </FormItem>
            <FormItem label={t('Description')} required
            help={checkDescription ? <span style={{ color: 'red' }}>Description must be atleast 4 characters long.</span> : null}
            >
              <div className='outer-div'> 
              <Input 
                type="text"
                name="new_desc"
                placeholder="Description"
                value={description}
                onChange={handleChangeForDescription}
                data-test="new-chart-name"
                className='col-set'
              />
              </div>
            </FormItem>
          </Form>
          <div className='container-chart'>
          {newMetrics?.length > 0 && (
            <div className="section">
              <div className="column-label">Metrics</div> 
              <div className="column-set">
                {newMetrics.map((metric: string, index: number) => (           
                  <div key={index} className="column">
                    {metric} 
                  </div>
                ))}
              </div>
            </div>
          )}
          {dimensions?.
          // filter((dim) => dim !== undefined).
          length > 0 && (
            <div className="section">
              <div className="column-label">Dimensions</div> 
              <div className='column-set'>
                {dimensions.filter((dim) => dim !== undefined).map((dimension: string, index: number) => (
                  <div key={index} className="column">{dimension}</div>
                ))}
              </div>
            </div>
          )}
         
            {newFilters.length > 0 && (
              <div className="section">
                <div className="column-label">Filters</div> 
                <div className='column-set'>
                  {newFilters.map((filter: string, index: number) => (
                    <div key={index} className="column">{filter}</div>
                  ))}
                </div>
              </div>
              )}
          </div>            
            </>
          }
          </div>
          </StyledModal>
          
      )}
    </>
  );
};

export default AllChart;
