import React from 'react';
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux';
import '../css/exhibitForm.css';

const layerTypes = [
  'OpenStreetMap',
  'GooglePhysical',
  'GoogleStreets',
  'GoogleHybrid',
  'GoogleSatellite',
  'StamenToner',
  'StamenWatercolor',
  'StamenTerrain'
];

const defaultValues = {
  'o:spatial_layers': [],
  'o:zoom_levels': 20,
  'o:spatial_querying': true
}

const LayerTypeOptions = props => (
  <optgroup label='Default Layers'>
    {layerTypes.map(layerType => (
      <option value={layerType} key={'layerTypeOption-' + layerType}>{layerType}</option>
    ))}
  </optgroup>
)

let ExhibitForm = props => {
  const { exhibit, handleSubmit, submitLabel, disabled } = props;
  return (
    <form className='exhibit-form' onSubmit={handleSubmit}>
      <fieldset disabled={disabled} style={{ border: 'none', padding: '0' }}>
        <div>
          <label htmlFor='o:title'>Title</label>
          <Field name='o:title' component='input' type='text' />
        </div>
        <div>
          <label htmlFor='o:slug'>URL Slug</label>
          <Field name='o:slug' component='input' type='text' />
        </div>
        <div>
          <label htmlFor='o:narrative'>Narrative</label>
          <Field name='o:narrative' component='textarea' />
        </div>
        <div>
          <label htmlFor='o:accessible_url'>Alternative Accessible URL</label>
          <Field name='o:accessible_url' component='input' type='text' />
        </div>
        <div>
          <label htmlFor='o:spatial_layers'>Enabled Spatial Layers</label>
          <Field name='o:spatial_layers' component='select' multiple>
            <LayerTypeOptions />
          </Field>
        </div>
        <div>
          <label htmlFor='o:spatial_layer'>Default Spatial Layer</label>
          <Field name='o:spatial_layer' component='select'>
            <LayerTypeOptions />
            <option value='no_spatial_layer'>None (Image or WMS as Default)</option>
          </Field>
        </div>
        <div>
          <label htmlFor='o:image_layer'>Image Layer</label>
          <Field name='o:image_layer' component='input' type='text' />
        </div>
        <div>
          <label htmlFor='o:zoom_levels'>Zoom Levels</label>
          <Field name='o:zoom_levels' component='input' type='number' />
        </div>
        <div>
          <label htmlFor='o:wms_address'>WMS Address</label>
          <Field name='o:wms_address' component='input' type='text' />
        </div>
        <div>
          <label htmlFor='o:wms_layers'>WMS Layers</label>
          <Field name='o:wms_layers' component='input' type='text' />
        </div>
        <div>
          <label htmlFor='o:spatial_querying'>Spatial Querying</label>
          <Field name='o:spatial_querying' component='input' type='checkbox' />
        </div>
        <div>
          <label htmlFor='o:public'>Public</label>
          <Field name='o:public' component='input' type='checkbox' />
        </div>
        {exhibit && exhibit['o:id'] &&
          <Field name='o:id' component='input' type='hidden' />
        }
        <button type='submit'>{submitLabel}</button>
      </fieldset>
    </form>
  )
}

ExhibitForm = reduxForm({
  form: 'exhibit'
})(ExhibitForm);

const mapStateToProps = state => ({
  initialValues: state.exhibitShow.exhibit ? state.exhibitShow.exhibit : defaultValues
});

export default connect(
  mapStateToProps,
  null,
)(ExhibitForm);
