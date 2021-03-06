var _ = require('underscore'),
    keystone = require('keystone'),
    middleware = require('./middleware'),
    importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('routes', middleware.timeFormatter);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
    views: importRoutes('./views')
};

// Setup Route Bindings
exports = module.exports = function (app) {
    app.use(middleware.defineLocation);

    // Views
    app.get('/', routes.views.front);
    app.get('/nearest', routes.views.nearest);
    app.get('/event/:event', routes.views.event);


    // Api
    app.get('/events', Function.prototype); // TODO: Add handler here
};
