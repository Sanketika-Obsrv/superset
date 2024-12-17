import React from 'react'
import { Form, FormItem } from 'src/components/Form';
import { Input } from 'src/components/Input';
import {  t } from '@superset-ui/core';


const BarChart = (props:any) => {
  // console.log({props});
  // console.log(props.props.form_data.groupby[0]);
  
  return (
    <>
    <Form data-test="save-modal-body" layout="vertical">
          {
          props.props.controls.x_axis.value !== undefined
           ?
           <FormItem label={t('X-axis')} required>
              <Input
                name="x-axis"
                type="text"
                placeholder="Name"
                value={props.props.controls.x_axis.value}
                // onChange={}
                data-test="new-chart-name"
              />
            </FormItem>
             :<></>
          }
          {
            props.props.form_data.groupby[0] !== undefined ? <FormItem label={t('Y-axis')} required>
            <Input
              name="y-axis"
              type="text"
              placeholder="Name"
              value={props.props.form_data.groupby[0]}
              // onChange={}
              data-test="new-chart-name"
            />
          </FormItem>
  :<></>
          }        </Form>
    </>
  )
}

export default BarChart