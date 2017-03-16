/*
Midterm Submission: Outdoor Adverising in Philadlephia (A Stodyboard)
Lauren Payne-Riley

This code creates a storyboard that walks a viewer through an
applicationthat would identify outdoor advertising signs,
their owners, and connection to highways.

slide 1: initially show all the advertising
slide 2: color each owner as a different color
slide 3: filter only most prominent advertising owner
slide 4: filter all other owners
slide 5: show highwayd district sign counts
slide 6: zoom to a specific highway district
*/

/* =====================
 Leaflet setup
===================== */

var map = L.map('map', {
  center: [39.9522, -75.1639], //default on first page
  zoom: 12, //default on first page
});

//using satellite imagery from Mapbox (default tiles)
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
  'sidebar-Text': "This program helps you explore outdoor advertising in Philadelphia. It helps identify and filter by owner, and calculates the number of outdoor advertising signs in different highway districts throughout Philadelphia.",
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
  'sidebar-Text': "Given the apparent link between outdoor advertising signs and highways, this next section starts to incorporate elements of highway districts and shows the count of how many signs are in each district.",
  'panningParams': [39.991966, -75.154483],
  'zoomingParams': 11,
  'filterParam': null,

  };

  var slide6 = {
    'color': "#660066",
    'title-Header': "Linking to Highway Districts",
    'sidebar-Text': "The user will be able to click on any of the districts to zoom in and gather more information. This focuses on South Philly's Highway District as an example.",
    'panningParams': [39.904785, -75.208710], //re-focus on South District
    'zoomingParams': 13, //zoom in on district
    'filterParam': null,

    };


var allSlides = [slide1, slide2, slide3, slide4, slide5, slide6];


// Defining an App State, including the current slide # and slide information:
var appState = {
  'slideNumber': 0, // slideNumber keeps track of what slide you are on. It should increase when you
                    // click the next button and decrease when you click the previous button.
  'slideInformation': allSlides,
 };


/* =====================
  Functions & Variables (to call later)
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


//setting styles options:
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
   }
   return {};
 };
   /* note: I had a hard time finding colors that would stand out against the dark green & tan aerial photo,
   hence the extensive use of green's opposite: red. If i had to re-do I would probably change the opacity of
   the aerial background (with mapbox), or only make the aerial visible at a certain zoom (and have a more
   basic background for the initial zoomed-out level)*/

var filterStyle = function(feature){
  if (appState.slideNumber === 0){
    return {color: "#EE3B3B"};
  } else {
    switch (feature.properties.OWNER) {
      case "LAMAR ADVERTISING": return {color: "#fff"}; //white (only 1!)
      case "INTERSTATE OUTDOOR ADVERTISING": return {color: "#b2abd2"}; //light purple
      case "OUTFRONT MEDIA": return {color: "#5e3c99"}; //darkblue #3300ff
      case "STEEN OUTDOOR": return {color: "#fdae61"}; //#orange
      case "CLEAR CHANNEL OUTDOOR": return {color: "#EE3B3B"}; //red
    }
    return {};
  }
};

// creating a chloropah function (dark to light green) for use later with highway district density map
 var assingGreenChloropahColors = function(value) {
     return value > 300 ? '#31a354' :
            value > 200 ? '#a1d99b' :
                          '#e5f5e0';
 };

//creating standard marker color & style options:
 var MarkerOptions = {
     radius: 2,
     stroke: true,
     color: "#000",
    //  no fillColor (that will be determined by the style function)
     weight: 2,
     opacity: 1,
     fillOpacity: 0.8
 };

var  circleStyle = function (feature, latlng) {
         return L.circleMarker(latlng, MarkerOptions);
};

var markerClusters = L.markerClusterGroup(); //this gets filled later


//this was just a function to test the prev & next button's ability (still helps identify what slide you are on):
var setColorStyle = function (slideObject) {
   $('#blankSpace').css('background-color', slideObject.color);
   console.log("You are on slide" + " " + (appState.slideNumber + 1));
};

