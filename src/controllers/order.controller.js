const Order = require('../models/Order.model');
const Status = require('../models/Status.model');
const Faults = require('../models/Faults.model');
require('dotenv').config();
const nodemailer = require('nodemailer');
const ConfirmedOrderNotRecognizedEmail = require('../utils/ConfirmedOrderNotRecognizedEmail');
const ConfirmedOrderNotRecognizedEmailAdmin = require('../utils/ConfirmedOrderNotRecognizedEmailAdmin');
const {recognizedLocalEmails, recognizedLocalEmailAdmin, recognizedOutsideEmails, recognizedOutsideEmailAdmin} = require('../utils/RecognizedEmailsUsers');
const {requirePresupuestEmailUser, requirePresupuestEmailAdmin} = require('../utils/RequirePresupuestEmail');
const orderController = {};

async function randomNumber() {
    var numero = '';

    for (var i = 0; i < 15; i++) {
      numero += Math.floor(Math.random() * 10);
    }

    let orderAlreadyExists = await Order.findOne({id: numero});

    while (orderAlreadyExists) {
        numero = '';

        for (var i = 0; i < 15; i++) {
            numero += Math.floor(Math.random() * 10);
        }

        orderAlreadyExists = await Order.findOne({id: numero});
    }

    return numero;
}

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

orderController.createRecognizedLocalOrder = async (req, res) => {
    try {
        const body = JSON.parse(req.body.form);

        const initialStatus = await Status.findOne({initial: true});

        if(!initialStatus) {
            return res.status(404).send({
                message: 'No se encontró el estado inicial',
                status: false
            });
        }

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

        if(req.files && req.files.fault_photos) {
            const fault_photos = req.files.fault_photos.map(file => `${process.env.BASE_URL}/uploads/${file.filename}`);
            body.fault_photos = fault_photos;
        }

        let faults = []
        let faultsNames = [];

        if(body.faults) {
            const findedFaults = await Faults.find({
                id: {
                    $in: body.faults
                }
            });
            
            faults = findedFaults.map(fault => fault._id.toString());
            faultsNames = findedFaults.map(fault => {
                if (faultsNames.includes(fault.name)) {
                    return;
                }

                return fault.name;
            });
            // Delete duplicates
            faultsNames = faultsNames.filter((fault, index) => faultsNames.indexOf(fault) === index);
        }

        const newOrder = new Order({
            ...body,
            recognized: true,
            id: await randomNumber(),
            faults,
            status: initialStatus._id,
            province: 'Granada',
            municipie: 'Granada',
        });

        await newOrder.save();

        await transporter.sendMail({
            from: `'Empetel' <${process.env.MAIL_USERNAME}>`,
            to: body.email,
            subject: '¡Hemos recibido tu pedido!',
            html: await recognizedLocalEmails({
                ...newOrder._doc,
                faults: faultsNames,
            } )
        });

        await transporter.sendMail({
            from: `'Empetel' <${process.env.MAIL_USERNAME}>`,
            to: process.env.OWNER_EMAIL,
            subject: '¡Has recibido un nuevo pedido en Granada Capital!',
            html: await recognizedLocalEmailAdmin({
                ...newOrder._doc,
                faults: faultsNames,
            })
        });

        return res.status(201).send({
            message: 'Orden creada exitosamente',
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

orderController.createRecognizedOutsideOrder = async (req, res) => {
    try {
        const body = JSON.parse(req.body.form);

        const initialStatus = await Status.findOne({initial: true});

        if(!initialStatus) {
            return res.status(404).send({
                message: 'No se encontró el estado inicial',
                status: false
            });
        }

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

        if(req.files && req.files.fault_photos) {
            const fault_photos = req.files.fault_photos.map(file => `${process.env.BASE_URL}/uploads/${file.filename}`);
            body.fault_photos = fault_photos;
        }

        let faults = []
        let faultsNames = [];

        if(body.faults) {
            const findedFaults = await Faults.find({
                id: {
                    $in: body.faults
                }
            });
            
            faults = findedFaults.map(fault => fault._id.toString());
            faultsNames = findedFaults.map(fault => {
                if (faultsNames.includes(fault.name)) {
                    return;
                }

                return fault.name;
            });
            // Delete duplicates
            faultsNames = faultsNames.filter((fault, index) => faultsNames.indexOf(fault) === index);
        }

        const newOrder = new Order({
            ...body,
            recognized: true,
            id: await randomNumber(),
            faults,
            status: initialStatus._id,
        });

        await newOrder.save();

        await transporter.sendMail({
            from: `'Empetel' <${process.env.MAIL_USERNAME}>`,
            to: body.email,
            subject: '¡Hemos recibido tu pedido!',
            html: await recognizedOutsideEmails({
                ...newOrder._doc,
                faults: faultsNames,
            } )
        });

        await transporter.sendMail({
            from: `'Empetel' <${process.env.MAIL_USERNAME}>`,
            to: process.env.OWNER_EMAIL,
            subject: `¡Has recibido un nuevo pedido en ${newOrder.province} ${newOrder.municipie}!` ,
            html: await recognizedOutsideEmailAdmin({
                ...newOrder._doc,
                faults: faultsNames,
            })
        });

        return res.status(201).send({
            message: 'Orden creada exitosamente',
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

orderController.createDontListenedItemOrder = async (req, res) => {
    try {
        const body = JSON.parse(req.body.form);

        const initialStatus = await Status.findOne({initial: true});

        if(!initialStatus) {
            return res.status(404).send({
                message: 'No se encontró el estado inicial',
                status: false
            });
        }

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

        if(req.files && req.files.fault_photos) {
            const fault_photos = req.files.fault_photos.map(file => `${process.env.BASE_URL}/uploads/${file.filename}`);
            body.fault_photos = fault_photos;
        }

        let faults = []
        let faultsNames = [];

        if(body.faults) {
            const findedFaults = await Faults.find({
                id: {
                    $in: body.faults
                }
            });
            
            faults = findedFaults.map(fault => fault._id.toString());
            faultsNames = findedFaults.map(fault => {
                if (faultsNames.includes(fault.name)) {
                    return;
                }

                return fault.name;
            });
            // Delete duplicates
            faultsNames = faultsNames.filter((fault, index) => faultsNames.indexOf(fault) === index);
        }

        const newOrder = new Order({
            ...body,
            recognized: false,
            id: await randomNumber(),
            faults,
            status: initialStatus._id,
        });

        await newOrder.save();

        await transporter.sendMail({
            from: `'Empetel' <${process.env.MAIL_USERNAME}>`,
            to: body.email,
            subject: '¡Hemos recibido tu pedido!',
            html: await requirePresupuestEmailUser({
                ...newOrder._doc,
                faults: faultsNames,
            } )
        });

        await transporter.sendMail({
            from: `'Empetel' <${process.env.MAIL_USERNAME}>`,
            to: process.env.OWNER_EMAIL,
            subject: `¡Has recibido un nuevo pedido de presupuesto!` ,
            html: await requirePresupuestEmailAdmin({
                ...newOrder._doc,
                faults: faultsNames,
            })
        });

        return res.status(201).send({
            message: 'Orden creada exitosamente',
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

module.exports = orderController;