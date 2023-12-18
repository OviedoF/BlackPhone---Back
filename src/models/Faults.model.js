const {Schema, model} = require('mongoose');

const FaultsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    id: {	
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true,
        enum: ['Local', 'Fuera', 'Mayorista']
    },
    idArea: {
        type: String,
        required: true,
        enum: ['local', 'outside', 'wholesale']
    },
    publicName: {
        type: String,
        required: true
    },
    icon: {
        type: String
    },
    description: {
        type: String
    },
}, {
    timestamps: true
});

module.exports = model('Faults', FaultsSchema);