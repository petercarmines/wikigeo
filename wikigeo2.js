/* used for storing data on locations */
var places = {
  titles: [],
  coordinates: [],
  linktitles: [],
};

var map;
var markers = [];
var marker;

/* variables and functions that create map based on data that is requested */
function initMap(lat, lng) {

  var pyrmont = {lat: lat, lng: lng};
  map = new google.maps.Map(document.getElementById('map'), {
  center: pyrmont,
   zoom: 14
      });
      for (var i = 0; i < (places.coordinates).length; i++)  {
      addMarker({lat: places.coordinates[i].x, lng: places.coordinates[i].y})
      }
    }
      function addMarker(location) {
        var marker = new google.maps.Marker({
          position: location,
          map: map
        });
        markers.push(marker);
        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
      }

      var content = places.linktitles
      var infowindow = new google.maps.InfoWindow({
        content: content
      });

            // var infowindow = new google.maps.InfoWindow();
            // google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
            //   return function () {
            //     infowindow.setContent(content);
            //     infowindow.open(map, marker);
            //   };
            // })(marker, content, infowindow));
        
      

      function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }

      function clearMarkers() {
        setMapOnAll(null);
      }

      // Shows any markers currently in the array.
      function showMarkers() {
        setMapOnAll(map);
      }

      // Deletes all markers in the array by removing references to them.
      function deleteMarkers() {
        clearMarkers();
        markers = [];
      }




// function setMapOnAll(map, object) {
//   for (var key in places.coordinates) {
//     var x = places.coordinates[key].x;
//     var y = places.coordinates[key].y;
//     var latlngset = new google.maps.LatLng(x, y);
//     var marker = new google.maps.Marker({
//       map: map, position: latlngset
//     });
//     marker.length = 0

//     markers.push(marker);
//     markers[key].setMap(map);
//     console.log(marker)
//     console.log(markers)




$(document).ready(function () {

  $('#delete').on('click', function() {
    deleteMarkers();
  })


  var radius = 500;
  $("#radius").html(radius)
  $('#plus').on('click', function() {
    radius = radius + 1000;
    $("#radius").html(radius)
  })
  $('#minus').on('click', function() {
    radius = radius - 100;
    $("#radius").html(radius)
  });

/* click function to handle all AJAX requests and calls function to create map */
  $("#search").on("click", function (event) {
    event.preventDefault();
    $("#wikiurls").html("");
    var address = $("#address-input").val();
    var googleCoord = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyCnghntSOf7EteeY_c8Ngej65kyVoktDp0";
    $.ajax({
      url: googleCoord,
      method: "GET"
    }).then(function (responseG) {
      var lat = responseG.results[0].geometry.location.lat;
      var lng = responseG.results[0].geometry.location.lng;
      var radiusvalue = radius;
      
      var geoSearch = "https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=coordinates&pageimages&pageterms&format=json&generator=geosearch&ggscoord=" + lat + "%7C" + lng + "&prop=info&inprop=url&ggsradius=" + radiusvalue + "&ggslimit=40";
      $.ajax({
        url: geoSearch,
        method: "GET"
      }).then(function (response) {
        console.log(response)
        for (var key in response.query.pages) {
          var links = `<ul> <li><a target="_blank" href= ${key, response.query.pages[key].fullurl}>${key, response.query.pages[key].title}</li><ul></a>`;
          $("#wikiurls").append(links);
          places.linktitles.push(`<a target="_blank" href= ${response.query.pages[key].fullurl}>${response.query.pages[key].title}</a>`);
          places.titles.push(response.query.pages[key].title);
          var resultCoord = "https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&prop=coordinates&titles=" + (response.query.pages[key].title);
          $.ajax({
            url: resultCoord,
            method: "GET"
          }).then(function (nearby) {
            for (var key in nearby.query.pages) {
              var wikilat = nearby.query.pages[key].coordinates[0].lat;
              var wikilon = nearby.query.pages[key].coordinates[0].lon;
              places.coordinates.push({ x: wikilat, y: wikilon });
            };
           
            initMap(lat, lng)



          });
        }
      });
    });
  });
});

