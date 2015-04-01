var debug = require('debug')('wagman:models:recurring');

var keystone = require('keystone'),
    moment = require('moment'),
    async = require('async'),
    Types = keystone.Field.Types,
    deepExtend = require('extend').bind(null, true);
/**
 * RecurringEvent Model
 * ==========
 */

var RecurringEvent = new keystone.List('RecurringEvent', {
    map: { name: 'name' },
    autokey: { path: 'slug', from : "name", unique: true }
});

RecurringEvent.add({
    name : String,
    type : {
        type: Types.Select,
        options: 'draft, published',
        default: 'draft',
        index: true
    },
    recurrence: {
        till : {
            type : Types.Date,
            default : Date.now(),
            required : true
        },
        period : {
            type : {
                type: Types.Select,
                options: 'daily, weekly, monthly, yearly, custom',
                default : 'weekly',
                label : 'Recurrence period',
                required : true
            },

            interval : {
                type : Number,
                label : 'Recurrence interval (days)',
                dependsOn : { 'recurrence.period.type' : 'custom'}
            }
        }
    },
    event: {
        author: {
            type: Types.Relationship,
            ref: 'User',
            index: true
        },
        title: {
            type: String,
            initial : true,
            required: true
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
        }
    }
});

RecurringEvent.schema.post('save', function(){
    var self = this,
        EventModel = keystone.list('Event').model;

    if (this.type == 'draft') {
        debug('draft - nothing to create');
        return null;
    }

    debug('State - published');
    var period;
    switch  (self.recurrence.period.type) {
        case 'daily' :
            period = { days : 1 };
            break;
        case 'weekly' :
            period = { days : 7 };
            break;
        case 'monthly' :
            period = { months : 1 };
            break;
        case 'yearly' :
            period = { years : 1 };
            break;
        case 'custom' :
            period = { days : self.recurrence.period.interval };
            break;
    }

    var eventSource,
        date = moment(self.event.start),
        till = moment(self.recurrence.till),
        continuance = moment(self.event.end).diff(self.event.start);

    var events = [];

    while (till.diff(date, 'days') >= 0) {
        eventSource = deepExtend({}, self.event.toJSON(), {
            recurring : self,
            title : self.event.title + ' (' + date.format('DD-MM-YYYY') + ')',
            start : moment(date).toDate(),
            end : moment(date).add(continuance).toDate(),
            publishedDate : new Date(),
            state : 'published'
        });

        events.push(new EventModel(eventSource));

        date.add(period);
    }

    EventModel.remove({ recurring : self }, function(err) {
        debug('removed previous event');
        err ? console.log(err) : 0;
        async.mapSeries(events, function(event, cb) {
            debug('trying to save event');
            event.save(function(err){
                debug('Event saved');
                err ? console.log(err) : 0;
                setTimeout(function(){
                    cb(err);
                }, 0)
            });
        }, function(err){
            debug('All events have been saved');
        })
    });


});

RecurringEvent.register();
