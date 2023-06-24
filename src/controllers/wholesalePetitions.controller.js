const WholesalePetitions = require('../models/WholesalePetitions.model');
require('dotenv').config();
const nodemailer = require('nodemailer');
const WholesalerApprovedEmail = require('../utils/WholesalerApprovedEmail');
const Prices = require('../models/Prices.model');
const Faults = require('../models/Faults.model');
const PricesRules = require('../models/PricesRules.model');
const pdfsMaker = require('../utils/WholesalersPdfsMaker');
const path = require('path');

const WholesalePetitionsController = {}

WholesalePetitionsController.getWholesalePetitions = async(req, res) => {
    try {
        const wholesalePetitions = await WholesalePetitions.find();
        res.status(200).json({
            status: true,
            wholesalePetitions
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false,
            error
        });
    }
}

WholesalePetitionsController.getWholesalePetition = async(req, res) => {
    try {
        const {id} = req.params;
        const wholesalePetition = await WholesalePetitions.findById(id);
        res.status(200).json({
            status: true,
            wholesalePetition
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false,
            error
        });
    }
}

WholesalePetitionsController.createWholesalePetition = async(req, res) => {
    try {
        const transporter = await nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: true,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        if(req.files && req.files.images) {
            const {images} = req.files;
           
            const url = `${process.env.BASE_URL}/uploads/${images[0].filename}`;
           
            req.body.authentification = url;
        }

        const wholesalePetition = new WholesalePetitions(req.body);
        console.log(wholesalePetition)

        const mailOptions = {
            from: `'Empetel' <${process.env.MAIL_USERNAME}>`,
            to: process.env.OWNER_EMAIL,
            subject: 'Empetel - Petición de acceso mayorista',
            html: `
            <body
        style = "display: flex; align-items: center; justify-content: center; flex-direction: column; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" >
            <div style="width: 100%;">
                <section class="order" style="width:100%;height:100%;color:#292929;">
                    <div class="header" style="background-color: #28a745; width: 100%; padding: 20px; box-sizing: border-box;">
                        <img src="https://static-00.iconduck.com/assets.00/success-icon-512x512-qdg1isa0.png" alt="order"
                            style="width: 100%;height:150px;object-fit: contain;">
                            <h2
                                style="color: white; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center;">
                                ¡Has recibido una solicitud para acceder como mayorista!</h2>
                    </div>
        
                    <p style="text-align: center;font-size: 1.2rem; padding: 20px;">
                        Por favor, asegúrate de revisar la sección de administrador -> Accesos a mayoristas.
                    </p>
        
                    <p style="text-align: center;font-size: 1.2rem; padding: 20px;">
                        ¡Muchas gracias!
                    </p>
        
            <footer
                style="width: 100%; background-color: #1b6bb1; padding: 20px; color: white; box-sizing: border-box;">
                <p style="font-size: 1.2rem; text-align: center;">Este email fue enviado por el equipo de Empetel</p>
        
                <ul style="display: flex; width: 100%; list-style: none; justify-content: center; padding: 0;">
                    <li style="font-size: 1.2rem; margin: 20px;">
                        <a href="https://www.facebook.com/empetel" style="color: white; text-decoration: none;">
                            <img src="${process.env.BASE_URL + '/static/facebook.png'}" alt="facebook"
                                style="width: 2em; height: 2em;">
                        </a>
                    </li>
                    <li style="font-size: 1.2rem; margin: 20px;">
                        <a href="https://www.instagram.com/empetel" style="color: white; text-decoration: none;">
                            <img src="${process.env.BASE_URL + '/static/instagram.png'}" alt="instagram"
                                style="width: 2em; height: 2em;">
                        </a>
                    </li>
                    <li style="font-size: 1.2rem; margin: 20px;">
                        <a href="https://www.empetel.es" style="color: white; text-decoration: none;">
                            <img src="${process.env.BASE_URL + '/static/web.png'}" alt="web"
                                style="width: 2em; height: 2em;">
                        </a>
                    </li>
                </ul>
            </footer>
                </section >
            </div >
        </ >
            `
        }

        await transporter.sendMail(mailOptions);
        await wholesalePetition.save();

        res.status(201).json({
            status: true,
            wholesalePetition
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false,
            error
        });
    }
}

