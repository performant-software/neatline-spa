export const EXHIBIT_TYPE = Object.freeze({
	UNDEFINED: -1,
	MAP: 0,
	IMAGE: 1,
});
export const BASELAYER_TYPE = Object.freeze({
	MAP: "MAP",
	IMAGE: "IMAGE",
	WMS: "WMS",
	TILE: "TILE"
});

export const EXHIBIT_DEFAULT_VALUES = Object.freeze({
	'o:spatial_layers': [],
	'o:zoom_levels': 20,
	'o:spatial_querying': true
});

export const TEMPORARY = -1;

export const EVENT = Object.freeze({
	SAVE_ALL:'SAVE_ALL'
});
