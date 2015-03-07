
$(document).ready(() => {

    var page = $("body").attr('id');

    Location.getFromGeolocation(function(location){
        if (!location) { return null; }     // TODO: Handle this case;

        /*
        $('.event').each((i, el) => {
            var eventLocation = {
                latitude : $(el).data('latitude'),
                longitude : $(el).data('longitude')
            };
            console.log(eventLocation);

            var distance = decimalAdjust('ceil', location.distanceTo(eventLocation, { unit : 'mile' }), -2);
            $(el).find('.distance').text(`${distance} mile${ distance >= 2 ? 's' : ''}`);
        });
        */

        if (page == 'page-event') {
            var $event = $('.container.event-page');

            var directionsService = new google.maps.DirectionsService();
            var directionsDisplay = new google.maps.DirectionsRenderer()

            var userLocation = new google.maps.LatLng(location.latitude, location.longitude);
            var eventLocation = new google.maps.LatLng($($event).data('latitude'), $($event).data('longitude'));

            var mapOptions = {
                el : document.getElementById('map'),
                zoom: 15,
                center: userLocation,
                mapTypeControl: true,
                navigationControlOptions: {
                    style: google.maps.NavigationControlStyle.SMALL
                },
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            var map = new google.maps.Map(document.getElementById('map'), mapOptions);

            directionsDisplay.setMap(map);
            //directionsDisplay.setPanel(document.getElementById('panel'));
            var request = {
                origin: userLocation,
                destination: eventLocation,
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };

            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                }
            });
        }
    });
});