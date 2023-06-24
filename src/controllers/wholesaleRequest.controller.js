const WholesaleRequest = require('../models/WholesaleRequest.model');
const nodemailer = require('nodemailer');
require('dotenv').config();

const WholesaleRequestController = {}

WholesaleRequestController.getWholesaleRequests = async(req, res) => {
    try {
        const wholesaleRequests = await WholesaleRequest.find().populate('wholesale');
        res.status(200).json({
            status: true,
            requests: wholesaleRequests
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false,
            error
        });
    }
}

WholesaleRequestController.getWholesaleRequest = async(req, res) => {
    try {
        const {id} = req.params;
        const wholesaleRequest = await WholesaleRequest.findById(id);
        res.status(200).json({
            status: true,
            wholesaleRequest
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false,
            error
        });
    }
}

WholesaleRequestController.createWholesaleRequest = async(req, res) => {
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

        const mailOptions = {
            from: `'Empetel' <${process.env.MAIL_USERNAME}>`,
            to: process.env.OWNER_EMAIL,
            subject: 'Empetel - ¡Nueva solicitud al mayorista!',
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
                                ¡Has recibido un nuevo pedido al mayorista!</h2>
                    </div>
        
                    <p style="text-align: center;font-size: 1.2rem; padding: 20px;">
                        Por favor, asegúrate de revisar la sección de administrador -> Pedidos de mayoristas.
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


        const wholesaleRequest = new WholesaleRequest(req.body);
        await wholesaleRequest.save();
        res.status(201).json({
            status: true,
            wholesaleRequest,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false,
            error
        });
    }
}

WholesaleRequestController.deleteWholesaleRequest = async(req, res) => {
    try {
        const {id} = req.params;
        const wholesaleRequest = await WholesaleRequest.findByIdAndDelete(id);
        res.status(200).json({
            status: true,
            wholesaleRequest,
            message: 'La solicitud ha sido eliminada'
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false,
            error
        });
    }
}

module.exports = WholesaleRequestController;