var showingCurrectButtonOptions = function() {
  if (appState.slideNumber === 0) {
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


var showingCorrectLegend = function() {
  if (appState.slideNumber === 0) {
    $("#legend_allRED").show();
    $("#legend_allOwners").hide();
    $("#legend_Highway").hide();
    $("#legend_HighDists").hide();
  } else if (appState.slideNumber === 4 || appState.slideNumber === 5){
    $("#legend_allRED").hide();
    $("#legend_allOwners").show();
    $("#legend_Highway").hide();
    $("#legend_HighDists").show();
  } else if (appState.slideNumber === 3){
    $("#legend_allRED").hide();
    $("#legend_allOwners").show();
    $("#legend_Highway").show();
    $("#legend_HighDists").hide();
  } else {
    $("#legend_allRED").hide();
    $("#legend_allOwners").show();
    $("#legend_Highway").hide();
    $("#legend_HighDists").hide();
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
var advertisignDataLink = 'https://raw.githubusercontent.com/LaurenPR/midtermData/master/LI_OUTDOOR_SIGNS.geojson';
var highwayDistrictDataLink = 'https://raw.githubusercontent.com/LaurenPR/midtermData/master/Highway_Districts.geojson';
var highwayMajorDataLink = 'https://raw.githubusercontent.com/LaurenPR/midtermData/master/highways.geoJSON';


 /* =====================
   Executing Code
 ===================== */
 //creating GLOBAL VARIABLES so I can reference them later, between functions (they will retain information)
 var initialAdvertisingFeatures; //global to store information about the initial advertising markers
 var subsuquentAdvertisingFeatures; //for use with new advertising markers
 var highwayFeature; // use to store feature group about the highway
 var highwayDistFeature; //use to store faeture groups about the highway districts

 $(document).ready(function() {
   $.ajax(advertisignDataLink).done(function(pointData){ //note: when it included the word "Advertising" adblocker prevented if from loading
     parsedSignData = JSON.parse(pointData);

      $.ajax(highwayDistrictDataLink).done(function(polygonData) { // download this here because we reference it for more than one slide below
        parsedHighwayDistData = JSON.parse(polygonData);

        // calculating how many advertsiement signs are in each highway district (using turf.js):
        var smartHighwayDistrictsData = turf.count(parsedHighwayDistData, parsedSignData, 'pt_count'); //joins to the polygon layer (which is what I want)

        // from the below calculation it appears the point count ranges from about 150 to 400:
        // (this informs the 3-tone chloropath cut-offs: 101-200, 201-300, 300+)
        var allpt_Counts = _.map(smartHighwayDistrictsData.features, function(item) {return item.properties.pt_count;});
        var groupedpt_Counts = _.groupBy(allpt_Counts);


        //to find unique owners in dataset & length of each array:
        var allOwners = _.map(parsedSignData.features, function(item) {return item.properties.OWNER;});
        var groupedOwners = _.groupBy(allOwners); //this variable doesn't seem to be easy to manipulate or call elements of...
        // console.log(groupedOwners);

        // RESULTS:
        // CLEAR CHANNEL OUTDOOR: Array[1266]
        // INTERSTATE OUTDOOR ADVERTISING: Array[7]
        // LAMAR ADVERTISING: Array[1]
        // OUTFRONT MEDIA: Array[65]
        // STEEN OUTDOOR: Array[189]


        //default markers on first page
        //  initialAdvertisingFeatures = L.geoJson(parsedSignData, {
        //    style: allRedStyle,
        //    filter: null,
        //    pointToLayer: circleStyle,
        //  }).addTo(map);

        // initialAdvertisingFeatures.eachLayer(function(layer){layer.bindPopup(layer.feature.properties.OWNER);});


         //UPDATED default markers on first page (but ONLY when you first open the storyboard): using cluster mapping:
          initialAdvertisingFeatures = L.geoJson(parsedSignData, {
            style: allRedStyle,
            filter: null,
          });

          markerClusters.addLayer(initialAdvertisingFeatures);
          map.addLayer(markerClusters);

          //removing the legend (no longer makes sense on initial start-up)
          $("#legend_allRED").hide();



        //code to execute with the NEXT button:
        $("#button-next").click(function() {
          // clear any existing features from map:
          if (initialAdvertisingFeatures !== undefined) {initialAdvertisingFeatures.clearLayers();} // clears any existing features from the geoJson layer for advertising, must add in the if statement because it is ONLY defined for the defaults when first open up slides
          if (subsuquentAdvertisingFeatures !== undefined) {subsuquentAdvertisingFeatures.clearLayers();} // same as above but for subsequent slides
          if (highwayFeature !== undefined) {highwayFeature.clearLayers();} // same as above but for subsequent slides
          if (highwayDistFeature !== undefined) {highwayDistFeature.clearLayers();} // same as above but for subsequent slides

           //call the next slide
          setColorStyle(nextSlide());
              /*[note: this is no-longer relevant with changing a color, however it has been
              left so it calls the next slide; attempts to create a similar zooming slide function ran into issues
              with the dot notations (similar to below). Hence, it was decided just to leave this in.]
              */

           //update sidebar text:
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

           // add highway districts data to the map:
           if (appState.slideNumber ===  4) {
              highwayDistFeature = L.geoJson(smartHighwayDistrictsData, {
               style: function(feature) {return {'color': '#fff', "weight": 2, "opacity": 1, fillColor: assingGreenChloropahColors(feature.properties.pt_count), "fillOpacity": 0.7};}
              }).addTo(map).bringToBack();
              highwayDistFeature.eachLayer(function(layer){layer.bindPopup('Point Count ' + layer.feature.properties.pt_count);}); //this throws an error when you don't append a string (similar to this issue here: http://gis.stackexchange.com/questions/141329/error-when-trying-to-bind-popup-on-geojson-failed-to-execute-appendchild)
           }

           if (appState.slideNumber ===  5) {
             highwayDistFeature = L.geoJson(smartHighwayDistrictsData, {
               style: function(feature) {return {'color': '#fff', "weight": 2, "opacity": 1, fillColor: assingGreenChloropahColors(feature.properties.pt_count), "fillOpacity": 0.7};}
             }).addTo(map).bringToBack();
             highwayDistFeature.eachLayer(function(layer){layer.bindPopup('Point Count ' + layer.feature.properties.pt_count).openPopup();});
          }

          // add advertising (once filtered or changed) to map:
           subsuquentAdvertisingFeatures = L.geoJson(parsedSignData, {
             style: theEachOwnerStyle,
             filter: appState.slideInformation[appState.slideNumber]["filterParam"],
             pointToLayer: circleStyle,
           }).addTo(map).bringToFront();

          subsuquentAdvertisingFeatures.eachLayer(function(layer){layer.bindPopup(layer.feature.properties.OWNER);});

           // change the map zoom & extend by panning:
           centerLatLng = appState.slideInformation[appState.slideNumber]["panningParams"]; //it actually doesn't read it properly using the dot notation. Ignore the warnings.
           // console.log(centerLatLng);
           zoomExtent = appState.slideInformation[appState.slideNumber]["zoomingParams"];
           // console.log(zoomExtent);
           map.setView(centerLatLng, zoomExtent);

           // ensure the correct legend appears for the map:
           showingCorrectLegend();

           // ensure only the relevant next and previous buttons are visible:
           showingCurrectButtonOptions();
         });

         //code to execute with the PREVIOUS button:
         $("#button-previous").click(function() {
           // clear any existing features from map:
           if (initialAdvertisingFeatures !== undefined) {initialAdvertisingFeatures.clearLayers();} // clears any existing features from the geoJson layer for advertising, must add in the if statement because it is ONLY defined for the defaults when first open up slides
           if (subsuquentAdvertisingFeatures !== undefined) {subsuquentAdvertisingFeatures.clearLayers();} // same as above but for subsequent slides
           if (highwayFeature !== undefined) {highwayFeature.clearLayers();} // same as above but for subsequent slides
           if (highwayDistFeature !== undefined) {highwayDistFeature.clearLayers();} // same as above but for subsequent slides

           //call the next slide
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
              highwayDistFeature = L.geoJson(smartHighwayDistrictsData, {
                style: function(feature) {return {'color': '#fff', "weight": 2, "opacity": 1, fillColor: assingGreenChloropahColors(feature.properties.pt_count), "fillOpacity": 0.7};}
              }).addTo(map).bringToBack();
              highwayDistFeature.eachLayer(function(layer){layer.bindPopup('Point Count ' + layer.feature.properties.pt_count);});
           }

           if (appState.slideNumber ===  5) {
             highwayDistFeature = L.geoJson(smartHighwayDistrictsData, {
               style: function(feature) {return {'color': '#fff', "weight": 2, "opacity": 1, fillColor: assingGreenChloropahColors(feature.properties.pt_count), "fillOpacity": 0.7};}
             }).addTo(map).bringToBack();
             highwayDistFeature.eachLayer(function(layer){layer.bindPopup('Point Count ' + layer.feature.properties.pt_count).openPopup();});
          }

          // add advertising (once filtered or changed) to map:

           subsuquentAdvertisingFeatures = L.geoJson(parsedSignData, {
             style: filterStyle,
             filter: appState.slideInformation[appState.slideNumber]["filterParam"],
             pointToLayer: circleStyle,
           }).addTo(map).bringToFront();

          subsuquentAdvertisingFeatures.eachLayer(function(layer){layer.bindPopup(layer.feature.properties.OWNER);});
          //  subsuquentAdvertisingFeatures.addData(newMapData);

          // change the map zoom & extend by panning:
           centerLatLng = appState.slideInformation[appState.slideNumber]["panningParams"];
           zoomExtent = appState.slideInformation[appState.slideNumber]["zoomingParams"];
           map.setView(centerLatLng, zoomExtent);

           // ensure the correct legend appears for the map:
           showingCorrectLegend();

           // ensure only the relevant next and previous buttons are visible:
           showingCurrectButtonOptions();
         });
     });
   });
});
