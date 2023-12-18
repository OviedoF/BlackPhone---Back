const Faults = require('../models/Faults.model');
const PricesTableInfo = require('../models/PricesTableInfo.model');
const Prices = require('../models/Prices.model');
require('dotenv').config();

const faultsController = {};

faultsController.getFaults = async (req, res) => {
    try {
        const faults = await Faults.find();
        res.status(200).send({
            status: true,
            faults
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: false,
            message: error.message
        })
    }
}

faultsController.createFault = async (req, res) => {
    try {
        const areas = JSON.parse(req.body.areas);
        delete req.body._id;

        if (req.files && req.files.images) {
            const icon = req.files.images[0].filename;

            req.body.icon = `${process.env.BASE_URL}/uploads/${icon}`;
        }
        req.body.id = "_id" + req.body.name.replace(/\s/g, "");

        const tableInfo = await PricesTableInfo.findOne();

        for (let i = 0; i < areas.length; i++) {
            const area = areas[i];

            const fault = new Faults({
                ...req.body,
                area: area.label,
                idArea: area.value,
            });

            console.log(fault._id);

            tableInfo.faults.push(fault._id);
            await fault.save();
        }

        await tableInfo.save();

        res.status(200).send({
            status: true,
            message: 'Se ha creado la avería correctamente'
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: false,
            message: error.message
        })
    }
}

faultsController.updateFault = async (req, res) => {
    try {
        const areas = JSON.parse(req.body.areas);
        delete req.body._id;

        if (req.files && req.files.images) {
            const icon = req.files.images[0].filename;

            req.body.icon = `${process.env.BASE_URL}/uploads/${icon}`;
        }
        req.body.id = "_id" + req.body.name.replace(/\s/g, "");

        const tableInfo = await PricesTableInfo.findOne();

        for (let i = 0; i < areas.length; i++) {
            const area = areas[i];

            const fault = await Faults.findOne({
                _id: req.body.id,
                idArea: area.value,
                area: area.label
            })

            console.log({
                id: req.body.id,
                idArea: area.value,
                area: area.label
            });

            if (fault) {
                await Faults.findByIdAndUpdate(fault._id, req.body);
            } else {
                const newFault = new Faults({
                    ...req.body,
                    area: area.label,
                    idArea: area.value,
                });

                tableInfo.faults.push(newFault._id);
                await newFault.save();
            }
        }

        await tableInfo.save();

        res.status(200).send({
            status: true,
            message: 'Se ha actualizado la avería correctamente'
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: false,
            message: error.message
        })
    }
}

faultsController.deleteFault = async (req, res) => {
    try {
        console.log(req.body);
        const areas = JSON.parse(req.body.areas);
        const tableInfo = await PricesTableInfo.findOne();

        for (let i = 0; i < areas.length; i++) {
            const area = areas[i];

            console.log(area);

            const fault = await Faults.findOne({
                id: req.body.id,
                idArea: area.value,
                area: area.label
            })

            console.log({
                _id: req.body.id,
                idArea: area.value,
                area: area.label
            });

            if (fault) {
                await Faults.findByIdAndDelete(fault._id);
                tableInfo.faults = tableInfo.faults.filter(f => f.toString() !== fault._id.toString());
            }
        }

        await tableInfo.save();

        res.status(200).send({
            status: true,
            message: 'Se ha eliminado la avería correctamente'
        })
    } catch (error) {
        console.log(error);

        res.status(500).send({
            status: false,
            message: error.message
        })
    }
}

module.exports = faultsController;