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
import { addSuccessToast } from 'src/components/MessageToasts/actions';
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
  const {onOpen, sliceName} = props;
  const params = new URLSearchParams(window.location.search);
  const sliceId = params.get('slice_id') || 0;
  // const sliceId:any = params.get('slice_id');

  const reduxQuery = store?.getState()?.charts[sliceId]?.queriesResponse[0]?.query;
  const charts = store.getState();
  const [name,setName] = useState(props.sliceName);
  const [query,setQuery] = useState(reduxQuery);
  // console.log(reduxQuery,"reduxQuery");
  const [dbDimensions,setDbDimensions] = useState();
  // console.log({ charts });
  const dispatch = useDispatch();
  // console.log({props});
  // console.log(query,"old query");
  
  const checkTimeInterval = charts?.explore?.form_data?.adhoc_filters[0]?.comparator;
  const operator = charts?.explore?.form_data?.adhoc_filters[0]?.operator;
  const filters = charts?.explore?.form_data?.adhoc_filters;
  
  const [checkName,setCheckName] = useState(false);
  const [checkDescription,setCheckDescription] = useState(false);
  const [checkQuery,setCheckQuery] = useState(false);

  let modifiedQuery = '';
const newQuery1 = newQuery(query,filters);

function modifyWhereClause(query: string, newWhereClause: string) {
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
// console.log("query",query);

const [dbData,setDbData] = useState({});


let result = modifyWhereClause(query,newQuery1);
if (modifiedQuery.includes(';')) {
  modifiedQuery = modifiedQuery.replace(/;/g, '');
} else {
}
const [dbName,setDbName] = useState();
  
  const storeValue = store.getState().charts[sliceId];
  const chartName = store?.getState()?.charts[sliceId]?.latestQueryFormData?.viz_type;
  console.log(chartName);
  const [configuration,setConfiguration] = useState();
  const [description,setDescription] = useState<any>();
  

// console.log("time interval",timeInterval);
// console.log("Time",charts?.explore?.slice?.form_data?.adhoc_filters[0]?.comparator);


  const chartsmaps:any={
    "echarts_area":<AreaChart setConfiguration={setConfiguration} dbDimensions={dbDimensions}/>,
    "echarts_timeseries_line":<BarChart setConfiguration={setConfiguration} dbDimensions={dbDimensions}/>,
    "echarts_timeseries_bar":<BarChart setConfiguration={setConfiguration} dbDimensions={dbDimensions}/>,
    "echarts_timeseries":<AreaChart/>,
    "dist_bar":<AreaChart />,
    "big_number":<BigNumberTotal/>,
    "big_number_total":<BigNumberTotal/>,
    "box_plot":<AreaChart/>,
    "bubble_v2":<BubbleChart/>,
    "bubble":<Bubble/>,
    "bullet":<AreaChart/>,
    "cal_heatmap":<AreaChart/>,
    "chord":<Chord/>,
    "country_map":<CountryChart/>,
    "deck_hex":<DeckChart/>,
    "deck_arc":<DeckChart/>,
    "deck_contour":<DeckChart/>,
    "deck_geojson":<DeckChart/>,
    "deck_grid":<DeckChart/>,
    "deck_heatmap":<DeckChart/>,
    "deck_multi":<DeckChart/>,
    "deck_path":<DeckChart/>,
    "deck_polygon":<DeckChart/>,
    "deck_scatter":<DeckChart/>,
    "deck_screengrid":<DeckChart/>,
    "event_flow":<EventChart/>,
    "funnel":<BigNumberTotal/>,
    "gauge_chart":<BigNumberTotal/>,
    "graph_chart":<Chord/>,
    "handlebars":<AreaChart/>,
    "heatmap_v2":<BigNumberTotal/>,
    "heatmap":<BigNumberTotal/>,
    "histogram_v2":<BigNumberTotal/>,
    "histogram":<BigNumberTotal/>,
    "horizon":<BigNumberTotal/>,
    "mapbox":<BigNumberTotal/>,
    "mixed_timeseries":<AreaChart/>,
    "rose":<AreaChart/>,
    "paired_ttest":<AreaChart/>,
    "para":<AreaChart/>,
    "partition":<AreaChart/>,
    "pie":<BigNumberTotal/>,
    "pivot_table_v2":<AreaChart/>,
    "radar":<AreaChart/>,
    "sankey_v2":<Chord/>,
    "sankey":<Chord/>,
    "echarts_timeseries_scatter":<AreaChart/>,
    "echarts_timeseries_smooth":<AreaChart/>,
    "echarts_timeseries_step":<AreaChart/>,
    "sunburst_v2":<AreaChart/>,
    "table":<AreaChart  setConfiguration={setConfiguration} dbDimensions={dbDimensions}/>,
    "time_pivot":<AreaChart/>,
    "waterfall":<AreaChart/>,
    "time_table":<AreaChart/>,
    "tree_chart":<AreaChart/>,
    "treemap_v2":<AreaChart/>,
    "word_cloud":<AreaChart/>,
    "world_map":<AreaChart/>,

    }

  const [getData,setGetData] = useState(false);

    const renderChildForms=(dbData: any)=>{
      return React.cloneElement(chartsmaps[chartName], {...props, dbData, name}) 
    }
    
  const columns = props?.controls?.adhoc_filters?.columns;
  const columnNames = columns.map((item: { column_name: any; }) => item.column_name);  

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
      setDbName(data.result.name);
      setDbData(data);
console.log(data);

      if (response.ok) {
        setName(data.result.name)
        setDescription(data.result.description)
        
        setDbDimensions(data.result.configuration.dimensions)
        
        if(result === data.result.query){
          setQuery(data.result.query)
        }else {
          setQuery(result)
        }
      } else {
        console.error(`Failed to get chart`);
      }
    } catch (error) {
      console.error(`An error occurred while retriving the chart`);
    }
  };
  useEffect(() => {
    if(sliceId !== 0 && !getData){
      setGetData(true)
      getChart(sliceId)
    }
    if(name !== dbName){
      setName(props.sliceName)
    }
  }, [dbData]);
  


  const handleCloseModal = useCallback(() => {
    dispatch(setAllChartModalVisibility(false));
  },[dispatch])

  const handleNameChange = (event: { target: { value: any; }; }) => {
      setName(event.target.value);
  };
  const handleChangeForDescription = (event: { target: { value: any; }; }) => {
    setDescription(event.target.value); 
  };
  // const handleQueryChange = (event: { target: { value: any; }; }) => {
  //   setQuery(event.target.value);
  // };
  
  const getType=(type:string)=>{
    const typeMaps:any={
      "echarts_timeseries_line":"line",
      "echarts_timeseries_bar":"bar"
    }
    return typeMaps[type]
  }
  

  if(modifiedQuery === ''){
    modifiedQuery=query;
  }
