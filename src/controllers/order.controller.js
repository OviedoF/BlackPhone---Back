const Order = require('../models/Order.model');
const Status = require('../models/Status.model');
const Faults = require('../models/Faults.model');
require('dotenv').config();
const nodemailer = require('nodemailer');
const ConfirmedOrderNotRecognizedEmail = require('../utils/ConfirmedOrderNotRecognizedEmail');
const ConfirmedOrderNotRecognizedEmailAdmin = require('../utils/ConfirmedOrderNotRecognizedEmailAdmin');
const { recognizedLocalEmails, recognizedLocalEmailAdmin, recognizedOutsideEmails, recognizedOutsideEmailAdmin } = require('../utils/RecognizedEmailsUsers');
const { requirePresupuestEmailUser, requirePresupuestEmailAdmin } = require('../utils/RequirePresupuestEmail');
const ChangeStatusEmail = require('../utils/ChangeStatusEmail');
const orderController = {};

async function randomNumber() {
    var numero = '';

    for (var i = 0; i < 5; i++) {
        numero += Math.floor(Math.random() * 10);
    }

    let orderAlreadyExists = await Order.findOne({ id: numero });

    while (orderAlreadyExists) {
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
        const order = await Order.findOne({ id: req.params.id }).populate('status').populate('faults').populate({
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
        const orders = await Order.find({ recognized: false }).populate('status').populate('faults').populate({
            path: 'status_history',
            populate: {
                path: 'status',
                model: 'Status'
            }
        }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);

        const totalOrders = await Order.countDocuments({ recognized: false });

        return res.status(200).send({
            orders,
            totalOrders,
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
        const orders = await Order.find({ recognized: true }).populate('status').populate('faults').populate({
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

orderController.createOrderDontRecognizedNothing = async (req, res) => {
    try {
        const form = JSON.parse(req.body.form);

        const initialStatus = await Status.findOne({ initial: true });

        if (!initialStatus) {
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

        if (req.files && req.files.phone_photos) {
            const phone_photos = req.files.phone_photos.map(file => `${process.env.BASE_URL}/uploads/${file.filename}`);

            if (req.files && req.files.fault_photos) {
                const fault_photos = req.files.fault_photos.map(file => `${process.env.BASE_URL}/uploads/${file.filename}`);
                form.fault_photos = fault_photos;
            }

            form.phone_photos = phone_photos;
        }

        await transporter.sendMail({
            from: `'Empetel' <${process.env.MAIL_USERNAME}>`,
            to: form.email,
            subject: '¡Hemos recibido tu pedido!',
            html: await ConfirmedOrderNotRecognizedEmail({
                data: [{
                    label: 'Nombre',
                    value: form.name
                }, {
                    label: 'Teléfono',
                    value: form.phone
                }, {
                    label: 'Correo electrónico',
                    value: form.email
                }, {
                    label: 'Mensaje',
                    value: form.message
                }],
                name: form.name
            })
        });

        await transporter.sendMail({
            from: `'Empetel' <${process.env.MAIL_USERNAME}>`,
            to: process.env.OWNER_EMAIL,
            subject: '¡Has recibido un nuevo pedido!',
            html: await ConfirmedOrderNotRecognizedEmailAdmin({
                data: [{
                    label: 'Nombre',
                    value: form.name
                }, {
                    label: 'Teléfono',
                    value: form.phone
                }, {
                    label: 'Correo electrónico',
                    value: form.email
                }, {
                    label: 'Mensaje',
                    value: form.fault_details
                }],
                name: form.name
            })
        });

        const newOrder = new Order({
            ...form,
            id: await randomNumber(),
            status: initialStatus._id,
            status_history: [{
                status: initialStatus._id,
                date: new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear()
            }]
        });
        await newOrder.save();

        return res.status(201).send({
            message: 'Orden creada exitosamente',
            newOrder,
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

orderController.createRecognizedLocalOrder = async (req, res) => {
    try {
        const body = JSON.parse(req.body.form);

        const initialStatus = await Status.findOne({ initial: true });

        if (!initialStatus) {
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

        if (req.files && req.files.fault_photos) {
            const fault_photos = req.files.fault_photos.map(file => `${process.env.BASE_URL}/uploads/${file.filename}`);
            body.fault_photos = fault_photos;
        }

        let faults = []
        let faultsNames = [];

        if (body.faults) {
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
            status_history: [{
                status: initialStatus._id,
                date: new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear()
            }]
        });

        await newOrder.save();

        await transporter.sendMail({
            from: `'Empetel' <${process.env.MAIL_USERNAME}>`,
            to: body.email,
            subject: '¡Hemos recibido tu pedido!',
            html: await recognizedLocalEmails({
                ...newOrder._doc,
                faults: faultsNames,
            })
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

        const initialStatus = await Status.findOne({ initial: true });

        if (!initialStatus) {
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

        if (req.files && req.files.fault_photos) {
            const fault_photos = req.files.fault_photos.map(file => `${process.env.BASE_URL}/uploads/${file.filename}`);
            body.fault_photos = fault_photos;
        }

        let faults = []
        let faultsNames = [];

        if (body.faults) {
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
            status_history: [{
                status: initialStatus._id,
                date: new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear()
            }]
        });

        await newOrder.save();

        await transporter.sendMail({
            from: `'Empetel' <${process.env.MAIL_USERNAME}>`,
            to: body.email,
            subject: '¡Hemos recibido tu pedido!',
            html: await recognizedOutsideEmails({
                ...newOrder._doc,
                faults: faultsNames,
            })
        });

        await transporter.sendMail({
            from: `'Empetel' <${process.env.MAIL_USERNAME}>`,
            to: process.env.OWNER_EMAIL,
            subject: `¡Has recibido un nuevo pedido en ${newOrder.province} ${newOrder.municipie}!`,
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

        const initialStatus = await Status.findOne({ initial: true });

        if (!initialStatus) {
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

        if (req.files && req.files.fault_photos) {
            const fault_photos = req.files.fault_photos.map(file => `${process.env.BASE_URL}/uploads/${file.filename}`);
            body.fault_photos = fault_photos;
        }

        let faults = []
        let faultsNames = [];

        if (body.faults) {
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
            status_history: [{
                status: initialStatus._id,
                date: new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear()
            }]
        });

        await newOrder.save();

        await transporter.sendMail({
            from: `'Empetel' <${process.env.MAIL_USERNAME}>`,
            to: body.email,
            subject: '¡Hemos recibido tu pedido!',
            html: await requirePresupuestEmailUser({
                ...newOrder._doc,
                faults: faultsNames,
            })
        });

        await transporter.sendMail({
            from: `'Empetel' <${process.env.MAIL_USERNAME}>`,
            to: process.env.OWNER_EMAIL,
            subject: `¡Has recibido un nuevo pedido de presupuesto!`,
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

orderController.editOrderStatus = async (req, res) => {
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

        const order = await Order.findById(id);

        const statusHistory = [...order.status_history, {
            status: statusFinded._id,
            date: new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear()
        }]

        const orderUpdated = await Order.findByIdAndUpdate(id, {
            status: statusFinded._id,
            status_history: statusHistory
        });

        await transporter.sendMail({
            from: `'Empetel' <${process.env.MAIL_USERNAME}>`,
            to: orderUpdated.email,
            subject: `¡Tu pedido está: ${statusFinded.name}!`,
            html: await ChangeStatusEmail({
                ...orderUpdated._doc,
            }, statusFinded)
        });

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