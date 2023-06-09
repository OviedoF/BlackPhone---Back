const {Schema, model} = require('mongoose');

const provincesSchema = new Schema({
    label: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    isLocal: {
        type: Boolean,
    },
    localIn: {
        type: String,
    }
}, {
    timestamps: true
});

module.exports = model('Province', provincesSchema);