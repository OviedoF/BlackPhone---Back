const {model, Schema } = require('mongoose');

const brandSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = model('Brand', brandSchema);