// console.log("modifiedQuery",modifiedQuery);

const deleteChart = async (sliceId: any) => {
  const slice_ID = parseInt(sliceId)
  try {
    const response = await fetch(`${CHART_BASE_URL}/charts/delete/${slice_ID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      handleCloseModal()
      console.log(data); 
    } else {
      console.error(`Failed to delete chart`);
    }
  } catch (error) {
    console.error(`An error occurred while deleting the chart`);
  }
};

const saveChart = async (sliceId: string | number) => {
  const updateData = {
    name: name,
    query: result,
    description: description,
    type: getType(charts?.explore?.form_data?.viz_type) || 'line',
    configuration: configuration,
    slice_id: sliceId,
  };
  if (name?.length < 4 || name?.length > 40) {
    setCheckName(true); 
    console.error('Chart name must be between 4 and 40 characters long.');
    return;
  } else {
    setCheckName(false);
  }
  if (description?.length < 4) {
    setCheckDescription(true);
    console.error('Description length must be more than 4 characters.');
    return;
  }else {
    setCheckDescription(false)
  }
  if(result === undefined){
    setCheckQuery(true);
    console.error('Query is required');
    return;
  }else {
    setCheckQuery(false);
  }
  if(sliceId !== 0){
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
      handleCloseModal()
      addSuccessToast(t('Chart has been saved successfully'))
      console.log(data);
    } else {
      setCheckDescription(true)
      console.error('Description length must be more than 4 characters.');
    }
  } 
  catch (error) {
    console.error('An error occurred while updating the chart');
  }
}else {
  console.error("First save the chart to generate slice id")
}
};

// console.log(modifiedQuery,"new query");

  console.log(checkName)
  const renderFooter = () => (
    <div data-test="save-modal-footer">
      <Button className='delete_chart'
      onClick={()=>deleteChart(sliceId)}
      buttonStyle="danger"
      >
        {t('Delete')}
      </Button> 
       <Button className='update_chart'
        onClick={()=>saveChart(sliceId)}
        data-test="btn-modal-save"
      buttonStyle="primary"
      >
        {t('Save')}
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
          title={t('Edit Chart')}
        >

          <Form data-test="save-modal-body" layout="vertical">
          <FormItem 
            label={t('Chart name')} 
            required 
            help={checkName ? <span style={{ color: 'red' }}>Chart name must be between 4 and 40 characters long.</span> : null}
          >
            <div className='outer-div'>
              <Input 
                name="new_slice_name"
                type="text"
                placeholder="Name"
                value={name}
                // onChange={handleNameChange}
                data-test="new-chart-name"
                className='col-set'
              />
            </div>
          </FormItem>
          {/* {
          <div className="section">
            <div className="column-label">Druid DSL Query</div> 
            <div className='column-set'>
            {name}
            </div>
          </div>
          }  */}
            <FormItem label={t('Druid SQL Query')} required
            help={checkQuery ? <span style={{ color: 'red' }}>Druid SQL Query is required</span> : null}
            
            >
              <div className='outer-div'> 
              <Input 
                name="new_slice_name"
                type="text"
                placeholder="Name"
                value={modifiedQuery}
                // onChange={handleQueryChange}
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
          {renderChildForms(dbData)}
         
         
          </StyledModal>
          
      )}
    </>
  );
};

export default AllChart;
