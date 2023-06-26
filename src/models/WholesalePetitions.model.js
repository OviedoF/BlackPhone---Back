const {Schema, model} = require('mongoose');

const WholesalePetitionsSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    phone: {
        type: String,
        required: [true, 'Phone is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    contact: {
        type: String
    },
    landline: {
        type: String
    },
    address: {
        type: String,
        required: [true, 'Address is required']
    },
    province: {
        type: String,
        required: [true, 'Province is required']
    },
    municipie: {
        type: String,
        required: [true, 'Municipie is required']
    },
    authentification: {
        type: String,
        required: [true, 'Authentification is required']
    },
    approved: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

WholesalePetitionsSchema.methods.toJSON = function() {
    const {__v, _id, ...wholesalePetitions} = this.toObject();
    wholesalePetitions.uid = _id;
    return wholesalePetitions;
}

module.exports = model('WholesalePetitions', WholesalePetitionsSchema);