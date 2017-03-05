/*
Resources:
- for leaflet: http://leafletjs.com/reference.html#map-set-methods
- for spatial join: http://turfjs.org/ (& https://github.com/turf-junkyard/turf-tag)

*/

/* =====================
 Leaflet setup
===================== */
var centerLatLng = [39.9522, -75.1639]; //default on first page
var zoomExtent = 12; //default on first page

var map = L.map('map', {
  center: centerLatLng,
  zoom: zoomExtent
});

// alternative map using Stamen Tiles
// var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
//   attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
//   subdomains: 'abcd',
//   minZoom: 0,
//   maxZoom: 20,
//   ext: 'png'
// }).addTo(map);

//using satellite imagery from Mapbox (Default)
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 22,
    id: 'mapbox.satellite',
    accessToken: 'pk.eyJ1IjoibGF1cmVucHIiLCJhIjoiY2l6dnE0OTEyMDFhbDMzbmg1OHc4NHUxbiJ9.MbtcEw5vS99Rl66Ef2Htfg',
}).addTo(map);


/* =====================
  Functions (to call later)
===================== */

// This switches what is being active on the page to the next Slide (no wrapping: hard stop at end slide)
var nextSlide = function () {
 var limit = appState.slideInformation.length -1;
 if  (appState.slideNumber +1 > limit) {
   appState.slideNumber = appState.slideNumber = limit;
 } else {appState.slideNumber = appState.slideNumber +1;
 } return appState.slideInformation[appState.slideNumber];
};

// This switches what is being active on the page to the previous Slide (no wrapping: hard stop at first slide)
var previousSlide = function () {
  if  (appState.slideNumber - 1 < 0) {
    // appState.slideNumber = appState.slideNumber = 0;
    // $("#button-next").hide;
  } else {appState.slideNumber = appState.slideNumber -1;
  }
  return appState.slideInformation[appState.slideNumber];
};

// This function parses data from a JSON and returns the result
// var parseData = function(allAjaxResponseValues) {
//   return JSON.parse(allAjaxResponseValues);
// };

// This function makes marker (they can later be added to the map)
var makeMarkers = function(parsedVariables, latitutdeField, longitudeField) {
  var interumMarkers = _.map(parsedVariables, function(crimeSpot){
      return L.marker([crimeSpot[latitutdeField], crimeSpot[longitudeField]]);
      }
  );
  return interumMarkers;
};


var plotMarkers = function(markersList) {
  // console.log(markersList);
  _.each(markersList, function(individualMarker){
    individualMarker.addTo(map);
  });
};


var resetMap = function(allMarkers) {
  _.each(allMarkers, function(eachMarker){
    map.removeLayer(eachMarker); //could also use each, yes?
  });
};


// centerLatLng = [39.9522, -75.1639]; //default on first page
// zoomExtent = 12; //default on first page

var updateMapFnx = function (){

};

var setColorStyle = function (slideObject) {
   $('#blankSpace').css('background-color', slideObject.color);
   console.log("You are on slide" + " " + appState.slideNumber);
};


/* ==========================================
  Creating Slide Information + Parameters
  ========================================== */


// Specifying what will be on each slide:
var slide1 = {
  'color': "#7D26CD", //purple
  'title-Header': "Outdoor Advertising in Philadelphia",
  'sidebar-Text': "My text here.....",
  'panningParams': [39.9522, -75.1639],
  'zoomingparams': 12,
  };

var slide2 = {
  'color': "#6495ED", //blue
  'title-Header': "My second Page!",
  'sidebar-Text': "More text here.....",
  'panningParams': [39.9522, -75.1639],
  'zoomingparams': 10,
  };

var slide3 = {
  'color': "#666600",
  'title-Header': "My third Page!",
  'sidebar-Text': "this could talk about a filter...",
  'panningParams': [39.9522, -100],
  'zoomingparams': 11,
  };

var slide4 = {
  'color': "#006600",
  'title-Header': "My 4th Page!",
  'sidebar-Text': "this could talk about a second filter option...",
  'panningParams': [52, -75.1639],
  'zoomingparams': 5,
  };

