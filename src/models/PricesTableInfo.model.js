const {model, Schema} = require('mongoose');

const PricesTableInfoSchema = new Schema({
    headers: [{
        name: String,
        area: String,
        publicName: String,
        id: String,
        idArea: String
    }],
});

module.exports = model('PricesTableInfo', PricesTableInfoSchema);