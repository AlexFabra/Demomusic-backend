const { Schema, model } = require('mongoose');
const { UserSchema } = require('./user');


const PartySchema = Schema({

    name: {
        type: String,
        required: true
    },

    img: {
        type: String
    },

    members: 
        [{
            email: { type: String },
            admin: { type: Boolean}
        }]
    ,

    list: [{
        id: { type: String },
        img: { type: String },
        name: { type: String },
        votes: { type: Number },
        votedFor: { type: [String] }
    }],

    current: {
        type: Number
    },

    mode: {
        type: String,
        default: 'GROUP_ROLE'
    }
});

module.exports = model('Party', PartySchema);