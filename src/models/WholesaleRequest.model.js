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
        type: String,
        required: true
    },
    hour: {
        type: String,
        required: true
    },
    request: {
        type: String,
        required: true
    }
});

module.exports = model('WholesaleRequest', wholesaleRequestSchema);