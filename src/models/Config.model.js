const {model, Schema } = require('mongoose');

const configSchema = new Schema({
    initialPositionsPrices: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

module.exports = model('Config', configSchema);