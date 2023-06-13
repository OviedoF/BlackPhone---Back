const Faults = require('../models/Faults.model');
const PricesTableInfo = require('../models/PricesTableInfo.model');
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
        console.log(areas);

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
        if (req.files && req.files.images) {
            const icon = req.files.images[0].filename;

            req.body.icon = `${process.env.BASE_URL}/uploads/${icon}`;
        }

        await Faults.findByIdAndUpdate(req.params.id, req.body);

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
        const fault = await Faults.findByIdAndDelete(req.params.id);

        const tableInfo = await PricesTableInfo.findOne();

        tableInfo.faults = tableInfo.faults.filter(f => f.toString() !== fault._id.toString());

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