WholesalePetitionsController.approve = async(req, res) => {
    try {
        const {id} = req.params;

        const wholesalePetition = await WholesalePetitions.findById(id);

        if(!wholesalePetition) return res.status(404).json({
            status: false,
            message: 'Petición de mayorista no encontrada'
        });

        const transporter = await nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: true,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: `'Empetel' <${process.env.MAIL_USERNAME}>`,
            to: wholesalePetition.email,
            subject: 'Empetel - Petición de mayorista aprobada',
            html: await WholesalerApprovedEmail({
                name: wholesalePetition.name,
                link: `${process.env.FRONTEND_URL}/mayoristas/peticion?access=${wholesalePetition._id}`
            })
        }

        await transporter.sendMail(mailOptions);

        wholesalePetition.approved = true;

        await wholesalePetition.save();

        res.status(200).json({
            status: true,
            wholesalePetition,
            message: 'Acceso de mayorista aprobado'
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false,
            error
        });
    }
}

WholesalePetitionsController.reject = async(req, res) => {
    try {
        const {id} = req.params;

        const wholesalePetition = await WholesalePetitions.findById(id);

        if(!wholesalePetition) return res.status(404).json({
            status: false,
            message: 'Acceso de mayorista no encontrada'
        });

        wholesalePetition.approved = false;

        await wholesalePetition.save();

        res.status(200).json({
            status: true,
            wholesalePetition,
            message: 'Acceso de mayorista rechazada'
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false,
            error
        });
    }
}

WholesalePetitionsController.deleteWholesalePetition = async(req, res) => {
    try {
        const {id} = req.params;
        const wholesalePetition = await WholesalePetitions.findByIdAndDelete(id);
        res.status(200).json({
            status: true,
            wholesalePetition
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false,
            error
        });
    }
}

WholesalePetitionsController.createPricesPdf = async(req, res) => {
    try {
        const {id} = req.params;

        const wholesalePetition = await WholesalePetitions.findById(id);

        if(!wholesalePetition) return res.status(404).json({
            status: false,
            message: 'Acceso de mayorista no encontrada'
        });

        const prices = await Prices.find().populate('brand');
        const faults = await Faults.find();
        const wholesalerFaults = faults.filter(fault => fault.idArea === 'wholesale');
        console.log(wholesalerFaults)

        await pdfsMaker.createPricesPdf({
            name: wholesalePetition.name,
            faults: wholesalerFaults,
            prices
        });

        res.status(200).json({
            status: true,
            prices,
            link: `${process.env.BASE_URL}/wholesales/download-pdf`
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false,
            error
        });
    }
}

WholesalePetitionsController.createPricesOutsidePdf = async(req, res) => {
    try {
        const {id} = req.params;

        const wholesalePetition = await WholesalePetitions.findById(id);

        if(!wholesalePetition) return res.status(404).json({
            status: false,
            message: 'Acceso de mayorista no encontrada'
        });

        const pricesRules = await PricesRules.findOne();
        console.log(pricesRules)
        const prices = await Prices.find().populate('brand');
        const faults = await Faults.find();
        const wholesalerFaults = faults.filter(fault => fault.idArea === 'wholesale');

        await pdfsMaker.createPricesOutsidePdf({
            name: wholesalePetition.name,
            faults: wholesalerFaults,
            prices,
            amountToPlus: pricesRules.priceWholesalerOutGranada
        });

        res.status(200).json({
            status: true,
            prices,
            link: `${process.env.BASE_URL}/wholesales/download-pdf`
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false,
            error
        });
    }
}

WholesalePetitionsController.downloadPricesPdf = async(req, res) => {
    try {
        const path = `${__dirname}/../public/api/documents/precios_mayorista.pdf`;

        res.status(200).download(path);
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false,
            error
        });
    }
}

module.exports = WholesalePetitionsController;