import React, { Component } from 'react';
import { Map, LayersControl, TileLayer, WMSTileLayer, GeoJSON } from 'react-leaflet';
import { circleMarker } from 'leaflet';

class ExhibitPublicMap extends Component {
  render() {
    const { records, recordClick, mapClick, recordMouseEnter, recordMouseLeave, selectedRecord, previewedRecord } = this.props;

    const position = [51.505, -0.09];

    return (
      <Map center={position} zoom={13} style={{ height: '100%' }} onClick={(event) => { if (event.originalEvent.target === event.target.getContainer()) mapClick(); }}>
        <LayersControl position='topright'>
          <LayersControl.BaseLayer name='OpenStreetMap' checked={true}>
            <TileLayer
              attribution='&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
          </LayersControl.BaseLayer>
          {records.map(record => {
            const isSelected = record === selectedRecord,
                  isPreviewed = record === previewedRecord;
            if (record['o:is_wms']) {
              return (
                <LayersControl.Overlay name={record['o:title']} checked={true} key={record['o:id'] + '_wms'}>
                  <WMSTileLayer url={record['o:wms_address']} layers={record['o:wms_layers']} transparent={true} format='image/png' opacity={0.8} />
                </LayersControl.Overlay>
              )
            }
            if (record['o:is_coverage']) {
              return <GeoJSON
                       style={function(feature) {
                         return {
                           stroke: true,
                           color: '#000000',
                           weight: 2,
                           opacity: isSelected ? 1.0 : 0.6,
                           fill: true,
                           fillColor: '#00aeff',
                           fillOpacity: isPreviewed ? 0.9 : isSelected ? 0.6 : 0.3
                         };
                       }}
                       onClick={() => recordClick(record)}
                       onMouseover={() => recordMouseEnter(record)}
                       onMouseout={recordMouseLeave} data={record['o:coverage']}
                       pointToLayer={function(point, latlng) { return circleMarker(latlng); }}
                       key={record['o:id'] + '_coverage'}
                     />
            }
            return null;
          })}
        </LayersControl>
      </Map>
    )
  }
}

export default ExhibitPublicMap;
