//https://react-leaflet.js.org/docs/en/custom-components.html
import React, { Component } from "react";
import { withLeaflet, MapControl } from "react-leaflet";
import L from "leaflet";

class ViewControls extends MapControl {
  constructor(props, context) {
    super(props);
  }

  createLeafletElement(opts) {
    const ViewControls = L.Control.extend({
        options: {
            position: 'topleft',
            noInitialDefaultView: true // Flag whether to disable the goto and clear links
        },
        initialize: function (setCallback, gotoCallback, clearCallback, options) {
            this._setCallback = setCallback;
            this._gotoCallback = gotoCallback;
            this._clearCallback = clearCallback;
            L.setOptions(this, options);
        },
        onAdd: function(map){
            this._map = map;
            var container = L.DomUtil.create('div', 'mapping-control-default leaflet-bar');
            var setLink = L.DomUtil.create('a', 'mapping-control-default-view-set', container);
            var gotoLink = L.DomUtil.create('a', 'mapping-control-default-view-goto', container);
            var clearLink = L.DomUtil.create('a', 'mapping-control-default-view-clear', container);

            setLink.innerHTML = '⊹';
            setLink.href = '#';
            setLink.title = 'Set the current view as the default view';
            setLink.style.fontSize = '18px';

            gotoLink.innerHTML = '⊡';
            gotoLink.href = '#';
            gotoLink.title = 'Go to the current default view';
            gotoLink.style.fontSize = '18px';

            clearLink.innerHTML = '✕';
            clearLink.href = '#';
            clearLink.title = 'Clear the default view';
            clearLink.style.fontSize = '18px';
            

            return container;
        }
    });
    return new ViewControls({ position: "topleft" });
  }

  componentDidMount() {
    const { map } = this.props.leaflet;
    this.leafletElement.addTo(map);
  }
}

export default withLeaflet(ViewControls);