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
import DndSelectLabel from 'src/explore/components/controls/DndColumnSelectControl/DndSelectLabel';
import callApi from 'packages/superset-ui-core/src/connection/callApi/callApi';
import axios from 'axios';
export const StyledModal = styled(Modal)`
  .ant-modal-body {
    overflow: visible;
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
  const reduxQuery = store.getState().charts[sliceId].queriesResponse[0].query;
  const charts = store.getState();
  const [name,setName] = useState(props.sliceName);
  const [query,setQuery] = useState(reduxQuery);
  const [timeCol,setTimeCol] = useState(props?.form_data?.granularity_sqla ? props?.form_data?.granularity_sqla : undefined);
  const [metrics,setMetrics] = useState(props?.form_data?.metrics ? props?.form_data?.metrics[0]?.column?.column_name : undefined);
  const [columnValueNames, setColumnValueNames] = useState<string[]>([]);
  console.log({ charts });
  const dispatch = useDispatch();
  console.log({props});
  
  const checkTimeInterval = charts?.explore?.form_data?.adhoc_filters[0]?.comparator;
  const operator = charts?.explore?.form_data?.adhoc_filters[0]?.operator;
  const filters = charts?.explore?.form_data?.adhoc_filters;
  


let check = false;
// const modifiedQuery = modifyQueryToRelative(query,checkTimeInterval);
// console.log(modifiedQuery);
console.log(query);

const newQuery1 = newQuery(query,filters);
// console.log(newQuery1);

function modifyWhereClause(query: string, newWhereClause: string) {
  try {
    const whereRegex = /WHERE(.*?)(GROUP BY|ORDER BY|LIMIT|$)/s;

    const match = query?.match(whereRegex);

    if (!match) {
      throw new Error("No WHERE clause found in the query");
    }

    const originalWhere = match[1];
    const trailingPart = match[2] || ""; 
    let modifiedQuery = query.replace(
      `WHERE${originalWhere}${trailingPart}`,
      `${newWhereClause} ${trailingPart}`
    );
    modifiedQuery = modifiedQuery.trim(); 
    if (modifiedQuery.endsWith(";")) {
      modifiedQuery = modifiedQuery.slice(0, -1); 
    }
    
    return modifiedQuery;
  } catch (error) {
    console.error("Error modifying the WHERE clause:", error.message);
    return query; 
  }
}



const result = modifyWhereClause(query,newQuery1);
console.log(result);

  
  const storeValue = store.getState().charts[sliceId];
  const chartName = store.getState().charts[sliceId].latestQueryFormData.viz_type;
  console.log(chartName);
  const [timeInterval,setTimeInterval] = useState(props?.form_data?.adhoc_filters[0]?.comparator);

  

// console.log("time interval",timeInterval);
// console.log("Time",charts?.explore?.slice?.form_data?.adhoc_filters[0]?.comparator);



  const chartsmaps:any={
    "echarts_area":<AreaChart/>,
    "echarts_timeseries_line":<AreaChart/>,
    "echarts_timeseries_bar":<AreaChart/>,
    "echarts_timeseries":<AreaChart/>,
    "dist_bar":<AreaChart/>,
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
    "table":<AreaChart/>,
    "time_pivot":<AreaChart/>,
    "waterfall":<AreaChart/>,
    "time_table":<AreaChart/>,
    "tree_chart":<AreaChart/>,
    "treemap_v2":<AreaChart/>,
    "word_cloud":<AreaChart/>,
    "world_map":<AreaChart/>,

    }

  const renderChildForms=()=>{
    return React.cloneElement(chartsmaps[chartName], {props}) 
  }
  
  const columns = props?.controls?.adhoc_filters?.columns;
  const columnNames = columns.map((item: { column_name: any; }) => item.column_name);  

  useEffect(() => {
  },[name,query,filters]);

  const handleNameChange = (event: { target: { value: any; }; }) => {
    setName(event.target.value);
  };

  const handleQueryChange = (event: { target: { value: any; }; }) => {
    setQuery(event.target.value);
  };



  const callApi = async () => {
    const data = {
        name: name || "default name",
        query: query || "SELECT * FROM my_table;",
        description: "This is a description",
        type: "line",
        configuration: { xAxis: "month", yAxis: "sales" }
    };

    try {
        const response = await axios.post('http://localhost:8088/charts', data);
        console.log('Response:', response.data); 
    } catch (error) {
        console.error('Error calling API:', error);
        if (error.response) {
            console.error('Response Data:', error.response.data);
        }
    }
};


  const handleCloseModal = useCallback(() => {
    dispatch(setAllChartModalVisibility(false));
  },[dispatch])

  const onReset=()=>{
    setName('');
    setQuery('');
  }

console.log(name);

  return (
    <>
      {onOpen && (
        <StyledModal
          show={onOpen}
          onHide={handleCloseModal}
          footer={null}
          title={t('Edit Chart')}
        >
          <Form data-test="save-modal-body" layout="vertical">
          <FormItem label={t('Chart name')} required>
              <div className='outer-div'>
              <Input 
                name="new_slice_name"
                type="text"
                placeholder="Name"
                value={name}
                onChange={handleNameChange}
                data-test="new-chart-name"
                className='col-set'
              />
              </div>
            </FormItem>
            <FormItem label={t('Druid SQL Query')} required>
              <div className='outer-div'> 
              <Input 
                name="new_slice_name"
                type="text"
                placeholder="Name"
                value={query}
                onChange={handleQueryChange}
                data-test="new-chart-name"
                className='col-set'
              />
              </div>
            </FormItem>
            <Button onClick={callApi}>Call api</Button>
          </Form>
          {renderChildForms()}
          <div data-test="save-modal-footer">
      {/* <Button id="btn_cancel" 
      buttonSize='small' 
      buttonStyle='danger' 
      onClick={() => {
        onReset();
      }}
      >
        {t('Reset')}
      </Button> */}
      {/* <Button
        id="btn_modal_save"
        buttonStyle="primary"
        onClick={() => {
          this.saveOrOverwrite(false)
          this.onHide();
        }}
        disabled={
          this.state.isLoading ||
          !this.state.newSliceName ||
          (this.props.datasource?.type !== DatasourceType.Table &&
            !this.state.datasetName)
        }
        data-test="btn-modal-save"
      >
        {t('Save')}
      </Button> */}
      </div>
         
          </StyledModal>
          
      )}
    </>
  );
};

export default AllChart;
