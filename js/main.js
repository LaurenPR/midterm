/*
Resources:
- for leaflet: http://leafletjs.com/reference.html#map-set-methods
- for spatial join: http://turfjs.org/ (& https://github.com/turf-junkyard/turf-tag)

*/

/* =====================
  Leaflet Configuration
===================== */

// var map = L.map('map', {
//   center: [40.000, -75.1090],
//   zoom: 11
// });
// var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
//   attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
//   subdomains: 'abcd',
//   minZoom: 0,
//   maxZoom: 20,
//   ext: 'png'
// }).addTo(map);


/* ===================== */


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
    appState.slideNumber = appState.slideNumber = 0;
  } else {appState.slideNumber = appState.slideNumber -1;
  }
  return appState.slideInformation[appState.slideNumber];
};



/* =====================
  Working with Data
===================== */


// Specifying what will be on each slide:
var slide1 = {
  'color': "#7D26CD", //purple
  'title-Header': "My First Page!",
  'sidebar-Text': "My text here.....",
  // 'PanningParams': ,
  // 'Zoomingparams': ,
  };

var slide2 = {
  'color': "#6495ED", //blue
  'title-Header': "My second Page!",
  'sidebar-Text': "More text here.....",
  // 'PanningParams': ,
  // 'Zoomingparams': ,
  };

var slide3 = {
  'color': "#666600",
  'title-Header': "My third Page!",
  'sidebar-Text': "this could talk about a filter...",
  // 'PanningParams': ,
  // 'Zoomingparams': ,
  };

var slide4 = {
  'color': "#006600",
  'title-Header': "My 4th Page!",
  'sidebar-Text': "this could talk about a second filter option...",
  // 'PanningParams': ,
  // 'Zoomingparams': ,
  };

var slide5 = {
  'color': "#660066",
  'title-Header': "5th Page!",
  'sidebar-Text': "this could zoom in!",
  // 'PanningParams': ,
  // 'Zoomingparams': ,
  };

var allSlides = [slide1, slide2, slide3, slide4, slide5];

// Importing Data:
// var geoData = LI_OUTDOOR_ADVERTISING.geojson; //hardcoding option
// var parsedData = JSON.parse(geoData);
// console.log(parsedData);

// $ajax('').done(function(){ //active data request option
  // return appState.parsedData; //this needs work



// Defining an App State, including the current slide #, slide information, and data:
var appState = {
  'slideNumber': 0, // slideNumber keeps track of what slide you are on. It should increase when you
                    // click the next button and decrease when you click the previous button. It
                    // should never get so large that it is bigger than the dataset. It should never
                    // get so small that it is smaller than 0.
  'slideInformation': allSlides,
  // 'data': parsedData,
 };


/* =====================
  Executing Code
===================== */

// var setSideBarText = function () {
// };

var setColorStyle = function (slideObject) {
   $('#blankSpace').css('background-color', slideObject.color);
   console.log("You are on slide" + " " + appState.slideNumber);
};

// "text-heading"
// "text-description"

$("#button-next").click(function() {
  setColorStyle(nextSlide());
  // console.log(1, appState.slideInformation);
  // console.log(2, appState.slideNumber);
  // console.log(3, appState.slideInformation[appState.slideNumber]);
  $("#text-heading").text(appState.slideInformation[appState.slideNumber]["title-Header"]);
  $("#text-description").text(appState.slideInformation[appState.slideNumber]["sidebar-Text"]);

});

$("#button-previous").click(function() {
  setColorStyle(previousSlide());
  $("#text-heading").text(appState.slideInformation[appState.slideNumber]["title-Header"]);
  $("#text-description").text(appState.slideInformation[appState.slideNumber]["sidebar-Text"]);

});
