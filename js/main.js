/*
Resources:
- for leaflet: http://leafletjs.com/reference.html#map-set-methods
- for spatial join: http://turfjs.org/ (& https://github.com/turf-junkyard/turf-tag)

MUST DO'S:
(done) Your story map should have at least five slides
(done) Your story map should have next and previous buttons
(done)On the first slide of your story map, the previous button should be hidden
(done) On the last slide of your story map, the next button should be hidden
(in-progress) The application should be structured in a way where clicking on the next and previous buttons will replace the data on the map and the text in the sidebar with the next or previous content (in other words, you are not building five different maps with different text and data—you are building one map in which the content changes based on user input)
(done) At least one slide should change the zoom level or center of the map.


storyboard ideas:
slide 1: initially show all the advertising
slide 2: color each owner as a different color
.... what percentage each owner has of the total? (top 5)
slide 3: filter only "billboard" size signals
slide 4: distance to highways layer (cloropath coloring based on distance)
slide 5: zoom to a specific neighborhood (COUNT??)
*/

/* =====================
 Leaflet setup
===================== */

var map = L.map('map', {
  center: [39.9522, -75.1639], //default on first page
  zoom: 12, //default on first page
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


/* ==========================================
  Creating Slide Information + Parameters
  ========================================== */

// Specifying what will be on each slide:
var slide1 = {
  'color': "#7D26CD", //purple
  'title-Header': "Outdoor Advertising in Philadelphia",
  'sidebar-Text': "My text here.....",
  'panningParams': [39.9522, -75.1639],
  'zoomingParams': 12,
  'filterFunction': theFilter = function(feature) {
     if (feature.properties.OWNER === "CLEAR CHANNEL OUTDOOR" || feature.properties.OWNER === "OUTFRONT MEDIA"){
       return false;
     }
     else {
       return true
       ;}
   },
  };

var slide2 = {
  'color': "#6495ED", //blue
  'title-Header': "My second Page!",
  'sidebar-Text': "More text here.....",
  'panningParams': [39.9522, -75.1639],
  'zoomingParams': 10,
  'filterParam': function(e){return e;},
  };

var slide3 = {
  'color': "#666600",
  'title-Header': "My third Page!",
  'sidebar-Text': "this could talk about a filter...",
  'panningParams': [39.9522, -75.1639],
  'zoomingParams': 11,
  'filterParam': function(e){return e;},
  };

var slide4 = {
  'color': "#006600",
  'title-Header': "My 4th Page!",
  'sidebar-Text': "this could talk about a second filter option...",
  'panningParams': [39.9522, -75.1639],
  'zoomingParams': 5,
  'filterParam': function(e){return e;},

  };

var slide5 = {
  'color': "#660066",
  'title-Header': "5th Page!",
  'sidebar-Text': "this could zoom in!",
  'panningParams': [39.9522, -75.1639],
  'zoomingParams': 12,
  'filterParam': function(e){return e;},

  };

var allSlides = [slide1, slide2, slide3, slide4, slide5];


// Defining an App State, including the current slide # and slide information:
var appState = {
  'slideNumber': 0, // slideNumber keeps track of what slide you are on. It should increase when you
                    // click the next button and decrease when you click the previous button. It
                    // should never get so large that it is bigger than the dataset. It should never
                    // get so small that it is smaller than 0.
  'slideInformation': allSlides,
 };


/* =====================
  Functions (to call later)
===================== */

//creating GLOBAL VARIABLES so I can reference them outside the functions
// var filterParamFnx; //this filter function changes for each slide
// var parsedData;
var featureGroup; //global to store information about the features that will be filtered


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

// more global variables to reference later
 var theFilter;
 var theStyle;

//setting default filter & styles (for first page):
theFilter = function(feature) {
   if (feature.properties.OWNER === "CLEAR CHANNEL OUTDOOR" || feature.properties.OWNER === "OUTFRONT MEDIA"){
     return false;
   }
   else {
     return true;
   }
 };

 var theFilter2 = function(feature) {
      return feature;
  };

theStyle = function(feature) {
   switch (feature.properties.OWNER) {
     case "CLEAR CHANNEL OUTDOOR": return {color: "#b35806"};
     case "OUTFRONT MEDIA": return {color: "#f1a340"};
     // case " ": return {color: "#ff0000"}; //uneeded now that we filter these out!
   }
   return {};
 };

//creating standard marker color & style options:
 var purpleMarkerOptions = {
     radius: 5,
     fillColor: null,
     color: "#660066",
     weight: 1,
     opacity: 1,
     fillOpacity: 0.8
 };

var  circleStyle = function (feature, latlng) {
         return L.circleMarker(latlng, purpleMarkerOptions);
};

//this was just a function to test the prev & next button's ability:
var setColorStyle = function (slideObject) {
   $('#blankSpace').css('background-color', slideObject.color);
   console.log("You are on slide" + " " + appState.slideNumber);
};


var showingCurrectButtonOptions = function() {
  if (appState.slideNumber === 0) {
    // console.log(1, appState.slideNumber);
    // console.log(2, appState.slideInformation.length -1);
    $("#button-previous").hide();
    $("#button-next").show();
  } else if (appState.slideNumber === (appState.slideInformation.length -1)){
    $("#button-previous").show();
    $("#button-next").hide();
  } else {
    $("#button-previous").show();
    $("#button-next").show();
  }
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

var dataLink = 'https://raw.githubusercontent.com/LaurenPR/midtermData/master/LI_OUTDOOR_SIGNS.geojson';

 /* =====================
   Executing Code
 ===================== */

 /* =====================
   Download the data and call the parse and marker functions to mape the data
   (use .done function to ensure that the functions are NOT called until after
   the data has loaded):
 ===================== */

 $(document).ready(function() {
   // var geoData = LI_OUTDOOR_ADVERTISING.geojson; //hardcoding option, does NOT work
   $.ajax(dataLink).done(function(data){ //note: when it included the word "Advertising" adblocker prevented if from loading
     parsedData = JSON.parse(data);
      //  console.log(parsedData);

      //to find unique owners in dataset & length of each array:
      var allOwners = _.map(parsedData.features, function(item) {return item.properties.OWNER;});
      _.groupBy(allOwners);

      // //default markers on first page
      //  featureGroup = L.geoJson(parsedData, {
      //    style: theStyle,
      //    filter: theFilter,
      //    pointToLayer: circleStyle,
      //   //  onEachFeature: popupFnx
      //  }).addTo(map);
      // //  console.log(featureGroup);
      //
      // featureGroup.eachLayer(function(layer){layer.bindPopup(layer.feature.properties.OWNER);});



       $("#button-next").click(function() {
         // clear features from map:
        //  featureGroup.clearLayers(); // clears any existing features from the geoJson layer for advertising
         //call the next slide (THIS SHOULD CHANGE)
         setColorStyle(nextSlide());
         //undate text in sidebar:
         $("#text-heading").text(appState.slideInformation[appState.slideNumber]["title-Header"]);
         $("#text-description").text(appState.slideInformation[appState.slideNumber]["sidebar-Text"]);
         // add new data to the map:
         console.log(3 , appState.slideInformation[appState.slideNumber]["filterParam"]);
         var newMapData = L.geoJson(parsedData, {
           style: theStyle,
           filter: appState.slideInformation[appState.slideNumber]["filterParam"],
           pointToLayer: circleStyle,
         }).addTo(map);
        //  featureGroup.eachLayer(function(layer){layer.bindPopup(layer.feature.properties.OWNER);});
        //  featureGroup.addData(newMapData);

         //  filterParamFnx = appState.slideInformation[appState.slideNumber]["filterFunction"];
         // change the map zoom & extend by panning:
         centerLatLng = appState.slideInformation[appState.slideNumber]["panningParams"];
         // console.log(centerLatLng);
         zoomExtent = appState.slideInformation[appState.slideNumber]["zoomingParams"];
         // console.log(zoomExtent);
         map.setView(centerLatLng, zoomExtent);
         $("button-previous").show();
         showingCurrectButtonOptions();
       });


       $("#button-previous").click(function() {
         featureGroup.clearLayers(); // inherited from LayerGroup
         setColorStyle(previousSlide());
         $("#text-heading").text(appState.slideInformation[appState.slideNumber]["title-Header"]);
         $("#text-description").text(appState.slideInformation[appState.slideNumber]["sidebar-Text"]);
         centerLatLng = appState.slideInformation[appState.slideNumber.panningParams];
         zoomExtent = appState.slideInformation[appState.slideNumber.zoomingparams];
         centerLatLng = appState.slideInformation[appState.slideNumber]["panningParams"];
         zoomExtent = appState.slideInformation[appState.slideNumber]["zoomingParams"];
         map.setView(centerLatLng, zoomExtent);
     });
   });
});


// notes: you MUST give it a raw github link (no java)
// setStyle (method) on top of any layer, it will just expet a path option (will just want to get back the posisble things you can tell it under options, i.e. opacity, lineJoin, lineCap, etc.)
// different when passing a geoJSON a function (pass it a function because the color might vary according to a variable i.e. a chloropath)

// gl = L.geoJson(data, {style: function(f) {return {'weight':10}}});
