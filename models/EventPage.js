var keystone = require('keystone'),
    Types = keystone.Field.Types;

/**
 * EventPage Model
 * ==================
 */

var EventPage = new keystone.List('EventPage', {
    autokey: {from: 'name', path: 'key', unique: true}
});

EventPage.add({
    name: {type: String, required: true}
});

EventPage.relationship({ref: 'Event', path: 'page'});

EventPage.register();
