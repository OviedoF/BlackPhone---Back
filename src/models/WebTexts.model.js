const {Schema, model} = require('mongoose');

const webTextSchema = new Schema({
    home: {
        hero: {
            title: String,
            subTitle: String,
            itemOne: String,
            itemTwo: String,
        },
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
        },
        brands: {
            title: String,
        }
    },
    aboutUs: [{
        title: String,
        description: String,
        image: String,
    }],
    aboutUsTitle: String,
    whyUs: [{
        title: String,
        description: String,
    }],
    whyUsTitle: String,
    garanties: [{
        title: String,
        description: String,
        image: String,
    }],
    garantiesTitle: String,
    wholesales: {
        title: String,
        description: String,
        image: String,
    },
    functioning: [{
        title: String,
        description: String,
    }],
    functioningTitle: String,
    fixMyPhone: {
        title: String
    }
}, {
    timestamps: true
});

module.exports = model('WebText', webTextSchema);