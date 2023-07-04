const {model, Schema} = require('mongoose');

const PricesSchema = new Schema({
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand'
    },
    model: String,
    prices: {
        type: Object,
        default: {
            modifiedAt: new Date().toLocaleDateString(),
        }
    }
}, {
    timestamps: true
});

module.exports = model('Prices', PricesSchema);