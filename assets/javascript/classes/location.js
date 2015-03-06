class Location {
    constructor(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    /**
     *      Parses location from cookies
     *
     *      @returns {Location} || null
     */
    static getfromCookie() {
        if (Cookie.hasItem('longitude') && Cookie.hasItem('latitude')) {
            return new Location(Cookie.getItem('latitude'), Cookie.getItem('longitude'));
        }
        return null;
    };

    /**
     *
     *      @callback {Location} || null
     */
    static getFromGeolocation(cb) {
        if (! "geolocation" in navigator) {
            console.log('Geolocation unavailable');
            cb(null);
        }

        /*TEMP*/
        cb(new Location(52.769609, 41.400937));

        //navigator.geolocation.getCurrentPosition(function(position) {
        //    console.log(position);
        //
        //    Cookie.setItem('latitude', position.coords.latitude);
        //    Cookie.setItem('longitude', position.coords.longitude);
        //    cb(new Location(position.coords.latitude, position.coords.longitude));
        //});
    }

    /**
     *      @callback {Location} || null
     */
    static getFromMap(cb) {
        // TODO: implement this
    }



    /**
     *      Provides distance to the point
     *
     *      @doc: http://en.wikipedia.org/wiki/Haversine_formula
     */
    distanceTo(location, options) {
        options = options || {};

        var R = {
            km : 6371,
            mile  : 3960
        };

        R = options.unit === 'mile' ? R.mile : R.km;

        var dLat = deg2rad(location.latitude - this.latitude);
        var dLon = deg2rad(location.longitude - this.longitude);
        var a =
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(deg2rad(this.latitude)) * Math.cos(deg2rad(location.latitude)) *
                Math.sin(dLon/2) * Math.sin(dLon/2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;


        function deg2rad(deg) {
            return deg * (Math.PI/180)
        }
    }

}
