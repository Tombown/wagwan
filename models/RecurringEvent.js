var keystone = require('keystone'),
    Types = keystone.Field.Types;

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
    event: {
        type: Types.Relationship,
        ref: 'Event',
        index: true
    },
    recurrence: {
        from : {
            type : Types.Date,
            default : Date.now(),
            required : true
        },
        till : {
            type : Types.Date,
            default : Date.now(),
            required : true
        },
        period : {
            type : {
                type: Types.Select,
                options: 'daily, weekly, monthly, custom',
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
    }
});

RecurringEvent.schema.pre('save', function(){
    console.log('pre.save');
    console.log(this);
});

RecurringEvent.schema.post('save', function(){
    console.log('post.save');
    console.log(this);
});

RecurringEvent.register();
