const {model, Schema} = require('mongoose');

const PricesSchema = new Schema({
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand'
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    image: {
        type: String,
        default: null
    },
    model: String,
    prices: {
        type: Object,
        default: {
            modifiedAt: new Date().toLocaleDateString(),
        }
    },
    position: Number,
}, {
    timestamps: true
});

module.exports = model('Prices', PricesSchema); 