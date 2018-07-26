/*
	There is a "deprecated" flag for basemap options which will allow them to remain
	in this file but they will not appear in the UI.

	At the moment this is the case for the google basemaps - enabling them here
	WILL function correctly, but per the Google user agreement it is no longer
	allowed to access maps in this way.

	https://cloud.google.com/maps-platform/maps/

	In order to use the google maps correctly, they should be accessed via an
	API key associated with a credit card that can be charged for usage. As of
	this writing, google grants a $200/month credit, but the logistics of credit
	card and API key setup are outside the scope of this repo and depend on your
	organization.
*/
import * as TYPE from '../types';
export default {
	selectedRecordID:null,
	isEditingWithPreview: true,
	hasUnsavedChanges: false,
	current: {
		type: TYPE.BASELAYER_TYPE.MAP,
		tileLayer: {
			tile_address:'',
			slug: "OpenStreetMap",
			displayName: "Open Street Map",
			deprecated: false,
			attribution: '&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors',
			url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		},
		geometryStyle: {
			default: {

				stroke: true,

				strokeColor: '#FF00FF',
				strokeColor_selected: '#FF00FF',
				stroke_opacity: 1.0,
				stroke_opacity_selected: 0.6,
				stroke_weight: 2,

				fillColor: '#FF00FF',
				fillColor_selected: '#FF00FF',
				fill_opacity: 0.3,
				fill_opacity_selected: 0.6
			}
		},
		basemapOptions: [
			{
				slug: "OpenStreetMap",
				displayName: "DEFAULT Open Street Map",
				deprecated: false,
				attribution: '&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors',
				url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
			}
		]
	},

	available: {
		baseMaps: [
			{
				type: TYPE.BASELAYER_TYPE.MAP,
				slug: "OpenStreetMap",
				displayName: "Open Street Map",
				deprecated: false,
				attribution: '&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors',
				url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
			}, {
				type: TYPE.BASELAYER_TYPE.MAP,
				slug: "StamenToner",
				displayName: "Stamen: Toner",
				deprecated: false,
				attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
				url: 'http://tile.stamen.com/toner/{z}/{x}/{y}.png'
			}, {
				type: TYPE.BASELAYER_TYPE.MAP,
				slug: "StamenWatercolor",
				displayName: "Stamen: Watercolor",
				deprecated: false,
				attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
				url: 'http://tile.stamen.com/watercolor/{z}/{x}/{y}.png'
			}, {
				type: TYPE.BASELAYER_TYPE.MAP,
				slug: "StamenTerrain",
				displayName: "Stamen: Terrain",
				deprecated: false,
				attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
				url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.png'
			}, {
				type: TYPE.BASELAYER_TYPE.MAP,
				slug: "GooglePhysical",
				displayName: "Google: Physical",
				deprecated: true,
				attribution: '&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors',
				url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
			}, {
				type: TYPE.BASELAYER_TYPE.MAP,
				slug: "GoogleStreets",
				displayName: "Google: Streets",
				deprecated: true,
				attribution: '&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors',
				url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
			}, {
				type: TYPE.BASELAYER_TYPE.MAP,
				slug: "GoogleHybrid",
				displayName: "Google: Hybrid",
				deprecated: true,
				attribution: '&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors',
				url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
			}, {
				type: TYPE.BASELAYER_TYPE.MAP,
				slug: "GoogleSatellite",
				displayName: "Google: Satellite",
				deprecated: true,
				attribution: '&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors',
				url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
			}
		]
	}

};
