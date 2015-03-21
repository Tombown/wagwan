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
        var EventModel = keystone.list('Event').model,
            now = new Date();

        EventModel
            .aggregate([
                { $match : {
                    state : 'published',
                    $or : [
                        { startRestriction : false, end : { $gt : now } },
                        { startRestriction : true, start : { $gt : now } }
                    ]
                }},
                { $group: { _id: '$recurring', start : { $min : "$start" } }},
                { $sort : { start : 1 }}
            ])
            .exec()
            .then(function onSuccess(results){
                var ids = results.map(function(el) { return el._id }),
                    starts = results.map(function(el) { return el.start });

                return keystone.list('Event')
                    .paginate({
                        page: req.query.page || 1,
                        perPage: 10,
                        maxPages: 10
                    })
                    .where({
                        recurring : { $in : ids },
                        start :  { $in : starts },
                        "location.geo" : {
                            $near : {
                                $geometry: { type: "Point",  coordinates: [ location.longitude, location.latitude ] },
                                $minDistance: 0,
                                $maxDistance: req.query.distance || 30000
                            }
                        }
                    })
                    .exec(function(err, results){
                        locals.data.event = results;

                        next();
                    });
            }, next);

    });

    // Render the view
    view.render('front');
};
