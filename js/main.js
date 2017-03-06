/*
Resources:
- for leaflet: http://leafletjs.com/reference.html#map-set-methods
- for spatial join: http://turfjs.org/ (& https://github.com/turf-junkyard/turf-tag)

MUST DO'S:
(done) Your story map should have at least five slides
(done) Your story map should have next and previous buttons
(done) On the first slide of your story map, the previous button should be hidden
(done) On the last slide of your story map, the next button should be hidden
(done) The application should be structured in a way where clicking on the next and previous buttons will replace the data on the map and the text in the sidebar with the next or previous content (in other words, you are not building five different maps with different text and data—you are building one map in which the content changes based on user input)
(done) At least one slide should change the zoom level or center of the map.

TO DO:
- add legend
- add sums for the number of signs for each owner (perhaps in the legend)
- finish TURF count (for the highway district)

storyboard ideas:
slide 1: initially show all the advertising
slide 2: color each owner as a different color
.... what percentage each owner has of the total? (top 5)
slide 3: filter only most prominent advertising owner
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
  'sidebar-Text': "This program helps you explore outdoor advertising in Philadelphia. It helps identify and filter by owner, calculate distance to nearest highways, and calculate the number of billboards and other outdoor advertising in different neighborhoods throughout Philadelphia.",
  'panningParams': [39.9522, -75.1639],
  'zoomingParams': 12,
  'filterParam': null,
  };

var slide2 = {
  'color': "#6495ED", //blue
  'title-Header': "Identifying Different Owners",
  'sidebar-Text': "Each color represents a different owner of the outdoor advertising structure. It is interesting to note that most are owned by a small handful of campanies that, presumably, lease them to a multitude of companies.",
  'panningParams': [39.991966, -75.154483],
  'zoomingParams': 11,
  'filterParam': null,
};

  //setting the 3rd slide's filter function:
  var theBigOwnerFilter = function(feature) {
     if (feature.properties.OWNER === "CLEAR CHANNEL OUTDOOR"){
       return true;
     }
     else {
       return false;
     }
   };

var slide3 = {
  'color': "#666600",
  'title-Header': "Filter: Largest Owner",
  'sidebar-Text': "With over 1,200 signs, Clear Channel Outdoor is by far the largest outdoor advertisment owner in the city, especially when compared to its competators which combined have no more than half this amount combined. Notice how these are scattered fairly evenly across the entire city.",
  'panningParams': [39.991966, -75.154483],
  'zoomingParams': 11,
  'filterParam': theBigOwnerFilter,
};

//setting the 4th slide's filter function:
var theAlOtherOwnersFilter = function(feature) {
   if (feature.properties.OWNER !== "CLEAR CHANNEL OUTDOOR"){
     return true;
   }
   else {
     return false;
   }
 };

var slide4 = {
  'color': "#006600",
  'title-Header': "Filter: All Other Owners",
  'sidebar-Text': "By contrast, it is interesting to note that the other owners are primarily located along major freight highways. This makes sense given the high volume of traffic and greater advertisement market.",
  'panningParams': [39.991966, -75.154483],
  'zoomingParams': 11,
  'filterParam': theAlOtherOwnersFilter,
  };

var slide5 = {
  'color': "#660066",
  'title-Header': "Linking to Highway Districts",
  'sidebar-Text': "Given the apparent link between outdoor advertising signs and highways, this next section starts to incorporate elements of highway districts.",
  'panningParams': [39.991966, -75.154483],
  'zoomingParams': 11,
  'filterParam': null,

  };

  var slide6 = {
    'color': "#660066",
    'title-Header': "Linking to Highway Districts",
    'sidebar-Text': "The user will be able to click on any of the districts to zoom in and gather more information. This focuses on South Philly's Highway District as an example.",
    'panningParams': [39.902307, -75.187975], //re-focus on South District
    'zoomingParams': 13, //zoom in on district
    'filterParam': null,

    };

var allSlides = [slide1, slide2, slide3, slide4, slide5, slide6];


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
var featureGroup; //global to store information about the features that will be filtered
var newFeatureGroup; //another global to reference
var highwayFeature;
var highwayDistFeature;

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


// CLEAR CHANNEL OUTDOOR: Array[1266]
// INTERSTATE OUTDOOR ADVERTISING: Array[7]
// LAMAR ADVERTISING: Array[1]
// OUTFRONT MEDIA: Array[65]
// STEEN OUTDOOR: Array[189]


//setting styles options:

// gl = L.geoJson(data, {style: function(f) {return {'weight':10}}});

var allRedStyle = function(feature) {
    return {color: "#EE3B3B"};
 };

var theEachOwnerStyle = function(feature) {
   switch (feature.properties.OWNER) {
     case "LAMAR ADVERTISING": return {color: "#fff"}; //white (only 1!)
     case "INTERSTATE OUTDOOR ADVERTISING": return {color: "#b2abd2"}; //light purple
     case "OUTFRONT MEDIA": return {color: "#5e3c99"}; //darkblue #3300ff
     case "STEEN OUTDOOR": return {color: "#fdae61"}; //#orange
     case "CLEAR CHANNEL OUTDOOR": return {color: "#EE3B3B"}; //red

     // case " ": return {color: "#ff0000"}; //uneeded now that we filter these out!
   }
   return {};
 };

//creating standard marker color & style options:
 var MarkerOptions = {
     radius: 2,
     stroke: true,
     color: "#000",
    //  fillColor: null,
     weight: 2,
     opacity: 1,
     fillOpacity: 0.8
 };

var  circleStyle = function (feature, latlng) {
         return L.circleMarker(latlng, MarkerOptions);
};

//this was just a function to test the prev & next button's ability:
var setColorStyle = function (slideObject) {
   $('#blankSpace').css('background-color', slideObject.color);
   console.log("You are on slide" + " " + (appState.slideNumber + 1));
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

/*  Data Source: Outdoor Advertising Dataset for Philadlephia
 GeoJSON SOURCE: http://data.phl.opendata.arcgis.com/datasets/5eb34bd14d3e4cc996168a1a1c026e0e_0.geojson
 Data Fields (An Example):
       FORMAT: STATIC
       LOCATION_DESCRIPTION: G ST ES 25FT S/O BRISTOL ST F/S - 1
       GOOD_COND_INSP: YES
       OBJECTID: 1067
       ZONING_PERMIT: 29931
       GLOBALID: eb5b2163-5a34-48f2-b2d8-b33ca340510b
       AD_TYPE: R 3
       LONGITUDE: -75.109
       HEIGHT: 37'5"
       LATITUDE: 39.9912
       FACES: 1
       Y: 39.991200000003197
       COLUMNS: null
       LAST_INSP_DATE: 2015-07-01T00:00:00
       GOOD_COND_OWNER: YES
       BUILDING_PERMIT: 146198
       ADDRESS: 4301 G ST
       OWNER: CLEAR CHANNEL OUTDOOR
       PROPERTY_LOCATION: 002407 \ 097369
       _id: 67
       AD_AREA: 300

 turns out that only some of the above information actually is in the geoJSON.
 Resources for joining CSV with geoJSON (for future reference, turned out to be not needed for this project):
      https://www.mapbox.com/mapbox.js/example/v1.0.0/choropleth-joined-data-multiple-variables/
      http://gis.stackexchange.com/questions/189500/better-faster-way-to-join-a-csv-to-a-geojson-in-leaflet
*/

