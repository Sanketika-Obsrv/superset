/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
/* eslint camelcase: 0 */

import { ChangeEvent, FormEvent, Component, Key, ReactChild, ReactFragment, ReactPortal } from 'react';
import { Dispatch,Store } from 'redux';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { InfoTooltipWithTrigger } from '@superset-ui/chart-controls';
import './saveChart.css';
// import  {
//   COLUMN_ENTRIES
// } from 'src/explore/components/controls/VizTypeControl/VizTypeGallery';
import {
  css,
  DatasourceType,
  // isDefined,
  styled,
  // SupersetClient,
  t,
} from '@superset-ui/core';
import { Input } from 'src/components/Input';
import { Form, FormItem } from 'src/components/Form';
// import Alert from 'src/components/Alert';
import Modal from 'src/components/Modal';
import Button from 'src/components/Button';
// import { AsyncSelect } from 'src/components';
import Loading from 'src/components/Loading';
// import { canUserEditDashboard } from 'src/dashboard/util/permissionUtils';
import { newSetSaveChartModalVisibility } from 'src/explore/actions/saveModalActions';
import { SaveActionType } from 'src/explore/types';
import { UserWithPermissionsAndRoles } from 'src/types/bootstrapTypes';
import { store } from 'src/views/store';
// import { Dashboard } from 'src/types/Dashboard';
import  ThumbnailGallery  from './controls/VizTypeControl/VizTypeGallery';
import BarChart from './Chart/BarChart';

// Session storage key for recent dashboard
const SK_DASHBOARD_ID = 'save_chart_recent_dashboard';


interface SaveModalProps extends RouteComponentProps {
  addDangerToast: (msg: string) => void;
  actions: Record<string, any>;
  form_data?: Record<string, any>;
  user: UserWithPermissionsAndRoles;
  alert?: string;
  sliceName?: string;
  slice?: Record<string, any>;
  datasource?: Record<string, any>;
  // dashboardId: '' | number | null;
  isVisible: boolean;
  dispatch: Dispatch;
  chart?:any;
  controls?:any;
  columnEntries?:any;
}

let reduxValue = "";

type SaveModalState = {
  reduxValue?:string;
  newSliceName?: any;
  newSliceData?: string;
  datasetName: string;
  newDatasetName?:string;
  dropDownX:string;
  dropDownY:string;
  action: SaveActionType;
  isLoading: boolean;
  saveStatus?: string | null;
  dashboard?: { label: string; value: string | number };
  chart?:any;
  colVal?:string;
  selectedValue?:any;
  vizType?:any;
  vizEntries?:any;
  columnEntries?:any;
};

export const StyledModal = styled(Modal)`
  .ant-modal-body {
    overflow: visible;controls
  }
  i {
    position: absolute;
    top: -${({ theme }) => theme.gridUnit * 5.25}px;
    left: ${({ theme }) => theme.gridUnit * 26.75}px;
  }
`;

const charts = store.getState().charts;
const dynamicKey = Object.keys(charts)[0]; 
// const storeValue = store.getState().charts[sliceId].queriesResponse[0].query;
// console.log(storeValue)

class SaveChart extends Component<SaveModalProps, SaveModalState> {
  chart: any;
  reduxState: any;
  dropdownOptions: { value: string; label: string; }[];
  constructor(props: SaveModalProps) {
    super(props);
    // console.log({ props})
console.log("this is store", store.getState())

const params = new URLSearchParams(window.location.search);

// Extract the values
const formDataKey = params.get('form_data_key');
const sliceId = params.get('slice_id') || 0;


// console.log(store.getState().charts)
// console.log(sliceId)
const storeValue = store.getState().charts[sliceId].queriesResponse[0].query;
const colValue = store.getState().charts[sliceId].queriesResponse[0].label_map;
const columnVal = Object.keys(colValue)[0];
// console.log(columnVal)
// console.log(this.state.vizType)

    // console.log(this.reduxState);
    console.log({props});
    
    this.reduxState = props
    this.state = {
      newSliceName: props.sliceName ,
      datasetName: storeValue,
      newDatasetName: props.chart.queriesResponse[0].query,
      dropDownX: this.reduxState.controls.x_axis.value,
      dropDownY: this.reduxState.chart.sliceFormData.groupby[0],
      action: 'saveas',
      isLoading: false,
      dashboard: undefined,
      selectedValue: '',
      colVal:columnVal    };
    this.onDashboardChange = this.onDashboardChange.bind(this);
    this.onSliceNameChange = this.onSliceNameChange.bind(this);
    this.handleDatasetNameChange = this.handleDatasetNameChange.bind(this);
    this.changeAction = this.changeAction.bind(this);
    this.onHide = this.onHide.bind(this);
    this.handleChangeForX = this.handleChangeForX.bind(this);
    this.handleChangeForY = this.handleChangeForY.bind(this);

    this.chart = props?.chart;
    this.dropdownOptions = props.controls.adhoc_filters.columns.map((column:any) => ({
      value: column.value,// Replace 'value' with the key for the option's value
      label: column.label, // Replace 'label' with the key for the option's display text
    }));
    // //Changed
    // console.log("My props",props.controls.adhoc_filters.columns)
    console.log("State",this.state);
  }
  canOverwriteSlice(): boolean {
    return (
      this.props.slice?.owners?.includes(this.props.user.userId) &&
      !this.props.slice?.is_managed_externally
    );
  }


  handleDatasetNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newDatasetName: event.target.value });

  };

  handleChangeForX = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({dropDownX:event.target.value});

  };

  handleChangeForY = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({dropDownY:event.target.value});

  };

  onSliceNameChange(event: ChangeEvent<HTMLInputElement>) {
    this.setState({ newSliceName: event.target.value });
  }

  onDashboardChange(dashboard: { label: string; value: string | number }) {
    this.setState({ dashboard });
  }

  changeAction(action: SaveActionType) {
    this.setState({ action });
  }

  onHide() {
    this.props.dispatch(newSetSaveChartModalVisibility(false));
  }



  onReset = () => {
    this.setState({
      newSliceName: "", 
      dashboard: undefined,  
      newDatasetName: "",
      datasetName:"",
      dropDownX:"",
      dropDownY:""
    });
  };

  //
  // componentDidMount() {
  //   if(this.reduxState.controls.viz_type.value === "echarts_timeseries_bar" || this.reduxState.controls.viz_type.value === "echarts_timeseries_line")
  //   // this.setState({ dropDownX: this.reduxState.controls.x_axis.value});
  //   // this.setState({ dropDownY: this.reduxState.chart.sliceFormData.groupby[0]});
  //   this.setState({ dropDownX: ""});
  //   this.setState({ dropDownY: ""});
  //   if(this.reduxState.controls.viz_type.value === "echarts_timeseries_bar"){
  //     this.setState({ dropDownX: ""});
  //     this.setState({ dropDownY: ""});
  //   }
  // }

  

  // handleDropdownChange = (event: { target: { value: any; }; }) => {
    // this.setState({ columnVal: event.target.value });
  // };

  async saveOrOverwrite(gotodash: boolean) {
    this.setState({ isLoading: true });
    // console.log("Datasource",this.props.datasource);
    // console.log("Dataset name ",this.state.datasetName);
    
    //  Create or retrieve dashboard
    type DashboardGetResponse = {
      id: number;
      url: string;
      dashboard_title: string;
    };

    try {
      if (this.props.datasource?.type === DatasourceType.Query) {
        const { schema, sql, database } = this.props.datasource;
        const { templateParams } = this.props.datasource;

        await this.props.actions.saveDataset({
          schema,
          sql,
          database,
          templateParams,
          datasourceName: this.state.datasetName,
        });
      }

      //  Get chart dashboards
      let sliceDashboards: number[] = [];
      if (this.props.slice && this.state.action === 'overwrite') {
        sliceDashboards = await this.props.actions.getSliceDashboards(
          this.props.slice,
        );
      }

      const formData = this.props.form_data || {};
      delete formData.url_params;


      // Sets the form data
      this.props.actions.setFormData({ ...formData });

      //  Update or create slice
      let value: { id: number };
      if (this.state.action === 'overwrite') {
        value = await this.props.actions.updateSlice(
          this.props.slice,
          this.state.newSliceName,
          sliceDashboards,
          
        );
      } else {
        value = await this.props.actions.createSlice(
          this.state.newSliceName,
          sliceDashboards,
          
        );
      }

      


      // const searchParams = this.handleRedirect(window.location.search, value);
      // this.props.history.replace(`/explore/?${searchParams.toString()}`);

      this.setState({ isLoading: false });
      this.onHide();
    } 
    finally {
      this.setState({ isLoading: false });
    }
  }

  renderSaveChartModal = () => {
    const columnArray = this.props.controls.adhoc_filters.columns;
    // console.log(columnArray)
    const {chart} = this.props;
    // const formData = query.form_data;
    // console.log("NewData:",formData)
    // console.log(this.reduxState.chart.sliceFormData.groupby[0])
    // console.log(chart.queriesResponse[0].query);
    const charts = store.getState().charts;
    const keys = Object.keys(charts);
// const dynamicKey = Object.keys(charts)[0]; 
// console.log("X-axis",this.reduxState);
console.log("Redux data",this.reduxState);
// console.log("Chart data",this.reduxState.controls.viz_type.value);

// console.log("Slice form data value",this.reduxState.chart.sliceFormData.x_axis);

// console.log("Y-axis value",this.reduxState.chart.sliceFormData.groupby[0]);
// console.log("X-axis",this.reduxState.chart.sliceFormData.x_axis);


// console.log(this.state.dropDownX)
// console.log(this.state.dropDownY)

const columnKeys = columnArray ? Object.values(columnArray) : [];
console.log(columnArray);

//New 

    return (

      <>
      <Form
       data-test="save-modal-body" layout="vertical"
       >
        <FormItem label={t('Chart name')} required>
          <Input
            name="new_slice_name"
            type="text"
            placeholder="Name"
            value={this.state.newSliceName}
            onChange={this.onSliceNameChange}
            data-test="new-chart-name"
          />
        </FormItem>
        
        <FormItem label={t('Druid SQL Query')}>
          <Input
            name="new_slice_name"
            type="text"
            data-test="druid-sql-query"
            value={this.state.newDatasetName}
            onChange={this.handleDatasetNameChange}
          />
        </FormItem>
<div className="dropdown-container">
  <label htmlFor="dropdown">X-axis </label>
  <select
    id="dropdown"
    value={this.state.dropDownX} 
    onChange={this.handleChangeForX}
  >
    {columnKeys.map((columnKey: any, index) => (
      <option
        key={index}
        value={columnKey?.column_name}
        selected={
          columnKey?.column_name === this.reduxState.controls.x_axis.value
        }
      >
        {columnKey?.column_name}
      </option>
    ))}
  </select>
</div>

  
  <div className="dropdown-container">
  <label htmlFor="dropdown">Y-axis</label>
  <select
    id="dropdown"
    value={this.state.dropDownY} 
    onChange={this.handleChangeForY} 
  >
    {columnKeys.map((columnKey: any, index) => (
      <option key={index}
      value={columnKey?.column_name}
      selected={
        columnKey?.column_name === this.reduxState.chart.sliceFormData.groupby[0]
      }
       >
        {columnKey?.column_name}
      </option>
    ))}
  </select>
</div>

</Form>

      </>
    );
  };
  
  
  renderFooter = () => (
    <div data-test="save-modal-footer">
      <Button id="btn_cancel" 
      buttonSize='small' 
      buttonStyle='danger' 
      onClick={() => {
        this.onReset();
      }}
      >
        {t('Reset')}
      </Button>
      <Button
        id="btn_modal_save"
        buttonStyle="primary"
        onClick={() => {
          console.log("Chart Name :", this.state.newSliceName);
          console.log("Chart Description :",this.state.newDatasetName);
          console.log("X-axis Column :",this.state.dropDownX);
          console.log("Y-axis Column :",this.state.dropDownY);
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
      </Button>
    </div>
  );

  render() {
    return (
      <StyledModal
        show={this.props.isVisible}
        onHide={this.onHide}
        title={t('Create a New Chart')}
        footer={this.renderFooter()}
      >
        {this.state.isLoading ? (
          <div
            css={css`
              display: flex;
              justify-content: center;
            `}
          >
            <Loading position="normal" />
          </div>
        ) : (
          this.renderSaveChartModal()
        )}
      </StyledModal>
    );
  }
}
// console.log('Form Data Key:', formDataKey);
  // console.log('Slice ID is :', sliceId);

interface StateProps {
  datasource: any;
  slice: any;
  user: UserWithPermissionsAndRoles;
  dashboards: any;
  alert: any;
  isVisible: boolean;
}


function mapStateToProps({
  explore,
  saveChart,
  user,
}: Record<string, any>): StateProps {
  // console.log({explore})
  return {
    datasource: explore.datasource,
    slice: explore.slice,
    user,
    dashboards: saveChart.dashboards,
    alert: saveChart.saveModalAlert,
    isVisible: saveChart.isVisible,
  };
}

export default withRouter(connect(mapStateToProps)(SaveChart));

// User for testing purposes need to revisit once we convert this to functional component
export { SaveChart as PureSaveModal };
  function setResult(arg0: any[]) 
  {
    throw new Error('Function not implemented.');
  }
