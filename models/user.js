const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    google: {
        type: Boolean,
        default: false
    },
    groups: {
        type: [String]
    },
    groupsInvitations: {
        type: [String]
    }
});

//not to see pwd in responses:

UserSchema.method('toJSON', function () {
    const { password, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
})

module.exports = model('User', UserSchema);