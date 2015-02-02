$(document).ready(function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition,showError);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }

function showPosition(position) {
    var latlon = position.coords.latitude+","+position.coords.longitude;
    var postcode = "data.event.location.postcode";
    var london = 'london';

    document.getElementById("mapholder").innerHTML = "<iframe width='100%', height='300px', frameborder='0', style='border: 0;', src='https://www.google.com/maps/embed/v1/directions?key=AIzaSyBGGIS0SMA0if-LXXBBcf8bS4ta2fy5w9Y&origin="+latlon+"&destination=" +postcode+ "'></iframe>";
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
    }
}

});