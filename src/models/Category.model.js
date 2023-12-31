const {model, Schema } = require('mongoose');

const categorySchema = new Schema({
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

module.exports = model('Category', categorySchema);