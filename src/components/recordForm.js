import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import { connect } from 'react-redux';
import '../css/exhibitForm.css';

const defaultValues = {
  'o:fill_color': '#00aeff',
  'o:fill_color_select': '#00aeff',
  'o:stroke_color': '#000000',
  'o:stroke_color_select': '#000000',
  'o:fill_opacity': 0.3,
  'o:fill_opacity_select': 0.4,
  'o:stroke_opacity': 0.9,
  'o:stroke_opacity_select': 1,
  'o:stroke_width': 2,
  'o:point_radius': 10
};

let RecordForm = props => {
  const { handleSubmit, submitLabel, disabled, showDelete, handleDelete } = props;

  return (
    <form className='exhibit-form' onSubmit={handleSubmit}>
      <Tabs>
        <TabList>
          <Tab>Text</Tab>
          <Tab>Style</Tab>
        </TabList>
        <TabPanel>
          <div style={{fontWeight: 'bold'}}>Text Description</div>
          <fieldset disabled={disabled} style={{ border: 'none', padding: '0' }}>
            <div>
              <label htmlFor='o:slug'>Slug</label>
              <Field name='o:slug' component='input' type='text' />
            </div>
            <div>
              <label htmlFor='o:title'>Title</label>
              <Field name='o:title' component='textarea' />
            </div>
            <div>
              <label htmlFor='o:body'>Body</label>
              <Field name='o:body' component='textarea' />
            </div>
          </fieldset>
        </TabPanel>
        <TabPanel>
          <fieldset disabled={disabled} style={{ border: 'none', padding: '0' }}>
            <div style={{fontWeight: 'bold'}}>Colors</div>
            <div>
              <label htmlFor='o:fill_color'>Fill Color</label>
              <Field name='o:fill_color' component='input' type='text' />
            </div>
            <div>
              <label htmlFor='o:fill_color_select'>Fill Color (Selected)</label>
              <Field name='o:fill_color_select' component='input' type='text' />
            </div>
            <div>
              <label htmlFor='o:stroke_color'>Stroke Color</label>
              <Field name='o:stroke_color' component='input' type='text' />
            </div>
            <div>
              <label htmlFor='o:stroke_color_select'>Stroke Color (Selected)</label>
              <Field name='o:stroke_color_select' component='input' type='text' />
            </div>

            <div style={{fontWeight: 'bold', marginTop: '2em'}}>Opacities</div>
            <div>
              <label htmlFor='o:fill_opacity'>Fill Opacity</label>
              <Field name='o:fill_opacity' component='input' type='text' />
            </div>
            <div>
              <label htmlFor='o:fill_opacity_select'>Fill Opacity (Selected)</label>
              <Field name='o:fill_opacity_select' component='input' type='text' />
            </div>
            <div>
              <label htmlFor='o:stroke_opacity'>Stroke Opacity</label>
              <Field name='o:stroke_opacity_select' component='input' type='text' />
            </div>
            <div>
              <label htmlFor='o:stroke_opacity'>Fill Opacity</label>
              <Field name='o:stroke_opacity_select' component='input' type='text' />
            </div>

            <div style={{fontWeight: 'bold', marginTop: '2em'}}>Dimensions</div>
            <div>
              <label htmlFor='o:stroke_width'>Stroke Width</label>
              <Field name='o:stroke_width' component='input' type='number' />
            </div>
            <div>
              <label htmlFor='o:point_radius'>Point Radius</label>
              <Field name='o:point_radius' component='input' type='number' />
            </div>
            <div>
              <label htmlFor='o:zindex'>Z-Index</label>
              <Field name='o:zindex' component='input' type='number' />
            </div>
            <div>
              <label htmlFor='o:weight'>Order / Weight</label>
              <Field name='o:weight' component='input' type='number' />
            </div>

            <div style={{fontWeight: 'bold', marginTop: '2em'}}>Dates</div>
            <div>
              <label htmlFor='o:start_date'>Start Date</label>
              <Field name='o:start_date' component='input' type='text' />
            </div>
            <div>
              <label htmlFor='o:end_date'>End Date</label>
              <Field name='o:end_date' component='input' type='text' />
            </div>
            <div>
              <label htmlFor='o:after_date'>After Date</label>
              <Field name='o:after_date' component='input' type='text' />
            </div>
            <div>
              <label htmlFor='o:before_date'>Before Date</label>
              <Field name='o:before_date' component='input' type='text' />
            </div>

            <div style={{fontWeight: 'bold', marginTop: '2em'}}>Imagery</div>
            <div>
              <label htmlFor='o:point_image'>Point Image</label>
              <Field name='o:point_image' component='input' type='text' />
            </div>
            <div>
              <label htmlFor='o:wms_address'>WMS Address</label>
              <Field name='o:wms_address' component='input' type='text' />
            </div>
            <div>
              <label htmlFor='o:wms_layers'>WMS Layers</label>
              <Field name='o:wms_layers' component='input' type='text' />
            </div>

            <div style={{fontWeight: 'bold', marginTop: '2em'}}>Visibility</div>
            <div>
              <label htmlFor='o:min_zoom'>Min Zoom</label>
              <Field name='o:min_zoom' component='input' type='number' />
            </div>
            <div>
              <label htmlFor='o:max_zoom'>Max Zoom</label>
              <Field name='o:max_zoom' component='input' type='number' />
            </div>
            <div>
              <label htmlFor='o:map_zoom'>Default Zoom</label>
              <Field name='o:map_zoom' component='input' type='number' />
            </div>
            <div>
              <label htmlFor='o:map_focus'>Default Focus</label>
              <Field name='o:map_focus' component='input' type='text' />
            </div>
          </fieldset>
        </TabPanel>
      </Tabs>
	  <Field name='o:coverage' component='input' type='hidden'/>
      <Field name='o:exhibit_id' component='input' type='hidden' />
      <button type='submit'>{submitLabel}</button>
      {showDelete &&
        <button onClick={handleDelete} type='button'>Delete</button>
      }
    </form>
  );
}

RecordForm = reduxForm({
  form: 'record'
})(RecordForm);

const mapStateToProps = state => ({
  initialValues: state.exhibitShow.editorRecord ? state.exhibitShow.editorRecord : {...defaultValues, 'o:exhibit': {'o:id': state.exhibitShow.exhibit['o:id']}}
});

export default connect(
  mapStateToProps,
  null
)(RecordForm);
