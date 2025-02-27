import { t } from '@superset-ui/core';
import React, { useState } from 'react'
import { Form, FormItem } from 'src/components/Form';

const CountryChart = (props:any) => {
    const { chart, controls, form_data } = props.props;

    const [country,setCountry] = useState(props.props?.form_data?.select_country);
    const [isoCode,setIsoCode] = useState(props.props?.form_data?.entity);
    const [metric,setMetric] = useState(props.props?.form_data?.metric?.column?.column_name);

    const handleChangeForCountry = (event: { target: { value: any; }; }) => {
      setCountry(event.target.value); 
    };
    const handleChangeForIsoCode = (event: { target: { value: any; }; }) => {
      setIsoCode(event.target.value); 
    };
    const handleChangeForMetric = (event: { target: { value: any; }; }) => {
      setMetric(event.target.value); 
    };
      
const columns = controls.adhoc_filters.columns;

const columnNames = columns.map((item: { column_name: any; }) => item.column_name);  

const countries = controls.select_country.choices;

const countryName = countries.map((item: [string, string]) => item[0]);
  return (
    <>
    <Form data-test="save-modal-body" layout="vertical">
      {country !== undefined && (
        <div className='dropdown-container'>
          <label htmlFor="dropdown">Country </label>
          <select id="dropdown" value={country} onChange={handleChangeForCountry}>
            {countryName.map((name: string, index: number) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      )}

      {isoCode !== undefined && (
          <div className='dropdown-container'>
            <label htmlFor="dropdown">ISO 3166-2 Codes</label>
            <select id="dropdown" value={isoCode} onChange={handleChangeForIsoCode}>
              {columnNames.map((name: string, index: number) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
      )}
       <FormItem label={t('Metric')} required>
      {form_data?.metric?.column?.column_name &&  (
        <div className='dropdown-container'>
           <select id="dropdown" value={metric} onChange={handleChangeForMetric}>
              {columnNames.map((name: string, index: number) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
        </div>
      )}
      </FormItem>
      </Form>
    </>
  )
}

export default CountryChart