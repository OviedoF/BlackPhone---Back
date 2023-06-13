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
        const areas = JSON.parse(req.body.areas);
        const areasValues = ['local', 'outside', 'wholesale']

        const oldFault = await Faults.findById(req.body._id);
        const PricesTableInfoData = await PricesTableInfo.findOne();
        delete req.body._id;

        if (req.files && req.files.images) {
            const icon = req.files.images[0].filename;

            req.body.icon = `${process.env.BASE_URL}/uploads/${icon}`;
        }

        for (let i = 0; i < areasValues.length; i++) {
            let isValue = false;

            for (let j = 0; j < areas.length; j++) {
                if (areas[j].value === areasValues[i]) {
                    isValue = true;
                }
            }

            if (!isValue) {
                const fault = await Faults.findOne({
                    id: req.body.id,
                    idArea: areasValues[i]
                });

                if (fault) {
                    await Faults.findByIdAndDelete(fault._id);
                }
            }
        }

        for (let i = 0; i < areas.length; i++) {
            const area = areas[i];

            const fault = await Faults.findOne({
                id: req.body.id,
                idArea: area.value,
                area: area.label
            })

            if (!fault) {
                const newFault = new Faults({
                    ...req.body,
                    area: area.label,
                    idArea: area.value,
                    id: "_id" + req.body.name.replace(/\s/g, ""),
                });

                PricesTableInfoData.faults.push(newFault._id);
                await newFault.save();
            }

            if (fault) {
                const newFault = await Faults.findByIdAndUpdate(fault._id, {
                    ...req.body,
                    id: "_id" + req.body.name.replace(/\s/g, ""),
                }, {
                    new: true
                });
            }
        }

        await PricesTableInfoData.save();

        const prices = await Prices.find({});

        for (let i = 0; i < prices.length; i++) {
            const price = prices[i];
            const pricesObject = price.prices;

            for (let j = 0; j < areasValues.length; j++) {
                console.log("_id" + req.body.name.replace(/\s/g, "") + areasValues[j])
                // console.log(])
                if(`_id${req.body.name.replace(/\s/g, "")}${areasValues[j]}` !== `${oldFault.id}${areasValues[j]}`) {
                    pricesObject[`_id${req.body.name.replace(/\s/g, "")}${areasValues[j]}`] = pricesObject[oldFault.id + areasValues[j]];
                    delete pricesObject[oldFault.id + areasValues[j]];
                }
            }

            console.log(pricesObject);
            price.prices = pricesObject;

            const newPrice = await Prices.findByIdAndUpdate(price._id, {
                prices: pricesObject
            }, {
                new: true
            });
        }

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

            const fault = await Faults.findOne({
                id: req.body.id,
                idArea: area.value,
                area: area.label
            })

            await Faults.findByIdAndDelete(fault._id);
            tableInfo.faults = tableInfo.faults.filter(f => f.toString() !== fault._id.toString());
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