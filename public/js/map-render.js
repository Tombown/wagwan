    var map;
    $(document).ready(function(){
      map = new GMaps({
        el: '#map',
        lat: -12.043333,
        lng: -77.028333
      });


      GMaps.geolocate({
        success: function(position){
          map.setCenter(position.coords.latitude, position.coords.longitude);
        },
        error: function(error){
          alert('Geolocation failed: '+error.message);
        },
        not_supported: function(){
          alert("Your browser does not support geolocation");
        },
        always: function(){
          alert("Done!");
        }
      });

      map.drawRoute({
        origin: [-12.090814532191756, -77.02271108990476],
        destination: ['data.event.location.postcode'],
        travelMode: 'driving',
        strokeColor: '#131540',
        strokeOpacity: 0.6,
        strokeWeight: 6
      });
    });