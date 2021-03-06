/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */

var _ = require('underscore'),
    querystring = require('querystring'),
    keystone = require('keystone'),
    moment = require('moment'),
    haversine = require('haversine'),
    request = require('request');


/**
 Initialises the standard view locals

 The included layout depends on the navLinks array to generate
 the navigation in the header, you may wish to change this array
 or replace it with your own templates / logic.
 */

exports.initLocals = function (req, res, next) {
    var locals = res.locals;

    locals.navLinks = [
        {label: 'Home', key: 'home', href: '/'},
    ];

    locals.user = req.user;

    next();
};


/**
 Fetches and clears the flashMessages before a view is rendered
 */

exports.flashMessages = function (req, res, next) {
    var flashMessages = {
        info: req.flash('info'),
        success: req.flash('success'),
        warning: req.flash('warning'),
        error: req.flash('error')
    };

    res.locals.messages = _.any(flashMessages, function (msgs) {
        return msgs.length;
    }) ? flashMessages : false;

    next();
};


/**
 Prevents people from accessing protected pages when they're not signed in
 */

exports.requireUser = function (req, res, next) {
    if (!req.user) {
        req.flash('error', 'Please sign in to access this page.');
        res.redirect('/keystone/signin');
    } else {
        next();
    }
};

exports.defineLocation = function(req, res, next) {
    var debug = require('debug')('wagman:middleware:defineLocation');

    if (req.cookies.latitude && req.cookies.longitude) {
        res.locals.location = {
            latitude : req.cookies.latitude,
            longitude : req.cookies.longitude
        };

        debug('Location from cookies');
        return next();
    }


    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        token = keystone.get('db-ip token'),
        dbIpUrl;

    ip = ip.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)[0];
    dbIpUrl = 'http://api.db-ip.com/addrinfo?addr='+ip+'&api_key='+token;
    request(dbIpUrl, function(err, response, body){
        var place = JSON.parse(body);
        debug(body);

        // saving location to cookie
        res.cookie('latitude', place.latitude, { maxAge : 3600 });
        res.cookie('longutude', place.longitude, { maxAge : 3600 });

        // and providing it to controllers
        res.locals.location = {
            latitude : place.latitude,
            longitude : place.longitude
        };
        next();
    });

};

exports.timeFormatter = function(req, res, next) {
    /**
     *
     */
    res.locals.formatTime = function(frm) {
        var now = moment(),
            start = moment(frm);

        if (now > start) {
            return 'now';
        }

        if (start.diff(now, 'minutes') < 60) {
            return start.diff(now, 'minutes') + ' minutes';
        }

        if (start.diff(now, 'hours') < 24) {
            return start.diff(now, 'hours') + ' hours';
        }

        if (start.diff(now, 'days') < 2) {
            return 'tomorrow';
        }

        return start.format('D MMM');
    };

    /**
     *
     */
    res.locals.eventTime = function(frm) {
        var now = moment(),
            start = moment(frm);

        return start.format('dddd MMMM Do h:mm a');
    };

    /**
     *
     */
    res.locals.eventStartTime = function(event) {
        var period, shift,
            day = 1000 * 60 * 60 * 24;

        if (!event.reoccurance) {
            return event.start;
        }

        switch (event.reoccurance) {
            case 'daily' :
                period = day;
                break;
            case 'weekly' :
                period = day * 7;
                break;
            case 'monthly' :        // TODO: Attention, dirty patch
                period = day * 31;
                break;
        }

        shift = Math[event.startRestriction ? 'floor' : 'ceil']((Date.now() - event.start)/period);

        return new Date(+event.start + shift*period);
    };

    /**
     *
     */
    res.locals.distanceToEvent = function(event) {
        var debug = require('debug')('wagman:middleware:distanceToEvent');

        // event location is not specified
        if (!event.location || !event.location.geo) {
            return null;
        }

        if (!('location' in res.locals)) {
            debug('Location is not defined');
            return null;
        }

        return decimalAdjust('floor', haversine(res.locals.location, {
            latitude : event.location.geo[1],
            longitude : event.location.geo[0]
        }, { unit : "mile" }), -2);
    };


    next();
};


function decimalAdjust(type, value, exp) {
    if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value);
    }
    value = +value;
    exp = +exp;

    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
    }

    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));

    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}