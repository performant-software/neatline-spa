// Exhibit types, either IMAGE or MAP
export const EXHIBIT_TYPE = Object.freeze({
	UNDEFINED: -1,
	MAP: 0,
	IMAGE: 1,
});

// Supported baselayer types, note that "IMAGE" and the rest are mutually exclusive (different coordinate systems)
export const BASELAYER_TYPE = Object.freeze({
	MAP: "MAP",
	IMAGE: "IMAGE",
	WMS: "WMS",
	TILE: "TILE"
});

// FIXME: Not sure why this is here
export const EXHIBIT_DEFAULT_VALUES = Object.freeze({
	'o:spatial_layers': [],
	'o:zoom_levels': 20,
	'o:spatial_querying': true
});

// Marks record temporary (new record, pre-save)
export const TEMPORARY = -1;
