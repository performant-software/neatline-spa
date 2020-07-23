import React, {useRef, useEffect} from 'react';
import * as d3 from 'd3';
import './Timeline.css';
import { Icon } from 'semantic-ui-react';


const TLAxis = ({ domain, range, timeEntries, spanHeight }) => {

    const parser = d3.isoParse;
    const ref = useRef()
    const ref2 = useRef()
    // const spanHeight = 16;
    const pointRadius = spanHeight/4;

    const items = d3.nest().key(function(d) {
        if (d.tier != null) {
            return d.tier
        } else {
            return d.id;
        }
      }).entries(timeEntries).sort((a, b) => a.key - b.key);
    // console.log(items)

    useEffect(() => {
    const x = d3.scaleTime()
        .domain(domain)
        .range(range)
        .nice();

    const zoom = d3.zoom()
        // .scaleExtent([0.5, 32])
        .on("zoom", zoomed);

    const svg = d3.select(ref.current)
        // .attr('width', width)
        // .attr('height', height)

    const svg2 = d3.select(ref2.current)

    const spanX = function(d) {
    return x(parser(d.start_date));
    };
    
    const spanW = function(d) {
    return x(parser(d.end_date)) - x(parser(d.start_date));
    };
    
    const span = function(item) {
        const svg = d3.select(this);
        return svg.selectAll('rect')
            .data(item => item.values.filter(d => (d.end_date != null)))
            .enter()
            .append('rect')
            .attr('x', d => spanX(d))
            .attr('y', 0).attr('width', d => spanW(d))
            .attr('height', spanHeight)
            .attr('fill', d => d.fill_color) //#ddf
            .style("cursor", "pointer")
            .on("click", d=>console.log('start: ' + d.start_date + ' end: ' + d.end_date))
    };

    const spanLabels = function(item) {
        const svg = d3.select(this);
        return svg.selectAll('text .span')
        .data(item => item.values.filter(d => (d.end_date != null)))
        .enter()
        .append('text')
        .attr('class', 'span')
        .attr('x', d => x(parser(d.end_date)) )
        .attr('y', spanHeight/2 + 5)
        .text(d=>d.title)
    }

    const point = function(item){
        const svg = d3.select(this);
        return svg.selectAll('circle')
            .data(item => item.values.filter(d => (d.end_date === null)))
            .enter().append('circle')
            .attr('cx', d => spanX(d))
            .attr('cy', spanHeight/2)
            .attr('r', pointRadius)
            .attr('fill', d => d.fill_color)
            .style("cursor", "pointer")
            .on("click", d=>console.log('start: ' + d.start_date + ' end: ' + d.end_date))
    }

    const pointLabels = function(item) {
        const svg = d3.select(this);
        return svg.selectAll('text .point')
            .data(item => item.values.filter(d => (d.end_date === null)))
            .enter().append('text')
            .attr('class', 'point')
            .attr('x', d => spanX(d)+ pointRadius)
            .attr('y', spanHeight/2 + 5)
            .text(d=>d.title)
    }
    
    const allCharts = d3.select('.tl-main')
        .selectAll('svg')
        .data(items)
        .enter().append('svg')
        .attr('class', 'tl-item')
        .attr('height', spanHeight)
        .each(span, point)
        .each(point)
        .each(spanLabels)
        .each(pointLabels);

    const gx = svg2.append("svg");

    const buttonReset = d3.select("#reset")
    const buttonZoomIn = d3.select("#zoomIn")
    const buttonZoomOut = d3.select("#zoomOut")

    const axisHeight = (spanHeight * items.length) + 22;
    const xAxis = (g, x) => g
        .attr("color", "#333") //#737373
        .attr('height', axisHeight + 22)
        .style('font-size', '0.9rem')
        .call(d3.axisBottom(x).ticks(12).tickSize(axisHeight))
        .call(g => g.select(".domain").attr("display", "none")) //"none" to hide axis line
        .call(g => g.selectAll(".tick").selectAll("line").attr("stroke", "#D8D8D8").style("stroke-dasharray", "5 5")) //#bfbfbf
        
    function zoomed() {
        const transform = d3.event.transform;
        const zx = transform.rescaleX(x).interpolate(d3.interpolateRound);
        gx.call(xAxis, zx);
        allCharts.selectAll('rect')
            .attr('x', d => transform.applyX(spanX(d)))
            .attr('width', d => transform.k * spanW(d));
        allCharts.selectAll('circle')
            .attr('cx', d => transform.applyX(spanX(d)));
        allCharts.selectAll('text.span')
            .attr('x', d => transform.applyX(x(parser(d.end_date))));
        allCharts.selectAll('text.point')
            .attr('x', d => transform.applyX(spanX(d)) + pointRadius);
      }
    
    function reset() {
        svg.transition()
            .duration(1000)
            .call(zoom.transform, d3.zoomIdentity);
      }
    //   https://observablehq.com/@d3/programmatic-zoom
    function zoomIn() {svg.transition().call(zoom.scaleBy, 2);}
    function zoomOut() {svg.transition().call(zoom.scaleBy, 0.5);}
      
    buttonReset.on("click", reset);
    buttonZoomIn.on("click", zoomIn);
    buttonZoomOut.on("click", zoomOut);
    svg.call(zoom).call(zoom.transform, d3.zoomIdentity);
    }, [])
  
    return (
        <div className="nl-timeline-container">
            <div className="tl-controls">
                <span id="zoomIn" className="tl-controls-button">
                <Icon name="search plus" />
                </span>
                <span id="zoomOut" className="tl-controls-button">
                <Icon name="search minus" />
                </span>
                <span id="reset" className="tl-controls-button">
                <Icon name="undo alternate" />
                </span>
            </div>
            <div
                className="tl-main"
                ref={ref}
            />
            <div
                className="tl-axis"
                ref={ref2}
            />
        </div>
    )
  }

export default TLAxis;