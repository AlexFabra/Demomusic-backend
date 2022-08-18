const { Schema, model } = require('mongoose');
const { UserSchema} = require('./user');


const PartySchema = Schema({
    url: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    members: {
        type: [String]
    },
    list: {
        type: [String]
    },
    current: {
        type: Number
    },
    mode: {
        type: String,
        default: 'GROUP_ROLE'
    }
});

module.exports = model('Party', PartySchema);