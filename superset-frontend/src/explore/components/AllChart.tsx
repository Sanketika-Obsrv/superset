import React, { useCallback, useEffect, useState } from 'react';
import { store } from 'src/views/store';
import { Input } from 'src/components/Input';
import { Form, FormItem } from 'src/components/Form';
import { styled, t } from '@superset-ui/core';
import Modal from 'src/components/Modal';
import { setAllChartModalVisibility } from 'src/explore/actions/saveModalActions';
import { useDispatch } from 'react-redux';
import Button from 'src/components/Button';
import { newQuery } from './utils/ModifiedQuery';
import { CHART_BASE_URL } from 'packages/superset-ui-core/src/connection/constants';
import { addDangerToast, addSuccessToast } from 'src/components/MessageToasts/actions';
import './AllChart.css';

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
  const { onOpen, sliceName } = props;
  const params = new URLSearchParams(window.location.search);
  const sliceId = params.get('slice_id') || 0;
  const redux_store = store.getState();
  console.log({ redux_store });
  const [query, setQuery] = useState(redux_store?.charts[sliceId]?.queriesResponse[0]?.query);
  const dispatch = useDispatch();
  // const deleteChartId = redux_store?.deleteChart.id;

  const [description, setDescription] = useState();
  const filters = redux_store?.explore?.form_data?.adhoc_filters;
  const chartName = redux_store?.charts[sliceId]?.latestQueryFormData?.viz_type;
  const [checkDescription,setCheckDescription] = useState(false);

  const [filter, setFilter] = useState(
    filters
      .map((filter: any) => {
        if (filter.operator === 'TEMPORAL_RANGE' && filter.comparator) {
          return `${filter.subject} IN (${filter.comparator})`;
        } else if (filter.comparator === 'No filter' && filter.subject) {
          return `${filter.subject} (${filter.comparator})`;
        } else if (Array.isArray(filter.comparator) && filter.operator === 'IN') {
          return `${filter.subject} IN (${filter.comparator.join(', ')})`;
        } else if (Array.isArray(filter.comparator) && filter.operator === 'NOT IN') {
          return `${filter.subject} NOT IN (${filter.comparator.join(', ')})`;
        } else if (typeof filter.comparator === 'number' && filter.operator) {
          return `${filter.subject} ${filter.operator} ${filter.comparator}`;
        } else if (typeof filter.comparator === 'string' && filter.operator) {
          return `${filter.subject} ${filter.operator} '${filter.comparator}'`;
        } else if (filter.operator && filter.comparator === null) {
          return `${filter.subject} ${filter.operator}`;
        } else if (filter.sqlExpression) {
          return filter.sqlExpression;
        }
        return null;
      })
      .filter(Boolean) as string[]
  );

  let modifiedQuery = '';
  const newQuery1 = newQuery(query, filters);

  function modifyWhereClause(query: string, filters: any, newWhereClause: string) {
    try {
      const whereRegex = /WHERE(.*?)(GROUP BY|ORDER BY|LIMIT|$)/s;

      const match = query?.match(whereRegex);
      if (!match) {
        throw new Error('No WHERE clause found in the query');
      }
      const originalWhere = match[1];
      const trailingPart = match[2] || '';
      modifiedQuery = query.replace(
        `WHERE${originalWhere}${trailingPart}`,
        `${newWhereClause} ${trailingPart}`
      );
      return modifiedQuery;
    } catch (error) {
      return query;
    }
  }
