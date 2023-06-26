const {model, Schema } = require('mongoose');

const additionalCostSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: String,
}, {
    timestamps: true
});

module.exports = model('AdditionalCost', additionalCostSchema);