const {Schema, model} = require('mongoose');

const PricesRulesSchema = new Schema({
    priceWholesalerOutGranada: {type: Number, default: 0},
    priceOutGranada: {type: Number, default: 0},
});

module.exports = model('PricesRules', PricesRulesSchema);