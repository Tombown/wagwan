var keystone = require('keystone'),
	Types = keystone.Field.Types;

keystone.set('google api key', 'AIzaSyBGGIS0SMA0if-LXXBBcf8bS4ta2fy5w9Y');
keystone.set('google server api key', 'AIzaSyDZQsNBvgagxRfXM2N4O88kWcVZ9h31k1M');
keystone.set('default region', 'gb');

/**
 * Event Model
 * ==========
 */

var Event = new keystone.List('Event', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true }
});

Event.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	start: { type: Types.Datetime, default: Date.now, index: true },
	end: { type: Types.Datetime, index: true },
	startRestriction: { type: Types.Boolean },
	reoccurance: { type: Types.Select, options: 'daily, monthly, weekly, other', index: true },
	notes: { type: Types.Html, wysiwyg: true, height: 50 },
	location: { type: Types.Location},
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	image: { type: Types.CloudinaryImage },
	hashtag: { 
		first: { type: String, required: true, default: '#example' },
		second: { type: String, required: false },
		third: { type: String, required: false },
		fourth: { type: String, required: false }
	},
	description: { type: Types.Html, wysiwyg: true, height: 150 },
	price: { type: Types.Money },
	phoneNumber: { type: String,},
	link: { type: Types.Url }
});

Event.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});

Event.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Event.register();
