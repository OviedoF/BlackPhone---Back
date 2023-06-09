const {model, Schema} = require('mongoose');

const OrderSchema = new Schema({
    recognized: {
        type: Boolean,
        required: true
    },
    // If not recognized
    name: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    message: {
        type: String,
        required: false
    },
    phone_photos: [String],
    fault_photos: [String],
}, {
    timestamps: true
});

module.exports = model('Order', OrderSchema);