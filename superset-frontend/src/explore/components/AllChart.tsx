import React, { useCallback, useEffect, useState } from 'react';
import LineChart from './Chart/LineChart';
import AreaChart from './Chart/AreaChart';
import { store } from 'src/views/store';
import BarChart from './Chart/BarChart';
import { Input } from 'src/components/Input';
import { Form, FormItem } from 'src/components/Form';
import { styled, t } from '@superset-ui/core';
import Modal from 'src/components/Modal';
import {setAllChartModalVisibility} from 'src/explore/actions/saveModalActions';
import { useDispatch } from 'react-redux';
import { any } from 'lodash/fp';
import Button from 'src/components/Button';
import Chord from './Chart/Chord';
import CountryChart from './Chart/CountryChart';
import BigNumberTotal from './Chart/BigNumberTotal';
import BubbleChart from './Chart/BubbleChart';
import Bubble from './Chart/Bubble';
import DeckChart from './Chart/DeckChart';
import EventChart from './Chart/EventChart';
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
  console.log({ charts });
  const dispatch = useDispatch();
  console.log({props});
  
  console.log(store.getState());
  
  const storeValue = store.getState().charts[sliceId];
  const chartName = store.getState().charts[sliceId].latestQueryFormData.viz_type;
  console.log(chartName);
  let timeInterval = '';
  if(props.chart.latestQueryFormData.adhoc_filters[0]?.comparator !== undefined){
    timeInterval = props.chart.latestQueryFormData.adhoc_filters[0].comparator;
  }
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
    // "mixed_timeseries":<AreaChart/>,
    "rose":<AreaChart/>,
    "paired_ttest":<AreaChart/>,
    "para":<AreaChart/>,
    "partition":<AreaChart/>,
    "pie":<BigNumberTotal/>,
    "pivot_table_v2":<AreaChart/>,
    "radar":<AreaChart/>,
    "sankey_v2":<Chord/>,
    // "sankey":<Chord/>,
    "echarts_timeseries_scatter":<AreaChart/>,
    "echarts_timeseries_smooth":<AreaChart/>,
    "echarts_timeseries_step":<AreaChart/>,
    "sunburst_v2":<AreaChart/>,
    "table":<AreaChart/>,

    }

  const renderChildForms=()=>{
    return React.cloneElement(chartsmaps[chartName], {props}) 
  }

  useEffect(() => {
  },[name,query]);

  const handleNameChange = (event: { target: { value: any; }; }) => {
    setName(event.target.value);
  };

  const handleQueryChange = (event: { target: { value: any; }; }) => {
    setQuery(event.target.value);
  };

  const handleCloseModal = useCallback(() => {
    dispatch(setAllChartModalVisibility(false));
  },[dispatch])

  const onReset=()=>{
    setName('');
    setQuery('');
  }


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
              <Input
                name="new_slice_name"
                type="text"
                placeholder="Name"
                value={name}
                onChange={handleNameChange}
                data-test="new-chart-name"
              />
            </FormItem>
            <FormItem label={t('Druid SQL Query')} required>
              <Input
                name="new_druid_sql_query"
                type="text"
                placeholder="SQL_Query"
                value={query}
                onChange={handleQueryChange}
                data-test="new-chart-name"
              />
            </FormItem>
            {timeInterval !== undefined && (
                <FormItem label={t('Filters')} required>
                  <Input
                    name="filters"
                    type="text"
                    placeholder="Name"
                    value={timeInterval}
                    data-test="new-chart-name"
                  />
                </FormItem>
              )}
          </Form>
          {renderChildForms()}
          <div data-test="save-modal-footer">
      <Button id="btn_cancel" 
      buttonSize='small' 
      buttonStyle='danger' 
      onClick={() => {
        onReset();
      }}
      >
        {t('Reset')}
      </Button>
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
