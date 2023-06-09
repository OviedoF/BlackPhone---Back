const {model, Schema } = require('mongoose');

const brandSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

module.exports = model('Brand', brandSchema);