const {model, Schema} = require('mongoose');

const PricesSchema = new Schema({
    brand: String,
    model: String,
    prices: Object
}, {
    timestamps: true
});

module.exports = model('Prices', PricesSchema);