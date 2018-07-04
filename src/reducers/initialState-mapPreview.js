export default {
	selectedRecordID:null,
	isEditingWithPreview: true,
	hasUnsavedChanges: false,
	current: {
		tileLayer: {
			slug: "OpenStreetMap",
			displayName: "Open Street Map",
			deprecated: false,
			attribution: '&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors',
			url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
		},
		geometryStyle: {
			default: {
				hasUnsavedChanges:false,

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
				slug: "OpenStreetMap",
				displayName: "Open Street Map",
				deprecated: false,
				attribution: '&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors',
				url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
			}, {
				slug: "StamenToner",
				displayName: "Stamen: Toner",
				deprecated: false,
				attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
				url: 'http://tile.stamen.com/toner/{z}/{x}/{y}.png'
			}, {
				slug: "StamenWatercolor",
				displayName: "Stamen: Watercolor",
				deprecated: false,
				attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
				url: 'http://tile.stamen.com/watercolor/{z}/{x}/{y}.png'
			}, {
				slug: "StamenTerrain",
				displayName: "Stamen: Terrain",
				deprecated: false,
				attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
				url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.png'
			}, {
				slug: "GooglePhysical",
				displayName: "Google: Physical",
				deprecated: true,
				attribution: '&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors',
				url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
			}, {
				slug: "GoogleStreets",
				displayName: "Google: Streets",
				deprecated: true,
				attribution: '&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors',
				url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
			}, {
				slug: "GoogleHybrid",
				displayName: "Google: Hybrid",
				deprecated: true,
				attribution: '&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors',
				url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
			}, {
				slug: "GoogleSatellite",
				displayName: "Google: Satellite",
				deprecated: true,
				attribution: '&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors',
				url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
			}
		]
	}

};
