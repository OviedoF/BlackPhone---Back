const {model, Schema } = require('mongoose');

const brandSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
}, {
    timestamps: true
});

module.exports = model('Brand', brandSchema);