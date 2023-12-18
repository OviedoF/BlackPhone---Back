const {model, Schema} = require('mongoose');

const OrderSchema = new Schema({
    additionalCosts: [{
        ref: 'AdditionalCost',
        type: Schema.Types.ObjectId
    }],
    address: {
        type: String
    },
    amount: {
        type: Number,
        required: true
    },
    brand: {
        ref: 'Brand',
        type: Schema.Types.ObjectId
    },
    customBrand: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    date: {
        type: String
    },
    fault_details: {
        type: String,
    },
    fault_photos: [{
        type: String,
    }],
    faults: [{
        ref: 'Faults',
        type: Schema.Types.ObjectId
    }],
    method: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    },
    hour: {
        type: String,
    },
    status: {
        ref: 'Status',
        type: Schema.Types.ObjectId
    },
    status_history: [Object],
    id: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    recognized: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
});

module.exports = model('Order', OrderSchema);