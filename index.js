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
    this.earth_radius = 6371;
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
    
    function draw() {
      // draw
      console.log('draw');
    }

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                return sParameterName[1];
            }
        }
    } 

    var API_KEY = data.api_key || getUrlParameter('API_KEY');
    console.log('API_KEY: ' + API_KEY);

    function ScatterOverlay
    
    function initialize() {
      var mapOptions = {
        center: new google.maps.LatLng(self.data.latitude, self.data.longitude),
        zoom: 19,
        mapTypeId: google.maps.MapTypeId.SATELLITE
      };
      // Create Google Map
      var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
      // Create an overlay for the map
      var overlay = new google.maps.OverlayView();
      // Data = center of map
      
      var data = [ {name: 'pt1', lng: -84.7322884, lat: 39.5107117} ];

      overlay.onAdd = function() {
        var $overlayLayer = $(this.getPanes().overlayLayer);
        var $layer = $overlayLayer.append("div").css("height", "100%").css("width", "100%");
        console.log($overlayLayer);
        console.log($layer);

        overlay.draw = function() {
          var projection = this.getProjection();
          console.log(projection);
          var point = $layer.selectAll("svg").data(data).enter().append("svg:svg");
          // Add marker on points
          point.append("svg:circle").attr("r", 4.5);
        }
      }
      overlay.setMap(map);  
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