// data links
var dataLink = 'https://raw.githubusercontent.com/LaurenPR/midtermData/master/LI_OUTDOOR_SIGNS.geojson';
var highwayDistrictDataLink = 'https://raw.githubusercontent.com/LaurenPR/midtermData/master/Highway_Districts.geojson';
var highwayMajorDataLink = 'https://raw.githubusercontent.com/LaurenPR/midtermData/master/highways.geoJSON';


 /* =====================
   Executing Code
 ===================== */

 $(document).ready(function() {
   // var geoData = LI_OUTDOOR_ADVERTISING.geojson; //hardcoding option, does NOT work
   $.ajax(dataLink).done(function(pointData){ //note: when it included the word "Advertising" adblocker prevented if from loading
     parsedSignData = JSON.parse(pointData);
      //  console.log(parsedSignData);

      $.ajax(highwayDistrictDataLink).done(function(polygonData) { // download this here because we reference it for more than one slide below
        highwayDistrictDataLink = JSON.parse(polygonData);

        //to find unique owners in dataset & length of each array:
        var allOwners = _.map(parsedSignData.features, function(item) {return item.properties.OWNER;});
        var groupedOwners = _.groupBy(allOwners);
        // console.log(groupedOwners);
        // CHANNEL OUTDOOR: Array[1266]
        // INTERSTATE OUTDOOR ADVERTISING: Array[7]
        // LAMAR ADVERTISING: Array[1]
        // OUTFRONT MEDIA: Array[65]
        // STEEN OUTDOOR: Array[189]


        //default markers on first page
         featureGroup = L.geoJson(parsedSignData, {
           style: allRedStyle,
           filter: null,
           pointToLayer: circleStyle,
          //  onEachFeature: popupFnx
         }).addTo(map);
        //  console.log(featureGroup);

        featureGroup.eachLayer(function(layer){layer.bindPopup(layer.feature.properties.OWNER);});


         $("#button-next").click(function() {
          // clear any existing features from map:
          if (featureGroup !== undefined) {featureGroup.clearLayers();} // clears any existing features from the geoJson layer for advertising, must add in the if statement because it is ONLY defined for the defaults when first open up slides
          if (newFeatureGroup !== undefined) {newFeatureGroup.clearLayers();} // same as above but for subsequent slides
          if (highwayFeature !== undefined) {highwayFeature.clearLayers();} // same as above but for subsequent slides
          if (highwayDistFeature !== undefined) {highwayDistFeature.clearLayers();} // same as above but for subsequent slides

           //call the next slide
           setColorStyle(nextSlide());
           //undate text in sidebar:
           $("#text-heading").text(appState.slideInformation[appState.slideNumber]["title-Header"]);
           $("#text-description").text(appState.slideInformation[appState.slideNumber]["sidebar-Text"]);

           // add  highway data to the map:
           if (appState.slideNumber === 3)
           {$.ajax(highwayMajorDataLink).done(function(lineData) { //reference within the if statement because only use for 1 slide (simpler than requiring to load at beginning, I think)
             parsedHighwayData = JSON.parse(lineData);
              highwayFeature = L.geoJson(parsedHighwayData, {
               style: function(feature) {return {'color': '#fff', "weight": 2, "opacity": 0.8};} //'zIndexOffset': -99
              }).addTo(map).bringToBack();
           });}

           // add highway distrcts data to the map:
            if (appState.slideNumber ===  4) {
              highwayDistFeature = L.geoJson(highwayDistrictDataLink, {
               style: function(feature) {return {'color': '#fff', "weight": 2, "opacity": 0.8};} //'zIndexOffset': -99
              }).addTo(map).bringToBack();
           }

           if (appState.slideNumber ===  5) {
             highwayDistFeature = L.geoJson(highwayDistrictDataLink, {
              style: function(feature) {return {'color': '#fff', "weight": 2, "opacity": 0.8};} //'zIndexOffset': -99
             }).addTo(map).bringToBack();
          }

          //  console.log(3, appState.slideInformation[appState.slideNumber]["filterParam"]);
           newFeatureGroup = L.geoJson(parsedSignData, {
             style: theEachOwnerStyle,
             filter: appState.slideInformation[appState.slideNumber]["filterParam"],
             pointToLayer: circleStyle,
           }).addTo(map).bringToFront();

          featureGroup.eachLayer(function(layer){layer.bindPopup(layer.feature.properties.OWNER);});
          //  featureGroup.addData(newMapData);

           //  filterParamFnx = appState.slideInformation[appState.slideNumber]["filterFunction"];
           // change the map zoom & extend by panning:
           centerLatLng = appState.slideInformation[appState.slideNumber]["panningParams"]; //it actually doesn't read it properly using the dot notation. Ignore the warnings.
           // console.log(centerLatLng);
           zoomExtent = appState.slideInformation[appState.slideNumber]["zoomingParams"];
           // console.log(zoomExtent);
           map.setView(centerLatLng, zoomExtent);
           $("button-previous").show();
           showingCurrectButtonOptions();
         });


         $("#button-previous").click(function() {
           // clear any existing features from map:
           if (featureGroup !== undefined) {featureGroup.clearLayers();} // clears any existing features from the geoJson layer for advertising, must add in the if statement because it is ONLY defined for the defaults when first open up slides
           if (newFeatureGroup !== undefined) {newFeatureGroup.clearLayers();} // same as above but for subsequent slides
           if (highwayFeature !== undefined) {highwayFeature.clearLayers();} // same as above but for subsequent slides
           if (highwayDistFeature !== undefined) {highwayDistFeature.clearLayers();} // same as above but for subsequent slides

           setColorStyle(previousSlide());

           // update sidebar text:
           $("#text-heading").text(appState.slideInformation[appState.slideNumber]["title-Header"]);
           $("#text-description").text(appState.slideInformation[appState.slideNumber]["sidebar-Text"]);
           // add  highway data to the map:
           if (appState.slideNumber === 3)
           {$.ajax(highwayMajorDataLink).done(function(lineData) { //reference within the if statement because only use for 1 slide (simpler than requiring to load at beginning, I think)
             parsedHighwayData = JSON.parse(lineData);
              highwayFeature = L.geoJson(parsedHighwayData, {
               style: function(feature) {return {'color': '#fff', "weight": 2, "opacity": 0.8};} //'zIndexOffset': -99
              }).addTo(map).bringToBack();
           });}

           // add highway distrcts data to the map:
            if (appState.slideNumber ===  4) {
              highwayDistFeature = L.geoJson(highwayDistrictDataLink, {
               style: function(feature) {return {'color': '#fff', "weight": 2, "opacity": 0.8};} //'zIndexOffset': -99
              }).addTo(map).bringToBack();
           }

           if (appState.slideNumber ===  5) {
             highwayDistFeature = L.geoJson(highwayDistrictDataLink, {
              style: function(feature) {return {'color': '#fff', "weight": 2, "opacity": 0.8};} //'zIndexOffset': -99
             }).addTo(map).bringToBack();
          }

          //  console.log(3, appState.slideInformation[appState.slideNumber]["filterParam"]);
           newFeatureGroup = L.geoJson(parsedSignData, {
             style: theEachOwnerStyle,
             filter: appState.slideInformation[appState.slideNumber]["filterParam"],
             pointToLayer: circleStyle,
           }).addTo(map).bringToFront();

          featureGroup.eachLayer(function(layer){layer.bindPopup(layer.feature.properties.OWNER);});
          //  featureGroup.addData(newMapData);

           centerLatLng = appState.slideInformation[appState.slideNumber]["panningParams"];
           zoomExtent = appState.slideInformation[appState.slideNumber]["zoomingParams"];
           map.setView(centerLatLng, zoomExtent);
           showingCurrectButtonOptions();
         });
     });
   });
});
