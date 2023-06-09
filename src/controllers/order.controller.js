const Order = require('../models/Order.model');
require('dotenv').config();
const nodemailer = require('nodemailer');
const ConfirmedOrderNotRecognizedEmail = require('../utils/ConfirmedOrderNotRecognizedEmail');
const ConfirmedOrderNotRecognizedEmailAdmin = require('../utils/ConfirmedOrderNotRecognizedEmailAdmin');

const orderController = {};

orderController.createOrders = async (req, res) => {
    try {
        const {recognized} = req.body;

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

        if (!recognized) {
            if(req.files && req.files.phone_photos) {
                const phone_photos = req.files.phone_photos.map(file => `${process.env.BASE_URL}/uploads/${file.filename}`);

                if(req.files && req.files.fault_photos) {
                    const fault_photos = req.files.fault_photos.map(file => `${process.env.BASE_URL}/uploads/${file.filename}`);
                    req.body.fault_photos = fault_photos;
                }

                req.body.phone_photos = phone_photos;
            }

            await transporter.sendMail({
                from: `'Empetel' <${process.env.MAIL_USERNAME}>`,
                to: req.body.email,
                subject: '¡Hemos recibido tu pedido!',
                html: await ConfirmedOrderNotRecognizedEmail({
                    data: [{
                        label: 'Nombre',
                        value: req.body.name
                    }, {
                        label: 'Teléfono',
                        value: req.body.phone
                    }, {
                        label: 'Correo electrónico',
                        value: req.body.email
                    }, {
                        label: 'Mensaje',
                        value: req.body.message
                    }],
                    name: req.body.name
                })
            });

            await transporter.sendMail({
                from: `'Empetel' <${process.env.MAIL_USERNAME}>`,
                to: process.env.OWNER_EMAIL,
                subject: '¡Has recibido un nuevo pedido!',
                html: await ConfirmedOrderNotRecognizedEmailAdmin({
                    data: [{
                        label: 'Nombre',
                        value: req.body.name
                    }, {
                        label: 'Teléfono',
                        value: req.body.phone
                    }, {
                        label: 'Correo electrónico',
                        value: req.body.email
                    }, {
                        label: 'Mensaje',
                        value: req.body.message
                    }]
                })
            });

            const newOrder = new Order({
                recognized: false,
                ...req.body
            });
            await newOrder.save();

            return res.status(201).send({
                message: 'Orden creada exitosamente',
                newOrder,
                status: true
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error al crear la orden',
            status: false
        });
    }
}

module.exports = orderController;