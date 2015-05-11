// geodetic-scatter-plot viz
//
var _ = require('lodash');
var inherits = require('inherits');
var d3 = require('d3');

var GeodeticScatterPlot = function(selector, data, images, opts) {
    opts = opts || {};
    this.opts = opts;
    this.$domElem = $(selector).first();
    this.width = (opts.width || $(selector).width());
    this.height = (opts.height || (this.width * 0.6));
    this.data = data;
    this.selector = selector;
    this._init();
}

inherits(GeodeticScatterPlot, require('events').EventEmitter);
module.exports = GeodeticScatterPlot;

GeodeticScatterPlot.prototype._init = function() {
    var width = this.width;
    var height = this.height;
    var selector = this.selector;
    var data = this.data;
    var opts = this.opts;
    var self = this;

    var $mapDiv = $('<div>', { id: 'map-canvas' });
    $mapDiv.css('width', '450px');
    $mapDiv.css('height', '350px');
    $(selector).first().append($mapDiv);
    
    $("<style>")
        .prop("type", "text/css")
        .html("\
             html, body, #map {\
                 width: 100%;\
                 height: 100%;\
                 margin: 0;\
                 padding: 0;\
             }\
             .points, .points svg {\
                 position: absolute;\
             }\
             .points svg {\
                 width: 60px;\
                 height: 20px;\
                 padding-right: 100px;\
                 font: 10px sans-serif;\
             }\
             .points circle {\
                 fill: brown;\
                 stroke: black;\
                 stroke-width: 1.5px;\
             }\
             ")
          .appendTo("body");

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
        
        function transformWithEase(d) {
            var padding = 10;
            d = new google.maps.LatLng(d[0], d[1]);
            d = _projection.fromLatLngToDivPixel(d);
            return d3.select(this)
                .transition().duration(300)
                .style("left", (d.x - padding) + "px")
                .style("top", (d.y - padding) + "px");
        }

        //superclass methods for google maps
        this.onAdd = function() {
            console.log(self);
            _div = d3.select(self.getPanes().overlayLayer)
                    .append("div")
                    .attr("class", "points");
        };               
                      
        this.draw = function() {
            var padding = 10;
            _projection = this.getProjection();
            
            var marker = _div.selectAll("svg")
                .data(_data, function (d) { return d.Key; })
                .each(transform) // update existing markers
                .enter().append("svg:svg")
                .each(transform)
                .attr("class", "marker");

            // Add a circle.
            marker.append("svg:circle")
                .attr("r", 4.5)
                .attr("cx", padding)
                .attr("cy", padding);
        };

        this.onRemove = function() {
            _div.remove();
        };

        this.update = function(data) {                    
            //update internal data which drive redrawing on zoom_changed                   
           /* for (var i = 0; i < data.length; i++) {
                var found = false;
                for (var j = 0; j < _data.length; j++) {
                    if (_data[j].Key === data[i].Key) {
                        found = true;
                        _data[j].Lat = data[i].Lat;
                        _data[j].Long = data[i].Long;
                    }
                }
                if (!found)
                    _data.push(data[i]);
            }
            //this.draw();
            _div.selectAll("svg")
                .data(_data, function (d) { return d.Key; }) 
                .each(transformWithEase);
          */
        };
    }

    var API_KEY = data.api_key;
    console.log('API_KEY: ' + API_KEY);

    function initialize() {
        var mapOptions = {
            center: new google.maps.LatLng(self.data.latitude, self.data.longitude),
            zoom: 19,
            mapTypeId: google.maps.MapTypeId.SATELLITE
        };
        // Create Google Map
        var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
        // subclassing
        ScatterOverlay.prototype = new google.maps.OverlayView();
        // Create an overlay for the map
        var overlay = new ScatterOverlay();
        overlay.setMap(map);
        overlay.onAdd();
        overlay.draw();
    }

    function loadScript() {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://maps.googleapis.com/maps/api/js?callback=initMap&key='+ API_KEY;
        document.body.appendChild(script);
    }
      
    window.initMap = initialize;
    window.onload = loadScript;
};

GeodeticScatterPlot.prototype.updateData = function(newData) {
    console.log('updateData');
}
