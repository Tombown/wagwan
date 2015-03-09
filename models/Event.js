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
    author: {
        type: Types.Relationship,
        ref: 'User',
        index: true
    },
    title: {
        type: String,
        required: true
    },
    state: {
        type: Types.Select,
        options: 'draft, published',
        default: 'draft',
        index: true
    },
    start: {
        type: Types.Datetime,
        default: Date.now(),
        index: true
    },
    end: {
        type: Types.Datetime,
        default: Date.now()+1000*60*60*24,
        index: true
    },
    startRestriction: Types.Boolean,
    //reoccurance: {type: Types.Select, options: 'daily, monthly, weekly, other', index: true},
    location: Types.Location,
    publishedDate: {
        type: Types.Date,
        index: true,
        dependsOn: { state: 'published' }
    },
    image: Types.CloudinaryImage,
    hashtag: {
        first: { type: String, required: true, default: '#example' },
        second: String,
        third: String,
        fourth: String
    },
    price: Types.Money,
    phoneNumber: String,
    link: Types.Url,
    brief: {
        type: Types.Html,
        wysiwyg: true,
        height: 50
    },
    extended: {
        type: Types.Html,
        wysiwyg: true,
        height: 150
    }
});

Event.schema.virtual('description').get(function () {
    return this.brief + this.extended;
});

Event.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Event.register();
