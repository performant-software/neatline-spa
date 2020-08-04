import React, { Component } from 'react'
import { Map, LayersControl, LayerGroup, TileLayer, Marker, Popup, Circle, WMSTileLayer, FeatureGroup } from 'react-leaflet'
import './reactleaflet.css';
import { EditControl } from "react-leaflet-draw"
import ViewControls from './ViewControls';


import * as TYPE from '../../types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {change} from 'redux-form';
import {updateRecordCacheAndSave, leafletIsSaving, leafletIsEditing} from '../../actions';
import { selectRecord, deselectRecord, previewRecord, unpreviewRecord, setShowRecords, setShowExhibitSettings} from '../../actions';
import L from 'leaflet';
import Draw from 'leaflet-draw';
import leafletSupport from '../../components/ExhibitPublicMap/leafletSupport';

const { BaseLayer, Overlay } = LayersControl

class ReactLeafletMap extends Component {
    constructor(props) {
        super(props)
        this.state = {
            map_center:[51.505, -0.09],
            map_zoom:13,
        }
        // Render flags, used because we can't use standard react logic
        this.cacheInitialized=false;
        this.mapInitialized=false;
        this.allowRender=true;
        this.isDrawing=false;
        this.Draw = Draw; /* Suppresses include warning */
        this.geoClick=false;

    }


  render() {
console.log(this.props.selectedRecord)
    // const style = this.props.selectedRecord['o:fill_color']
    const position = this.state.map_center
    return (
      <Map center={position} zoom={this.state.map_zoom}>
        <LayersControl position="topright">
            <BaseLayer checked name="OpenStreetMap.Mapnik">
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </BaseLayer>
            <BaseLayer name="OpenStreetMap.BlackAndWhite">
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
                />
            </BaseLayer>
            <Overlay checked name="Layer group with circles">
                <LayerGroup>
                <Circle center={position} fillColor="blue" radius={200} />
                <Circle
                    center={position}
                    fillColor="red"
                    radius={100}
                    stroke={false}
                />
                <LayerGroup>
                    <Circle
                    center={[51.51, -0.08]}
                    color="green"
                    fillColor="green"
                    radius={100}
                    />
                </LayerGroup>
                </LayerGroup>
            </Overlay>
        </LayersControl>
        {(this.props.viewMode === 'editing') && (this.props.showExhibitSettings === false) 
        && ((typeof this.props.selectedRecord !== 'undefined' && this.props.selectedRecord !== null) || (this.props.editorNewRecord )) 
        ?   <FeatureGroup>
                <EditControl
                    position='topleft'
                    onEdited={this._onEditPath}
                    onCreated={this._onCreate}
                    onDeleted={this._onDeleted}
                    draw={{
                        rectangle: {
                            shapeOptions: {
                                color: '#0000FF'
                            }
                        }
                        
                    }}
                />
            </FeatureGroup>
        : null}
        {(this.props.viewMode === 'editing') && (this.props.showExhibitSettings === true)
        ? <ViewControls />
        : null }
       
        
        {/* <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <WMSTileLayer
            layers={this.state.bluemarble ? 'nasa:bluemarble' : 'ne:ne'}
            url="https://demo.boundlessgeo.com/geoserver/ows"
            /> */}
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </Map>
    )
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
	selectRecord,
	leafletIsEditing,
	deselectRecord,
	recordMouseEnter: record => previewRecord(record),
	recordMouseLeave: unpreviewRecord,
	change,
	dispatch,
	leafletIsSaving,
	updateRecordCacheAndSave,
	setShowRecords,
  setShowExhibitSettings
}, dispatch);

export default connect(null,mapDispatchToProps)(ReactLeafletMap);
