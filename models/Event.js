var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Event Model
 * =============
 */

var Event = new keystone.List('Event', {
	autokey: { path: 'slug', from: 'title', unique: true },
	map: { name: 'title' },
    defaultSort: '-createdAt'
	});

Event.add ({
	title: { type: String, required: true},
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft' },
	author: { type: Types.Relationship, ref: 'User' },
	createdAt: { type: Date, default: Date.now },
	publishedAt: Date,
	image: { type: Types.CloudinaryImage },
	content: {
        brief: { type: Types.Html, wysiwyg: true, height: 150 },
        extended: { type: Types.Html, wysiwyg: true, height: 400 }
    }
});

Event.defaultColumns = 'title, state|20%, author, publishedAt|15%'

Event.register()