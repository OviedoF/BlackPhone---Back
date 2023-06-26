const {Schema, model} = require('mongoose');

const wholesaleRequestSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    wholesale: {
        type: Schema.Types.ObjectId,
        ref: 'WholesalePetitions',
        required: true
    },
    province: {
        type: String,
        required: true
    },
    municipie: {   
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    date: {
        type: String
    },
    hour: {
        type: String
    },
    request: {
        type: String,
        required: true
    },
    takeToTheLocal: {
        type: Boolean
    },
    id:{
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Schema.Types.ObjectId,
        ref: 'Status',
        required: true
    },
    status_history: [{
        status: {
            type: Schema.Types.ObjectId,
            ref: 'Status'
        },
        date: {
            type: String,
        }
    }],
}, {
    timestamps: true
});

module.exports = model('WholesaleRequest', wholesaleRequestSchema);