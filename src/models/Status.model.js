const {Schema, model} = require('mongoose');

const StatusSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: false
    },
    initial: {
        type: Boolean,
        required: true,
        default: false
    },
}, {
    timestamps: true
});

module.exports = model('Status', StatusSchema);