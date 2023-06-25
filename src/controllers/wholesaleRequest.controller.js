const WholesaleRequest = require('../models/WholesaleRequest.model');
const Wholesale = require('../models/WholesalePetitions.model');
const Order = require('../models/Order.model');
const Status = require('../models/Status.model');
const nodemailer = require('nodemailer');
require('dotenv').config();

async function randomNumber() {
    var numero = '';

    for (var i = 0; i < 5; i++) {
        numero += Math.floor(Math.random() * 10);
    }

    let orderAlreadyExists = await Order.findOne({ id: numero });

    let wholesaleAlreadyExists = await WholesaleRequest.findOne({ id: numero });

    while (orderAlreadyExists || wholesaleAlreadyExists) {
        numero = '';

        for (var i = 0; i < 5; i++) {
            numero += Math.floor(Math.random() * 10);
        }

        orderAlreadyExists = await Order.findOne({ id: numero });
    }

    return numero;
}

const WholesaleRequestController = {}

WholesaleRequestController.getWholesaleRequests = async(req, res) => {
    try {
        const wholesaleRequests = await WholesaleRequest.find().populate(['wholesale', 'status', 'status_history.status']);
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
        const wholesaleRequest = await WholesaleRequest.findOne({
            id
        }).populate(['wholesale', 'status', 'status_history.status']);
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
        const initialStatus = await Status.findOne({ initial: true });
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

        const ownerWholesale = await Wholesale.findById(req.body.wholesale);

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


        const wholesaleRequest = new WholesaleRequest({
            ...req.body,
            id: await randomNumber(),
            status: initialStatus._id,
            status_history: [{
                status: initialStatus._id,
                date: new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear()
            }]
        });
        await wholesaleRequest.save();

        console.log(req.body)

        const mailOptionsWholesale = {
            from: `'Empetel' <${process.env.MAIL_USERNAME}>`,
            to: ownerWholesale.email,
            subject: 'Empetel - ¡Hemos recibido tu solicitud al mayorista!',
            html: 
            `
            <body
        style = "display: flex; align-items: center; justify-content: center; flex-direction: column; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" >
            <div style="width: 100%;">
                <section class="order" style="width:100%;height:100%;color:#292929;">
                    <div class="header" style="background-color: #28a745; width: 100%; padding: 20px; box-sizing: border-box;">
                        <img src="https://static-00.iconduck.com/assets.00/success-icon-512x512-qdg1isa0.png" alt="order"
                            style="width: 100%;height:150px;object-fit: contain;">
                            <h2
                                style="color: white; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center;">
                                ¡Hemos recibido tu pedido al mayorista!</h2>
                    </div>
        
                    <p style="text-align: center;font-size: 1.2rem; padding: 20px;">
                        Con el siguiente código podrás consultar el estado de tu pedido: <strong>${wholesaleRequest.id}</strong>
                    </p>
        
                    <p style="text-align: center;font-size: 1.2rem; padding: 20px;">
                        ¡Muchas gracias por confiar en Empetel!
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

        await transporter.sendMail(mailOptionsWholesale);

        res.status(201).json({
            status: true,
            requestId: wholesaleRequest.id,
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

WholesaleRequestController.changeStatus = async(req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

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

        const statusFinded = await Status.findById(status);

        const wholesaleRequest = await WholesaleRequest.findById(id).populate('wholesale');

        const statusHistory = [...wholesaleRequest.status_history, {
            status: statusFinded._id,
            date: new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear()
        }]

        const wholesaleRequestUpdated = await WholesaleRequest.findByIdAndUpdate(id, {
            status: statusFinded._id,
            status_history: statusHistory
        });

        const mailOptionsWholesale = {
            from: `'Empetel' <${process.env.MAIL_USERNAME}>`,
            to: wholesaleRequest.wholesale.email,
            subject: `¡Tu pedido está: ${statusFinded.name}!`,
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
                                    ¡El estado de tu pedido se ha actualizado!</h2>
                        </div>
           
                        <p style="text-align: center;font-size: 1.2rem; padding: 20px;">
                            Hola <strong>${wholesaleRequest.name}</strong>, tu pedido ha sido actualizado a <strong>${statusFinded.name}</strong>.
                        </p>

                        <p style="text-align: center;font-size: 1.2rem; padding: 20px;">
                            Con el siguiente código podrás consultar todo sobre tu pedido: <strong>${wholesaleRequestUpdated.id}</strong>
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

        await transporter.sendMail(mailOptionsWholesale);

        if (!wholesaleRequestUpdated) {
            return res.status(404).send({
                message: 'No se encontró la orden',
                status: false
            });
        }

        return res.status(200).send({
            message: 'Orden actualizada exitosamente',
            status: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error al actualizar la orden',
            status: false
        });
    }
}

module.exports = WholesaleRequestController;