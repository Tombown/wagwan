var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Init locals
	locals.section = 'home';
	locals.filters = {
		category: req.params.category
	};
	locals.data = {
		event: [],
	};

	// Load the events
	view.on('init', function(next) {
		
		var q = keystone.list('Event').paginate({
				page: req.query.page || 1,
				perPage: 10,
				maxPages: 10
			})
			.where('state', 'published')
			.sort('start');
		
		q.exec(function(err, results) {
			locals.data.event = results;
			next(err);
		});
		
	});
	
	// Render the view
	view.render('index');
	
};
