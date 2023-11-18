const {model, Schema} = require('mongoose');

const PricesTableInfoSchema = new Schema({
    headers: [{
        name: String,
        id: String
    }],
    faults: [{
        type: Schema.Types.ObjectId,
        ref: 'Faults'
    }]
});

module.exports = model('PricesTableInfo', PricesTableInfoSchema);