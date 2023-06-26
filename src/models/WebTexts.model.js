const {Schema, model} = require('mongoose');

const webTextSchema = new Schema({
    home: {
        location: {
            title: String,
            description: String,
        },
        doItYourself: {
            title: String,
            subTitle: String,
            description: String,
        },
        wholesale: {
            title: String,
            subTitle: String,
            description: String,
        },
        status: {
            title: String,
            subTitle: String,
            description: String,
        }
    },
    aboutUs: [{
        title: String,
        description: String,
        image: String,
    }],
    whyUs: [{
        title: String,
        description: String,
    }],
    garanties: [{
        title: String,
        description: String,
    }],
    wholesales: {
        title: String,
        description: String,
    },
    functioning: [{
        title: String,
        description: String,
    }]
}, {
    timestamps: true
});

module.exports = model('WebText', webTextSchema);