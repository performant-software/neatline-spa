import React, { Component } from 'react';
import { Map, TileLayer } from 'react-leaflet';

class ExhibitPublicMap extends Component {
  componentDidMount() {
    const { exhibit } = this.props;
  }

  render() {
    const position = [51.505, -0.09];

    return (
      <Map center={position} zoom={13} style={{ height: '400px' }}>
        <TileLayer
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </Map>
    )
  }
}

export default ExhibitPublicMap;
