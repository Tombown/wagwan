var keystone = require('keystone'),
    async = require('async');

exports = module.exports = function (req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals,
        location = null;


    // Init locals
    locals.routeName = 'front';
    locals.section = 'home';
    locals.filters = {
        category: req.params.category
    };
    locals.data = {
        event: []
    };

    if (req.cookies.latitude && req.cookies.longitude) {
        location = {
            latitude : req.cookies.latitude,
            longitude : req.cookies.longitude
        };
    }

    // Load the events
    view.on('init', function (next) {

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
                        $geometry: { type: "Point",  coordinates: [ location.longitude, location.latitude] },
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
