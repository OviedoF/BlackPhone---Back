const AdditionalCosts = require('../models/AdditionalCosts.model');
const path = require('path');
require('dotenv').config()
const {deleteReqImages, deleteImage} = require('../utils/images.utils');

const additionalCostsController = {}

additionalCostsController.getAdditionalCosts = async (req, res) => {
    try {
        const data = await AdditionalCosts.find();

        res.status(200).send({
            message: 'AdditionalCosts retrieved successfully',
            data,
            status: true
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Ha ocurrido un error al obtener los costos adicionales',
            status: false
        })
    }
}

additionalCostsController.createAdditionalCosts = async (req, res) => {
    try {

        if(req.files && req.files.images) {
            const { images } = req.files;
            const {filename} = images[0];

            console.log(images[0])

            req.body.image = `${process.env.BASE_URL}/uploads/${filename}`;
        }

        const additionalCosts = await AdditionalCosts.find();

        for (let i = 0; i < additionalCosts.length; i++) {
            if(additionalCosts[i].name === req.body.name) {
                deleteReqImages(req);
                return res.status(400).send({
                    message: 'Ya existe un costo adicional con ese nombre',
                    status: false
                })
            }
        }

        const newAdditionalCosts = new AdditionalCosts(req.body);

        await newAdditionalCosts.save();

        res.status(200).send({
            message: 'Costo adicional creado correctamente!',
            status: true
        })
    } catch (error) {
        console.log(error);
        deleteReqImages(req);   
        res.status(500).send({
            message: 'Ha ocurrido un error al crear el costo adicional',
            status: false
        })
    }
}

additionalCostsController.updateAdditionalCosts = async (req, res) => {
    try {
        const { id } = req.params;

        if(req.files && req.files.images) {
            const { images } = req.files;
            const {filename} = images[0];

            req.body.image = `${process.env.BASE_URL}/uploads/${filename}`;
        }

        const additionalCost = await AdditionalCosts.findByIdAndUpdate(id, req.body);

        //Delete old image
        const pathOldImage = path.join(__dirname, `../public/${additionalCost.image.split('/').pop()}`);
        deleteImage(pathOldImage);

        res.status(200).send({
            message: 'Costo adicional actualizado correctamente!',
            status: true
        })
    } catch (error) {
        console.log(error);
        deleteReqImages(req);
        res.status(500).send({
            message: 'Ha ocurrido un error al actualizar el costo adicional',
            status: false
        })
    }
}

additionalCostsController.deleteAdditionalCosts = async (req, res) => {
    try {
        const { id } = req.params;

        await AdditionalCosts.findByIdAndDelete(id);

        res.status(200).send({
            message: 'Costo adicional eliminado correctamente!',
            status: true
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Ha ocurrido un error al eliminar el costo adicional',
            status: false
        })
    }
}

module.exports = additionalCostsController;