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
});

module.exports = model('WholesaleRequest', wholesaleRequestSchema);