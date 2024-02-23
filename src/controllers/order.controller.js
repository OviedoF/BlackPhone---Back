const Order = require('../models/Order.model');
const Status = require('../models/Status.model');
const Faults = require('../models/Faults.model');
require('dotenv').config();
const nodemailer = require('nodemailer');
const ConfirmedOrderNotRecognizedEmail = require('../utils/ConfirmedOrderNotRecognizedEmail');
const ConfirmedOrderNotRecognizedEmailAdmin = require('../utils/ConfirmedOrderNotRecognizedEmailAdmin');
const { recognizedLocalEmails, recognizedLocalEmailAdmin } = require('../utils/RecognizedEmailsUsers');
const ChangeStatusEmail = require('../utils/ChangeStatusEmail');
const orderController = {};
const WholesaleRequest = require('../models/WholesaleRequest.model');
const {client: wppClient, client} = require('../config/wpp');

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

orderController.getOrderById = async (req, res) => {
    try {
        console.log(req.params)
        const order = await Order.findOne({ id: req.params.id }).populate('status').populate('faults').populate('brand').populate({
            path: 'status_history',
            populate: {
                path: 'status',
                model: 'Status'
            }
        })

        if (!order) {
            return res.status(200).send({
                message: 'No se encontró la orden',
                status: false
            });

        }

        return res.status(200).send({
            order,
            status: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error al obtener la orden',
            status: false
        });
    }
}

orderController.getUnrecognizedOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const orders = await Order.find({ recognized: false }).populate('status').populate('faults').populate("brand").populate({
            path: 'status_history',
            populate: {
                path: 'status',
                model: 'Status'
            }
        }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);

        return res.status(200).send({
            orders,
            status: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error al obtener las ordenes',
            status: false
        });
    }
}

orderController.getRecognizedOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const orders = await Order.find({ recognized: true }).populate('status').populate('faults').populate("brand").populate({
            path: 'status_history',
            populate: {
                path: 'status',
                model: 'Status'
            }
        }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);

        return res.status(200).send({
            orders,
            status: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error al obtener las ordenes',
            status: false
        });
    }
}

