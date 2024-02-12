const { model, Schema } = require('mongoose');

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
    index: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = model('Brand', brandSchema);