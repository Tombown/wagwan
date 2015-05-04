require('dotenv').load();

var keystone = require('keystone');

keystone.init({
    'name': 'Wagwan',
    'brand': 'Wagwan',

    'less': 'public',
    'static': 'public',
    'favicon': 'public/favicon.ico',
    'views': 'templates/views',
    'view engine': 'jade',

    'auto update': true,
    'session': true,
    'auth': true,
    'user model': 'User',
    'cookie secret': 'LHNb|tCc-V$HTwZOw$"(TMD=3($2)|b~5ta@G_63u"+|()V6-QKk$~eg6t#0_>IF'
});

keystone.import('models');

keystone.set('cloudinary config', {
    cloud_name: 'wagwan',
    api_key: '889197152859195',
    api_secret: 'Z-JUtkZee17XTSRa6JC8rUhZHFs'
});

keystone.set('db-ip token', 'b444a199c1185cb044c5cf8306451d990a6531ac');

if (keystone.get('env') == "development") {
    keystone.set('mongo', 'mongodb://localhost/wagman');
}

keystone.set('google api key', 'AIzaSyBGGIS0SMA0if-LXXBBcf8bS4ta2fy5w9Y');
keystone.set('google server api key', 'AIzaSyDZQsNBvgagxRfXM2N4O88kWcVZ9h31k1M');
keystone.set('default region', 'gb');

keystone.set('locals', {
    _: require('underscore'),
    env: keystone.get('env'),
    utils: keystone.utils,
    editable: keystone.content.editable
});

keystone.set('routes', require('./routes'));

keystone.set('nav', {
    'users': 'users'
});

keystone.set('port', '8080')

keystone.start();
