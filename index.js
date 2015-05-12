// geodetic-scatter-plot viz


var _ = require('lodash');
var inherits = require('inherits');
var d3 = require('d3');


// creates our Google map and subclasses ScatterOverlay, which 
// may only be done after Google Maps API has loaded
function initializeMap(viz) {
    var mapOptions = {
        center: new google.maps.LatLng(viz.data.latitude, viz.data.longitude),
        zoom: 19,
        mapTypeId: google.maps.MapTypeId.SATELLITE
    };
    // create Google map
    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    // subclass OverlayView
    ScatterOverlay.prototype = new google.maps.OverlayView();
    // create an overlay for the map
    var overlay = new ScatterOverlay(viz.data);
    // assign our overlay to our map
    overlay.setMap(map);
}


function loadGoogle(api_key) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    // function initMap defined inside GeodeticScatterPlot (appended to window as function alias)
    script.src = 'https://maps.googleapis.com/maps/api/js?callback=initMap&key=' + api_key;
    document.body.appendChild(script);
}


function ScatterOverlay(initData) {
    //state information
    var _div = null;
    var _data = initData;
    var _projection = null;
    var self = this;

    function transform(d) {
        var padding = 10;                   
        d = new google.maps.LatLng(d[0], d[1]);
        d = _projection.fromLatLngToDivPixel(d);
        return d3.select(this) 
            .style("left", (d.x - padding) + "px")
            .style("top", (d.y - padding) + "px");
    }
   
    //superclass methods for google maps
    this.onAdd = function() {
        _div = d3.select(self.getPanes().overlayLayer)
                .append("div")
                .attr("class", "points");
    };               
                  
    this.draw = function() {
        var padding = 10;
        _projection = this.getProjection();
        
        var marker = _div.selectAll("svg")
            .data(_data.points) // can put a key function here, but I don't know what it does...
            .each(transform) // update existing markers
            .enter().append("svg:svg")
            .each(transform)
            .attr("class", "marker");

        // add a circle.
        marker.append("svg:circle")
            .attr("r", 4.5)
            .attr("cx", padding)
            .attr("cy", padding);
    };

    this.onRemove = function() {
        _div.remove();
    };

    this.update = function(data) {
        // unused (Google automatically calls draw again I believe)
    };
}


var GeodeticScatterPlot = function(selector, data, images, opts) {
    opts = opts || {};
    this.opts = opts;
    this.$domElem = $(selector).first();
    this.width = (opts.width || $(selector).width());
    this.height = (opts.height || (this.width * 0.6));
    this.data = data;
    this.selector = selector;
    var self = this;


    // add map div for google map and overlays
    var $mapDiv = $('<div>', { id: 'map-canvas' });
    $mapDiv.css('width', '450px');
    $mapDiv.css('height', '350px');
    $(this.selector).first().append($mapDiv);
    
    // add style for d3 to DOM body
    // TODO move to init map? Or put in style sheet
    /*
    $("<style>")
        .prop("type", "text/css")
        .html("\
             html, body, #map-canvas { width: 100%; height: 100%; margin: 0; padding: 0;}\
             .points, .points svg { position: absolute; }\
             .points svg { width: 60px; height: 20px; padding-right: 100px; font: 10px sans-serif; }\
             .points circle { fill: brown; stroke: black; stroke-width: 1.5px; }\
             ").appendTo("body");*/

    this.updateData = function() {
        console.log('updateData');
    }

    var api_key = this.data.api_key;

    window.initMap = function() { initializeMap(self) };
    loadGoogle(api_key);
};

inherits(GeodeticScatterPlot, require('events').EventEmitter);
module.exports = GeodeticScatterPlot;


