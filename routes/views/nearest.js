var debug = require('debug')('wagman:routes:nearest');

var keystone = require('keystone'),
    async = require('async');

exports = module.exports = function (req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals,
        location = locals.location;


    // Init locals
    locals.routeName = 'front';
    locals.section = 'home';
    locals.filters = {
        category: req.params.category
    };
    locals.data = {
        event: []
    };

    // Load the events
    view.on('init', function (next) {

        debug(location);
        var q = keystone.list('Event')
            .paginate({
                page: req.query.page || 1,
                perPage: 10,
                maxPages: 10
            })
            .where({
                "state" : "published",
                "location.geo" : {
                    $near : {
                        $geometry: { type: "Point",  coordinates: [ location.longitude, location.latitude ] },
                        $minDistance: 0,
                        $maxDistance: req.query.distance || 30000
                    }
                }
            });

        q.exec(function (err, results) {
            locals.data.event = results;

            next(err);
        });

    });

    // Render the view
    view.render('front');
};