useEffect(()=>{
  if(sliceId !== 0){
    getChart(sliceId);
  }

},[])
  const handleChangeForDescription = (event: { target: { value: any } }) => {
    setDescription(event.target.value);
  };
  let result = modifyWhereClause(query, filters, newQuery1);

  
  const getChart = async (sliceId: any) => {
    const slice_ID = parseInt(sliceId);

    try {
      const response = await fetch(`${CHART_BASE_URL}/charts/search/${slice_ID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setDescription(data.result.description);
      } else {
      }
    } catch (error) {
      // console.error(`An error occurred while retriving the chart`);
    }
  };

  const handleCloseModal = useCallback(() => {
    dispatch(setAllChartModalVisibility(false));
  }, [dispatch]);

  const resolveValue = (data: any) => {
    if (typeof data === 'string') {
      return data;
    }
    if (Array.isArray(data)) {
      const array = data?.map((metric: any) =>
        typeof metric === 'string' ? metric : metric.label
      );
      return array;
    }
    if (typeof data === 'object' && data !== null) {
      return data.label;
    }
  };

  const renderSingleValue = (data: any, key: string) => {
    if (data)
      return (
        <div className="section">
          <div className="column-label">{key}</div>
          <div className="column-set">
            <div className="column">{data}</div>
          </div>
        </div>
      );
    return null;
  };

  const renderArrayValue = (data: any, key: string) => {
    if (Array.isArray(data) && data.length > 0) {
      return (
        <div className="section">
          <div className="column-label">{key}</div>
          <div className="column-set">
            {data.map((metric: string, index: number) => (
              <div key={index} className="column">
                {metric}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const chartConfig = [
    {
      chartType: [
        'echarts_timeseries_bar',
        'echarts_area',
        'echarts_timeseries_smooth',
        'echarts_timeseries_step',
        'echarts_timeseries',
        'echarts_timeseries_line',
      ],
      fields: [
        {
          field: 'x-axis',
          resolvedValue: () => resolveValue(redux_store?.explore?.form_data?.x_axis),
          render: (data: any) => renderSingleValue(data, 'X Axis'),
        },
        {
          field: 'metrics',
          resolvedValue: () => resolveValue(redux_store?.explore?.form_data?.metrics),
          render: (data: any) => renderArrayValue(data, 'Metrics'),
        },
        {
          field: 'dimension',
          resolvedValue: () => resolveValue(redux_store?.explore?.form_data?.groupby),
          render: (data: any) => renderArrayValue(data, 'Dimension'),
        },
      ],
    },
    {
      chartType: ['bar', 'area', 'line', 'time_table'],
      fields: [
        {
          field: 'x-axis',
          resolvedValue: () => resolveValue(redux_store?.explore?.form_data?.granularity_sqla),
          render: (data: any) => renderSingleValue(data, 'X Axis'),
        },
        {
          field: 'metrics',
          resolvedValue: () => resolveValue(redux_store?.explore?.form_data?.metrics),
          render: (data: any) => renderArrayValue(data, 'Metrics'),
        },
        {
          field: 'dimension',
          resolvedValue: () => resolveValue(redux_store?.explore?.form_data?.groupby),
          render: (data: any) => renderArrayValue(data, 'Dimension'),
        },
      ],
    },
    {
      chartType: ['pivot_table_v2'],
      fields: [
        {
          field: 'columns',
          resolvedValue: () => resolveValue(redux_store?.explore?.form_data?.groupbyColumns),
          render: (data: any) => renderArrayValue(data, 'Columns'),
        },
        {
          field: 'metrics',
          resolvedValue: () => resolveValue(redux_store?.explore?.form_data?.metrics),
          render: (data: any) => renderArrayValue(data, 'Metrics'),
        },
        {
          field: 'rows',
          resolvedValue: () => resolveValue(redux_store?.explore?.form_data?.groupbyRows),
          render: (data: any) => renderArrayValue(data, 'Rows'),
        },
      ],
    },
    {
      chartType: ['big_number_total'],
      fields: [
        {
          field: 'metrics',
          resolvedValue: () => resolveValue(redux_store?.explore?.form_data?.metric),
          render: (data: any) => renderSingleValue(data, 'Metrics'),
        },
      ],
    },
    {
      chartType: ['big_number'],
      fields: [
        {
          field: 'x-axis',
          resolvedValue: () => resolveValue(redux_store?.explore?.form_data?.x_axis),
          render: (data: any) => renderSingleValue(data, 'X Axis'),
        },
        {
          field: 'metrics',
          resolvedValue: () => resolveValue(redux_store?.explore?.form_data?.metric),
          render: (data: any) => renderSingleValue(data, 'Metrics'),
        },
      ],
    },
    {
      chartType: ['sunburst_v2'],
      fields: [
        {
          field: 'dimension',
          resolvedValue: () => resolveValue(redux_store?.explore?.form_data?.columns),
          render: (data: any) => renderArrayValue(data, 'Dimenion'),
        },
        {
          field: 'metrics',
          resolvedValue: () => resolveValue(redux_store?.explore?.form_data?.metric),
          render: (data: any) => renderSingleValue(data, 'Metrics'),
        },
        {
          field: 'secondary-metrics',
          resolvedValue: () => resolveValue(redux_store?.explore?.form_data?.secondary_metric),
          render: (data: any) => renderSingleValue(data, 'Secondary Metrics'),
        },
      ],
    },
    {
      chartType: ['pie'],
      fields: [
        {
          field: 'dimension',
          resolvedValue: () => resolveValue(redux_store?.explore?.form_data?.groupby),
          render: (data: any) => renderArrayValue(data, 'X Axis'),
        },
        {
          field: 'metrics',
          resolvedValue: () => resolveValue(redux_store?.explore?.form_data?.metric),
          render: (data: any) => renderSingleValue(data, 'Metrics'),
        },
      ],
    },
    {
      chartType: ['table'],
      fields: [
        {
          field: 'metrics',
          resolvedValue: () => resolveValue(redux_store?.explore?.form_data?.metrics),
          render: (data: any) => renderArrayValue(data, 'Metrics'),
        },
        {
          field: 'dimension',
          resolvedValue: () => resolveValue(redux_store?.explore?.form_data?.groupby),
          render: (data: any) => renderArrayValue(data, 'Dimensions'),
        },
        {
          field: 'percentage-metrics',
          resolvedValue: () => resolveValue(redux_store?.explore?.form_data?.percent_metrics),
          render: (data: any) => renderArrayValue(data, 'Percentage Metrics'),
        },
      ],
    },
  ];

  const renderChartContent = () => {
    const config = chartConfig.find((config) => config.chartType.includes(chartName));
    if (!config) return null;
    return (
      <>
        {config.fields.map((field, index) => (
          <div key={index}>{field.render(field.resolvedValue())}</div>
        ))}
      </>
    );
  };

  const gatherChartConfiguration = () => {
    const config = chartConfig.find((config) => config.chartType.includes(chartName));
    if (!config) return {};

    const configuration: any = {};
    config.fields.forEach((field) => {
      configuration[field.field] = field.resolvedValue();
    });

    return configuration;
  };

  const saveChart = async (sliceId: string | number, dispatch: any) => {
    const configuration = gatherChartConfiguration();
    const updateData = {
      description: description,
      query: result,
      configuration: configuration,
      slice_id: sliceId,
    };

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
          dispatch(addSuccessToast(t(`Chart [${sliceName}] has been published successfully.`)));
        }
        else {
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
    handleCloseModal();
  }

  const renderFooter = () => (
    <div data-test="save-modal-footer">
      <Button className="cancel_chart" onClick={onHide}>
        {t('Cancel')}
      </Button>
      <Button
        className="update_chart"
        onClick={() => saveChart(sliceId, dispatch)}
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
          <Form data-test="save-modal-body" layout="vertical">
            <FormItem label={t('Description')} required
            help={checkDescription ? <span style={{ color: 'red' }}>Description must be atleast 4 characters long.</span> : null}
            >
              <div className="outer-div">
                <Input
                  type="text"
                  name="new_desc"
                  placeholder="Description"
                  value={description}
                  onChange={handleChangeForDescription}
                  data-test="new-chart-name"
                  className="col-set"
                />
              </div>
            </FormItem>
            <div className="container-chart">
              {query && (
                <div className="section">
                  <div className="column-label">Druid SQL Query</div>
                  <div className="column-set">
                    <div className="column">{result}</div>
                  </div>
                </div>
              )}
              {renderChartContent()}
              {filter && (
                <div className="section">
                  <div className="column-label">Filters</div>
                  <div className="column-set">
                    {filter.map((metric: string, index: number) => (
                      <div key={index} className="column">
                        {metric}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Form>
        </StyledModal>
      )}
    </>
  );
};

export default AllChart;


export const deleteChart = async (id: any) => {
  const slice_ID = parseInt(id)
  try {
    const response = await fetch(`${CHART_BASE_URL}/charts/delete/${slice_ID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {

    } else {
    }
  } catch (error) {
  }
};