var slide5 = {
  'color': "#660066",
  'title-Header': "5th Page!",
  'sidebar-Text': "this could zoom in!",
  'panningParams': [39.9522, -75.1639],
  'zoomingparams': 12,
  };

var allSlides = [slide1, slide2, slide3, slide4, slide5];


// Defining an App State, including the current slide #, slide information, and data:
var appState = {
  'slideNumber': 0, // slideNumber keeps track of what slide you are on. It should increase when you
                    // click the next button and decrease when you click the previous button. It
                    // should never get so large that it is bigger than the dataset. It should never
                    // get so small that it is smaller than 0.
  'slideInformation': allSlides,
  // 'data': undefined,
 };



 /* =====================
   Importing Data
 ===================== */
 // Data Source: Outdoor Advertising Dataset for Philadlephia
 // GeoJSON SOURCE: http://data.phl.opendata.arcgis.com/datasets/5eb34bd14d3e4cc996168a1a1c026e0e_0.geojson
 // Data Fields (An Example):
 //       FORMAT: STATIC
 //       LOCATION_DESCRIPTION: G ST ES 25FT S/O BRISTOL ST F/S - 1
 //       GOOD_COND_INSP: YES
 //       OBJECTID: 1067
 //       ZONING_PERMIT: 29931
 //       GLOBALID: eb5b2163-5a34-48f2-b2d8-b33ca340510b
 //       AD_TYPE: R 3
 //       LONGITUDE: -75.109
 //       HEIGHT: 37'5"
 //       LATITUDE: 39.9912
 //       FACES: 1
 //       Y: 39.991200000003197
 //       COLUMNS: null
 //       LAST_INSP_DATE: 2015-07-01T00:00:00
 //       GOOD_COND_OWNER: YES
 //       BUILDING_PERMIT: 146198
 //       ADDRESS: 4301 G ST
 //       OWNER: CLEAR CHANNEL OUTDOOR
 //       PROPERTY_LOCATION: 002407 \ 097369
 //       _id: 67
 //       AD_AREA: 300

 var parsedData;

 // var geoData = LI_OUTDOOR_ADVERTISING.geojson; //hardcoding option, does NOT work
 $.ajax('https://raw.githubusercontent.com/LaurenPR/midtermData/master/LI_OUTDOOR_SIGNS.geojson').done(function(data){
   parsedData = JSON.parse(data);
   updateMapFnx(parsedData);
 });

// note: you MUST give it a raw github link (no java)
// setStyle (method) on top of any layer, it will just expet a path option (will just want to get back the posisble things you can tell it under options, i.e. opacity, lineJoin, lineCap, etc.)
// different when passing a geoJSON a function (pass it a function because the color might vary according to a variable i.e. a chloropath)

// gl = L.geoJson(data, {style: function(f) {return {'weight':10}}});



/* =====================
  Executing Code
===================== */

$("#button-next").click(function() {
  setColorStyle(nextSlide());
  console.log(1, appState.slideInformation);
  console.log(2, appState.slideNumber);
  console.log(3, appState.slideInformation[appState.slideNumber]);
  $("#text-heading").text(appState.slideInformation[appState.slideNumber]["title-Header"]);
  $("#text-description").text(appState.slideInformation[appState.slideNumber]["sidebar-Text"]);
  centerLatLng = appState.slideInformation[appState.slideNumber]["panningParams"];
  console.log(centerLatLng);
  zoomExtent = appState.slideInformation[appState.slideNumber]["zoomingparams"];
  console.log(zoomExtent);
  map.setView(centerLatLng, zoomExtent);
});


$("#button-previous").click(function() {
  setColorStyle(previousSlide());
  $("#text-heading").text(appState.slideInformation[appState.slideNumber]["title-Header"]);
  $("#text-description").text(appState.slideInformation[appState.slideNumber]["sidebar-Text"]);
  centerLatLng = appState.slideInformation[appState.slideNumber.panningParams];
  zoomExtent = appState.slideInformation[appState.slideNumber.zoomingparams];

});
