/* global OpenLayers */

import React, { Component } from 'react';

class ExhibitPublicMap extends Component {
  componentDidMount() {
    const { exhibit } = this.props;

    let map = new OpenLayers.Map('neatline-map');
    let layer = new OpenLayers.Layer.OSM( "Simple OSM Map");
    map.addLayer(layer);
    map.setCenter(
        new OpenLayers.LonLat(-95.234, 38.972).transform(
            new OpenLayers.Projection("EPSG:4326"),
            map.getProjectionObject()
        ), 12
    );
  }

  render() {
    return (
      <div className='map-loaded'></div>
    )
  }
}

export default ExhibitPublicMap;
