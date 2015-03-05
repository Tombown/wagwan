var keystone = require('keystone'),
    async = require('async');

exports = module.exports = function (req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals;

    // Set locals
    locals.section = 'home';
    locals.filters = {
        event: req.params.event
    };
    locals.data = {
        event: []
    };

    // Load the current event
    view.on('init', function (next) {

        var q = keystone.list('Event').model.findOne({
            state: 'published',
            slug: locals.filters.event
        }).populate('author');

        q.exec(function (err, results) {
            locals.data.event = results;
            next(err);
        });

    });

    // Render the view
    view.render('event');

};