orderController.createOrder = async (req, res) => {
    try {
        if (req.files && req.files.fault_photos) {
            const fault_photos = req.files.fault_photos.map(file => `${process.env.BASE_URL}/uploads/${file.filename}`);
            req.body.fault_photos = fault_photos;
        }

        const initialStatus = await Status.findOne({ initial: true });

        if (!initialStatus) {
            return res.status(404).send({
                message: 'No se encontró el estado inicial',
                status: false
            });
        }

        const newOrder = new Order({
            ...req.body,
            id: await randomNumber(),
            status: initialStatus._id,
            status_history: [{
                status: initialStatus._id,
                date: new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear()
            }]
        });

        const createdOrder = await newOrder.save();

        const newOrderActualized = await Order.findById(createdOrder._id).populate('status').populate('faults').populate('brand').populate({
            path: 'status_history',
            populate: {
                path: 'status',
                model: 'Status'
            }
        }).populate('additionalCosts');

        const transporter = await nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false,
            tls: {
                ciphers: 'SSLv3'
            },
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        if (!newOrder.recognized) {
            transporter.sendMail({
                from: `'Blackphone' <${process.env.MAIL_USERNAME}>`,
                to: newOrder.contact,
                subject: '¡Hemos recibido tu pedido!',
                html: await ConfirmedOrderNotRecognizedEmail({
                    data: [{
                        label: 'Nombre',
                        value: newOrder.name
                    }, {
                        label: 'Correo electrónico',
                        value: newOrder.contact
                    }],
                    name: newOrder.name
                })
            });

            transporter.sendMail({
                from: `'Blackphone' <${process.env.MAIL_USERNAME}>`,
                to: process.env.OWNER_EMAIL,
                subject: '¡Has recibido un nuevo pedido!',
                html: await ConfirmedOrderNotRecognizedEmailAdmin({
                    data: [{
                        label: 'Nombre',
                        value: newOrder.name
                    }, {
                        label: 'Correo electrónico',
                        value: newOrder.contact
                    }],
                    name: newOrder.name,
                    id: newOrder.id
                })
            });
        }

        if (newOrder.recognized) {
            transporter.sendMail({
                from: `'Blackphone' <${process.env.MAIL_USERNAME}>`,
                to: newOrderActualized.contact,
                subject: '¡Hemos recibido tu pedido!',
                html: await recognizedLocalEmails({
                    ...newOrderActualized,
                    faults: newOrderActualized.faults.length ? newOrderActualized.faults.map(fault => fault.name) : ['Ninguna'],
                    brand: newOrderActualized.brand ? newOrderActualized.brand.name : newOrderActualized.customBrand,
                    additionalCosts: newOrderActualized.additionalCosts.length ? newOrderActualized.additionalCosts.map(additionalCost => additionalCost.name) : [],
                })
            });

            transporter.sendMail({
                from: `'Blackphone' <${process.env.MAIL_USERNAME}>`,
                to: process.env.OWNER_EMAIL,
                subject: '¡Has recibido un nuevo pedido!',
                html: await recognizedLocalEmailAdmin({
                    ...newOrderActualized,
                    faults: newOrderActualized.faults.length ? newOrderActualized.faults.map(fault => fault.name) : ['Ninguna'],
                    brand: newOrderActualized.brand ? newOrderActualized.brand.name : newOrderActualized.customBrand,
                    additionalCosts: newOrderActualized.additionalCosts.length ? newOrderActualized.additionalCosts.map(additionalCost => additionalCost.name) : []
                })
            });
        }

        console.log(`${newOrder.phone}@c.us`)

        if (newOrder.phone) {
            if (newOrder.recognized) {
                wppClient.sendMessage(`${newOrder.phone}@c.us`, `¡Hola! Gracias por confiar en nosotros para revisar tu dispositivo. 
¡En Blackphone nos encargaremos de que tu terminal quede como nuevo! Tu código de pedido es: ${newOrder.id}.
                
Puedes seguir el estado de tu pedido en el siguiente enlace: https://blackphoneservice.com/seguimiento`)
                    .then(() => {
                        console.log('Mensaje enviado');
                    })
                    .catch(error => {
                        console.log('Error al enviar mensaje', error);
                    });
            } else {
                wppClient.sendMessage(`${newOrder.phone}@c.us`, `Mucho gusto, ${newOrder.name}, tu pedido ha sido recibido y estaremos en contacto contigo. 
¡Muchas gracias por confiar en Blackphone! Como nuestra aplicación no pudo proporcionarte un precio, nos encargaremos de comunicarnos contigo y brindarte un presupuesto acorde a los datos que nos has enviado.`)
                    .then(() => {
                        console.log('Mensaje enviado');
                    })
                    .catch(error => {
                        console.log('Error al enviar mensaje', error);
                    });
            }
        }

        return res.status(201).send({
            message: 'Orden creada exitosamente',
            orderId: newOrder.id,
            status: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error al crear la orden',
            status: false
        });
    }
}

orderController.editOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const transporter = await nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false,
            tls: {
                ciphers: 'SSLv3'
            },
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const statusFinded = await Status.findById(status);

        const order = await Order.findById(id).populate('status').populate('faults').populate('brand')

        const statusHistory = [...order.status_history, {
            status: statusFinded._id,
            date: new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear()
        }]

        const orderUpdated = await Order.findByIdAndUpdate(id, {
            status: statusFinded._id,
            status_history: statusHistory
        });

        if (statusFinded.send) {
            await transporter.sendMail({
                from: `'Blackphone' <${process.env.MAIL_USERNAME}>`,
                to: orderUpdated.contact,
                subject: `¡Tu pedido está: ${statusFinded.name}!`,
                html: await ChangeStatusEmail({
                    ...orderUpdated._doc,
                }, statusFinded)
            });

            if (orderUpdated.phone) {
                wppClient.sendMessage(`${
                    orderUpdated.phone
                }@c.us`, `¡Hola! Tu pedido ha cambiado de estado a: ${
                    statusFinded.name
                }. Puedes seguir el estado de tu pedido en el siguiente enlace: https://blackphoneservice.com/seguimiento`)
                    .then(() => {
                        console.log('Mensaje enviado');
                    })
                    .catch(error => {
                        console.log('Error al enviar mensaje', error);
                    });
            }
        }

        if (!orderUpdated) {
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

orderController.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const orderDeleted = await Order.findByIdAndDelete(id);

        if (!orderDeleted) {
            return res.status(404).send({
                message: 'No se encontró la orden',
                status: false
            });
        }

        return res.status(200).send({
            message: 'Orden eliminada exitosamente',
            status: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Error al eliminar la orden',
            status: false
        });
    }
}

module.exports = orderController;