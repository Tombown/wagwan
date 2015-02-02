var x = document.getElementById("mapholder");

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition,showError);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    var latlon = position.coords.latitude+","+position.coords.longitude;

    var iframe = "https://www.google.com/maps/embed/v1/directions?key=AIzaSyBGGIS0SMA0if-LXXBBcf8bS4ta2fy5w9Y&origin="
    +latlon+"&mode=transit";
    document.getElementById("mapholder").innerHTML = "<iframe>'"+iframe+"'</iframe>";
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