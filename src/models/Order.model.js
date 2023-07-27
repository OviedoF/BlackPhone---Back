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
    fault_details: String,
    additionalCosts: [Object],
    brand: String,
    model: String,
    faults: [{
        type: Schema.Types.ObjectId,
        ref: 'Faults'
    }],
    goToTheHome: Boolean,
    goToTheHomeData: {
        address: String,
        date: String,
        hour: String,
        additionalInfo: String,
    },
    province: String,
    municipie: String,

    takeToTheLocal: Boolean,
    takeToTheLocalData: {
        date: String,
        hour: String,
    },

    dontRecognized: Object,
    dontRecognizedNothing: Boolean,
    user_address: String,
    userContactData: {
        name: String,
        phone: String,
        email: String,
    },
    id: String,
    status: {
        type: Schema.Types.ObjectId,
        ref: 'Status'
    },
    status_history: [{
        status: {
            type: Schema.Types.ObjectId,
            ref: 'Status'
        },
        date: String,
    }],
    budget: Number,
}, {
    timestamps: true
});

module.exports = model('Order', OrderSchema);