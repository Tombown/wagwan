var keystone = require('keystone'),
    async = require('async');

exports = module.exports = function (req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals,
        location = null,
        eventStartTime = locals.eventStartTime;


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

    locals.userLocation = location;
    locals.distance =

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
                "$where" : function() {
                    if (~ ['daily', 'weekly', 'monthly'].indexOf(this.reoccurance)) {
                        return true;
                    } else {
                        var now = new Date();
                        return (
                        (this.end > now)
                        &&
                        (this.startRestriction ? this.start > now : true)
                        );
                    }
                }
            });

        q.exec(function (err, results) {
            results.results.sort(function(a, b) {
                return eventStartTime(a)-eventStartTime(b);
            });

            locals.data.event = results;

            next(err);
        });

    });

    // Render the view
    view.render('front');

};
