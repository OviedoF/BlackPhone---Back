const {model, Schema } = require('mongoose');

const blogEntrySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    tags: [String],
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    similars: [{
        type: Schema.Types.ObjectId,
        ref: 'BlogEntry'
    }],
    content: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

module.exports = model('BlogEntry', blogEntrySchema);