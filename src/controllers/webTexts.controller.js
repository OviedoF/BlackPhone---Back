const WebTexts = require('../models/webTexts.model');
require('dotenv').config();
const lodash = require('lodash');

const webTextsCtrl = {};

webTextsCtrl.getWebTexts = async (req, res) => {
    try {
        const webTexts = await WebTexts.findOne();
        res.status(200).json({
            status: true,
            webTexts
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Error: ' + error
        });
    }
}

webTextsCtrl.updateWebTexts = async (req, res) => {
    try {
        const body = req.body;
        const webTexts = await WebTexts.findOne();

        if(req.body.whyUs) {
            webTexts.whyUs = body.whyUs;

            await webTexts.save();

            return res.status(200).json({
                status: true,
                message: 'Sección de Por qué Nosotros actualizada correctamente'
            });
        }

        if(req.body.functioning) {
            webTexts.functioning = body.functioning;

            await webTexts.save();

            return res.status(200).json({
                status: true,
                message: 'Sección de Funcionamiento actualizada correctamente'
            });
        }

        console.log(req.body);
        const {property, value} = req.body;

        if(!property || !value) return res.status(400).json({
            message: 'No se enviaron los datos necesarios',
            status: false
        });

        lodash.set(webTexts, property, value);

        await webTexts.save();

        res.status(200).json({
            status: true,
            message: 'Sección actualizada correctamente'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: 'Error: ' + error
        });
    }
}

webTextsCtrl.createAboutUsSection = async (req, res) => {
    try {
        const body = req.body;

        const webTexts = await WebTexts.findOne();

        if(req.files && req.files.images) {
            body.image = `${process.env.BASE_URL}/uploads/${req.files.images[0].filename}`;
        }
        webTexts.aboutUs.push(body);

        await webTexts.save();

        res.status(200).json({
            status: true,
            message: 'Sección de Nosotros creada correctamente'
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Error: ' + error
        });
    }
}

webTextsCtrl.updateAboutUsSection = async (req, res) => {
    try {
        const body = req.body;

        const webTexts = await WebTexts.findOne();

        if(req.files && req.files.images) {
            body.image = `${process.env.BASE_URL}/uploads/${req.files.images[0].filename}`;
        }

        console.log(body);

        const aboutUs = webTexts.aboutUs.map(about => {
            if(about._id == body._id) {
                about = {
                    ...about,
                    ...body
                };
            }
            return about;
        });

        webTexts.aboutUs = aboutUs;

        await webTexts.save();

        res.status(200).json({
            status: true,
            message: 'Sección de Nosotros actualizada correctamente'
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Error: ' + error
        });
    }
}

webTextsCtrl.deleteAboutUsSection = async (req, res) => {
    try {
        const id = req.params.id;

        const webTexts = await WebTexts.findOne();

        const aboutUs = webTexts.aboutUs.filter(about => about._id != id);

        webTexts.aboutUs = aboutUs;

        await webTexts.save();

        res.status(200).json({
            status: true,
            message: 'Sección de Nosotros eliminada correctamente'
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Error: ' + error
        });
    }
}

webTextsCtrl.createGarantiesSection = async (req, res) => {
    try {
        const body = req.body;

        const webTexts = await WebTexts.findOne();

        if(req.files && req.files.images) {
            body.image = `${process.env.BASE_URL}/uploads/${req.files.images[0].filename}`;
        }
        
        webTexts.garanties.push(body);

        await webTexts.save();

        res.status(200).json({
            status: true,
            message: 'Sección de Garantías creada correctamente'
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Error: ' + error
        });
    }
}

webTextsCtrl.updateGarantiesSection = async (req, res) => {
    try {
        const body = req.body;

        const webTexts = await WebTexts.findOne();

        if(req.files && req.files.images) {
            body.image = `${process.env.BASE_URL}/uploads/${req.files.images[0].filename}`;
        }

        const garanties = webTexts.garanties.map(garantie => {
            if(garantie._id == body._id) {
                garantie = {
                    ...garantie,
                    ...body
                };
            }
            return garantie;
        });

        webTexts.garanties = garanties;

        await webTexts.save();

        res.status(200).json({
            status: true,
            message: 'Sección de Garantías actualizada correctamente'
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Error: ' + error
        });

    }
}

webTextsCtrl.deleteGarantiesSection = async (req, res) => {
    try {
        const id = req.params.id;

        const webTexts = await WebTexts.findOne();

        const garanties = webTexts.garanties.filter(garantie => garantie._id != id);

        webTexts.garanties = garanties;

        await webTexts.save();

        res.status(200).json({
            status: true,
            message: 'Sección de Garantías eliminada correctamente'
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Error: ' + error
        });

    }
}

module.exports = webTextsCtrl;