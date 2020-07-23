import React from 'react';
import * as d3 from 'd3';
import TLAxis from './TLAxis.js';


const Timeline = () => {
    const parser = d3.isoParse;

    const data = [
      { "tier": "1", "id": "69", "owner_id": "2", "item_id": null, "exhibit_id": "5", "added": "2020-04-29 15:06:48", "modified": "2020-04-29 04:10:49", "is_coverage": "1", "is_wms": "0", "slug": null, "title": "Lynn Carol Allen", "item_title": null, "body": null, "coverage": "0x00000000010700000001000000010100000016bd53bcb36c62c1f26327f5287c5041", "tags": "sportsmaker", "widgets": "Simile", "presenter": "StaticBubble", "fill_color": "#00aeff", "fill_color_select": "#00aeff", "stroke_color": "white", "stroke_color_select": "black", "fill_opacity": "0.80", "fill_opacity_select": "1.00", "stroke_opacity": "0.80", "stroke_opacity_select": "1.00", "stroke_width": "2", "point_radius": "6", "zindex": null, "weight": null, "start_date": "1951-10-22", "end_date": "1954-10-22", "after_date": null, "before_date": null, "point_image": null, "wms_address": null, "wms_layers": null, "min_zoom": null, "max_zoom": null, "map_zoom": "5", "map_focus": "-10767225.550863,4172850.2475636" },
      { "tier": "1", "id": "60", "owner_id": "2", "item_id": null, "exhibit_id": "5", "added": "2020-04-29 15:26:15", "modified": "2020-04-29 04:10:36", "is_coverage": "1", "is_wms": "0", "slug": null, "title": "Katherine Bennett", "item_title": null, "body":  null, "coverage": "0x000000000107000000010000000101000000a3a366e0e62e60c188380ccb33905041", "tags": "sportsmaker", "widgets": "Simile", "presenter": "StaticBubble", "fill_color": "#98df8a", "fill_color_select": "#00aeff", "stroke_color": "white", "stroke_color_select": "black", "fill_opacity": "0.80", "fill_opacity_select": "1.00", "stroke_opacity": "0.80", "stroke_opacity_select": "1.00", "stroke_width": "2", "point_radius": "6", "zindex": null, "weight": null, "start_date": "1932-10-17", "end_date": "1933-10-17", "after_date": null, "before_date": null, "point_image": null, "wms_address": null, "wms_layers": null, "min_zoom": null, "max_zoom": null, "map_zoom": "5", "map_focus": "-10767225.550863,4172850.2475636" },
      { "tier": null, "id": "61", "owner_id": "2", "item_id": null, "exhibit_id": "5", "added": "2020-04-29 15:31:03", "modified": "2020-04-29 04:10:24", "is_coverage": "1", "is_wms": "0", "slug": null, "title": "Evie Garrett Dennis", "item_title": null, "body": null, "coverage": "0x00000000010700000001000000010100000070057991b01163c113fa4f5ad55c4d41", "tags": "sportsmaker", "widgets": "Simile", "presenter": "StaticBubble", "fill_color": "#00aeff", "fill_color_select": "#00aeff", "stroke_color": "white", "stroke_color_select": "black", "fill_opacity": "0.80", "fill_opacity_select": "1.00", "stroke_opacity": "0.80", "stroke_opacity_select": "1.00", "stroke_width": "2", "point_radius": "6", "zindex": null, "weight": null, "start_date": "1944-9-8", "end_date": "1945-9-8", "after_date": null, "before_date": null, "point_image": null, "wms_address": null, "wms_layers": null, "min_zoom": null, "max_zoom": null, "map_zoom": "5", "map_focus": "-10767225.550863,4172850.2475636" },
      { "tier": null, "id": "62", "owner_id": "2", "item_id": null, "exhibit_id": "5", "added": "2020-04-29 15:37:26", "modified": "2020-04-29 04:10:04", "is_coverage": "1", "is_wms": "0", "slug": null, "title": "Benita Fitzgerald Mosley", "item_title": null, "body": null, "coverage": "0x0000000001070000000100000001010000008399c0e49b6a60c1541f48280cd15141", "tags": "sportsmaker", "widgets": "Simile", "presenter": "StaticBubble", "fill_color": "#00aeff", "fill_color_select": "#00aeff", "stroke_color": "white", "stroke_color_select": "black", "fill_opacity": "0.80", "fill_opacity_select": "1.00", "stroke_opacity": "0.80", "stroke_opacity_select": "1.00", "stroke_width": "2", "point_radius": "6", "zindex": null, "weight": null, "start_date": "1961-7-6", "end_date": null, "after_date": null, "before_date": null, "point_image": null, "wms_address": null, "wms_layers": null, "min_zoom": null, "max_zoom": null, "map_zoom": "5", "map_focus": "-10767225.550863,4172850.2475636" },
      { "tier": null, "id": "63", "owner_id": "2", "item_id": null, "exhibit_id": "5", "added": "2020-04-29 16:02:32", "modified": "2020-04-29 04:09:45", "is_coverage": "1", "is_wms": "0", "slug": null, "title": "Dionne Warwick", "item_title": null, "body": null, "coverage": "0x0000000001070000000100000001010000005ae553a2ec825fc1f5eb18b7acfc5241", "tags": "musicmaker", "widgets": "Simile", "presenter": "StaticBubble", "fill_color": "#98df8a", "fill_color_select": "#98df8a", "stroke_color": "white", "stroke_color_select": "black", "fill_opacity": "0.80", "fill_opacity_select": "1.00", "stroke_opacity": "0.80", "stroke_opacity_select": "1.00", "stroke_width": "2", "point_radius": "6", "zindex": null, "weight": null, "start_date": null, "end_date": null, "after_date": null, "before_date": null, "point_image": null, "wms_address": null, "wms_layers": null, "min_zoom": null, "max_zoom": null, "map_zoom": "5", "map_focus": "-10767225.550863,4172850.2475636" },
      { "tier": "2", "id": "64", "owner_id": "2", "item_id": null, "exhibit_id": "5", "added": "2020-04-29 16:20:40", "modified": "2020-04-29 04:56:55", "is_coverage": "1", "is_wms": "0", "slug": null, "title": "Billie Allen", "item_title": null, "body": null, "coverage": "0x000000000107000000010000000101000000acdc70718f7160c144db31d9f7375141", "tags": "artmaker", "widgets": "Simile", "presenter": "StaticBubble", "fill_color": "#f781bf", "fill_color_select": "#f781bf", "stroke_color": "white", "stroke_color_select": "black", "fill_opacity": "0.80", "fill_opacity_select": "1.00", "stroke_opacity": "0.80", "stroke_opacity_select": "1.00", "stroke_width": "2", "point_radius": "6", "zindex": null, "weight": null, "start_date": "1925-1-13", "end_date": null, "after_date": null, "before_date": null, "point_image": null, "wms_address": null, "wms_layers": null, "min_zoom": null, "max_zoom": null, "map_zoom": "5", "map_focus": "-10767225.550863,4172850.2475636" },
      { "tier": null, "id": "65", "owner_id": "2", "item_id": null, "exhibit_id": "5", "added": "2020-04-29 17:00:08", "modified": "2020-04-29 05:01:11", "is_coverage": "1", "is_wms": "0", "slug": null, "title": "Madeleine Moore Burrell", "item_title": null, "body": null, "coverage": "0x000000000107000000010000000101000000be2951ddc0675fc1b284b5c953ec5241", "tags": "mediamaker", "widgets": "Simile", "presenter": "StaticBubble", "fill_color": "#f0027f", "fill_color_select": "#f0027f", "stroke_color": "white", "stroke_color_select": "black", "fill_opacity": "0.80", "fill_opacity_select": "1.00", "stroke_opacity": "0.80", "stroke_opacity_select": "1.00", "stroke_width": "2", "point_radius": "6", "zindex": null, "weight": null, "start_date": "1940-9-10", "end_date": null, "after_date": null, "before_date": null, "point_image": null, "wms_address": null, "wms_layers": null, "min_zoom": null, "max_zoom": null, "map_zoom": "5", "map_focus": "-10767225.550863,4172850.2475636" },
      { "tier": "2", "id": "66", "owner_id": "2", "item_id": null, "exhibit_id": "5", "added": "2020-04-29 17:22:08", "modified": "2020-04-29 05:23:23", "is_coverage": "1", "is_wms": "0", "slug": null, "title": "Anna Langford", "item_title": null, "body": null, "coverage": "0x00000000010700000001000000010100000013765b65eacb61c1c3c8dc7c1a845241", "tags": "lawmaker", "widgets": "Simile", "presenter": "StaticBubble", "fill_color": "#ffbb78", "fill_color_select": "#ffbb78", "stroke_color": "white", "stroke_color_select": "black", "fill_opacity": "0.80", "fill_opacity_select": "1.00", "stroke_opacity": "0.80", "stroke_opacity_select": "1.00", "stroke_width": "2", "point_radius": "6", "zindex": null, "weight": null, "start_date": "1917-10-27", "end_date": null, "after_date": null, "before_date": null, "point_image": null, "wms_address": null, "wms_layers": null, "min_zoom": null, "max_zoom": null, "map_zoom": "5", "map_focus": "-10767225.550863,4172850.2475636" },
      { "tier": null, "id": "67", "owner_id": "2", "item_id": null, "exhibit_id": "5", "added": "2020-04-30 17:55:38", "modified": "2020-04-30 05:57:04", "is_coverage": "1", "is_wms": "0", "slug": null, "title": "Ruth Beckford", "item_title": null, "body": null, "coverage": "0x000000000107000000010000000101000000bce7c093a9f669c10b4c02ce835d5141", "tags": "artmaker", "widgets": "Simile", "presenter": "StaticBubble", "fill_color": "#f781bf", "fill_color_select": "#f781bf", "stroke_color": "white", "stroke_color_select": "black", "fill_opacity": "0.80", "fill_opacity_select": "1.00", "stroke_opacity": "0.80", "stroke_opacity_select": "1.00", "stroke_width": "2", "point_radius": "6", "zindex": null, "weight": null, "start_date": "1925-12-7", "end_date": null, "after_date": null, "before_date": null, "point_image": null, "wms_address": null, "wms_layers": null, "min_zoom": null, "max_zoom": null, "map_zoom": "5", "map_focus": "-10767225.550863,4172850.2475636" },
        ]
     
    const minDate = d3.min(data, function(d) {
        return parser(d.start_date);
      });
    const maxDate = d3.max(data, function(d) {
        return parser(d.end_date);
      });
    // console.log(minDate, maxDate)

    const timeEntries = data.filter(d => d.start_date != null)
    // console.log(timeEntries)

    const xScale = 
        d3.scaleTime()
        .domain([minDate,maxDate])
        //range should be container width
        .range([0, 1000]);
    
    // console.log(xScale.range())

    const spanHeight = 16;

    return (
        <TLAxis 
            // data={data}          
            domain={xScale.domain()}
            range={xScale.range()} 
            timeEntries={timeEntries}
            spanHeight={spanHeight}
      />    
    )
}

export default Timeline;