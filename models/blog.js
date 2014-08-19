var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Blog Model
 * =============
 */

var Blog = new keystone.List('Blog', {
	autokey: { path: 'slug', from: 'title', unique: true },
	map: { name: 'title' },
    defaultSort: '-createdAt'
	});

Blog.add ({
	title: { type: String, required: true},
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft' },
	author: { type: Types.Relationship, ref: 'User' },
	createdAt: { type: Date, default: Date.now },
	publishedAt: Date,
	content: {
        brief: { type: Types.Html, wysiwyg: true, height: 150 },
        extended: { type: Types.Html, wysiwyg: true, height: 400 }
    }
});

Blog.defaultColumns = 'title, state|20%, author, publishedAt|15%'

Blog.register()