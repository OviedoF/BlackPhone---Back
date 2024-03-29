const PricesTableInfo = require('../models/PricesTableInfo.model');
const Prices = require('../models/Prices.model');
const Faults = require('../models/Faults.model');
const pricesTableController = {};
const pdfsMaker = require('../utils/PricesPdfMaker');
const path = require('path');

const orderPricesIfOnePositionNotExists = async (prices) => {
    for (let i = 0; i < prices.length; i++) {
        const price = prices[i];

        if (price.position !== i + 1) {
            await Prices.findByIdAndUpdate(price._id, {
                position: i + 1
            });

            price.position = i + 1;
        }
    }
}

pricesTableController.getPricesTableInfo = async (req, res) => {
    try {
        const pricesTableInfo = await PricesTableInfo.findOne().populate('faults');
        res.status(200).send({
            data: pricesTableInfo,
            message: 'Obtenidos correctamente!',
            status: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            data: null,
            message: 'Error al obtener los datos!',
            status: false
        });
    }
}

pricesTableController.getPrices = async (req, res) => {
    try {
        const { page, limit, brand, model } = req.query;

        let prices

        prices = await Prices.find({
            position: { $ne: null },
            brand: brand ? brand : { $ne: null },
            model: model ? model : { $ne: null }
        }).populate('brand').sort({
            position: 1,
        }); // * 1 para ordenar de menor a mayor

        console.log(page, limit);

        if (page && limit !== 'undefined' && limit) {
            const startIndex = (parseInt(page) - 1) * parseInt(limit);
            const endIndex = parseInt(page) * parseInt(limit);

            results = prices.slice(startIndex, endIndex);

            return res.status(200).send({
                data: results,
                message: 'Obtenidos correctamente!',
                status: true
            });
        }

        res.status(200).send({
            data: prices,
            message: 'Obtenidos correctamente!',
            status: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            data: null,
            message: 'Error al obtener los datos!',
            status: false
        });
    }
}

pricesTableController.createPrice = async (req, res) => {
    try {
        const data = JSON.parse(req.body.data);

        if (req.files && req.files.images) {
            data.image = `${process.env.BASE_URL}/uploads/${req.files.images[0].filename}`;
        }

        const price = new Prices({
            ...data,
            prices: {
                ...data.prices,
                modifiedAt: new Date().toLocaleDateString(),
            },
            position: await Prices.countDocuments() + 1 // * Contar los precios y sumarle 1
        });

        await price.save();

        res.status(200).send({
            data: price,
            message: 'Creado correctamente!',
            status: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            data: null,
            message: 'Error al crear el precio!',
            status: false
        });
    }
}

pricesTableController.editPrice = async (req, res) => {
    try {
        const { id } = req.params;
        const data = JSON.parse(req.body.data);

        if (req.files && req.files.images) {
            data.image = `${process.env.BASE_URL}/uploads/${req.files.images[0].filename}`;
        }

        await Prices.findByIdAndUpdate(id, data);

        res.status(200).send({
            data: null,
            message: 'Actualizado correctamente!',
            status: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            data: null,
            message: 'Error al actualizar el precio!',
            status: false
        });
    }
}

pricesTableController.updatePrices = async (req, res) => {
    try {
        const data = JSON.parse(req.body.data);

        // actualizar todos uno por uno
        for (let i = 0; i < data.length; i++) {
            const price = data[i];

            await Prices.findByIdAndUpdate(price._id, price);
        }

        res.status(200).send({
            data: null,
            message: 'Precios actualizados correctamente!',
            status: true
        });
    } catch (error) {
        return res.status(500).send({
            data: null,
            message: 'Error al actualizar los precios!',
            status: false
        });
    }
}

pricesTableController.deletePrice = async (req, res) => {
    try {
        const { id } = req.params;

        await Prices.findByIdAndDelete(id)

        const priceUpdated = await Prices.find().sort({
            position: 1,
        });
        await orderPricesIfOnePositionNotExists(priceUpdated);

        res.status(200).send({
            data: null,
            message: 'Eliminado correctamente!',
            status: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            data: null,
            message: 'Error al eliminar el precio!',
            status: false
        });
    }
}

pricesTableController.getMainFormData = async (req, res) => {
    try {
        const pricesTableInfo = await PricesTableInfo.findOne();
        const prices = await Prices.find().sort({ createdAt: -1 });

        const brands = prices.map(price => price.brand);
        const brandsFiltered = brands.filter((brand, index) => brands.indexOf(brand) === index);

        const faults = pricesTableController.headers.map(fault => {
            if (fault.publicName) {
                return {
                    label: fault.publicName,
                    value: `${fault.id}${fault.idArea}`
                }
            } else {
                return null
            }
        }).filter(fault => fault !== null)

        console.log(faults);

        res.status(200).send({
            data: {
                pricesTableInfo,
                prices,
                brands: brandsFiltered,
                faults
            },
            message: 'Obtenidos correctamente!',
            status: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            data: null,
            message: 'Error al obtener los datos!',
            status: false
        });
    }
}

pricesTableController.calculateBudget = async (req, res) => {
    try {
        const form = req.body.form;
        const prices = await Prices.find().sort({ createdAt: -1 });
        let area = form.isLocal ? 'local' : 'outside';
        let price = 0;
        const faultsWithPrice = [];

        const priceItem = prices.find(price => price.brand.toString() == form.brand.value && price.model == form.model.value);

        if (!priceItem) return res.status(200).send({
            data: null,
            message: 'Envío incorrecto!',
            status: false,
            code: 401
        });

        form.faults.forEach(fault => {
            price += parseInt(priceItem.prices[`${fault}${area}`]);
        });

        for (let fault of form.faults) {
            let costOfFault = parseInt(priceItem.prices[`${fault}${area}`]);
            const { publicName } = await Faults.findOne({
                id: fault
            })

            faultsWithPrice.push({
                fault: publicName,
                cost: costOfFault
            });
        }

        return res.status(200).send({
            total: price,
            faultsWithPrice,
            message: 'Obtenidos correctamente!',
            status: true,
            code: 200,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            data: null,
            message: 'Error al obtener un presupuesto, por favor intentelo de nuevo!',
            status: false,
            code: 500
        });
    }
}

pricesTableController.downloadPricesPDF = async (req, res) => {
    try {
        const { brand, faults: faultsToPrint } = req.query;

        const faultsToPrintIds = faultsToPrint ? faultsToPrint.split(',') : null;

        if (faultsToPrintIds) faultsToPrintIds.pop();

        console.log(faultsToPrintIds);

        const prices = await Prices.find({
            brand: brand ? brand : { $ne: null }
        })
            .populate('brand')
            .sort({ position: 1 });

        let faults = await Faults.find();

        if (faultsToPrintIds) {
            faults = faults.filter(fault => faultsToPrintIds.includes(`${fault.id}`));
        }

        await pdfsMaker.createPricesPdf({
            prices,
            faults
        });

        res.status(200).json({
            status: true,
            prices,
            link: `${process.env.BASE_URL}/prices/download-pdf`
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            data: null,
            message: 'Error al crear el PDF!',
            status: false
        });
    }
}

pricesTableController.downloadPDF = async (req, res) => {
    try {
        const filePath = path.join(__dirname, '..', 'public', 'api', 'documents', `precios.pdf`);

        res.status(200).download(filePath);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            data: null,
            message: 'Error al descargar el PDF!',
            status: false
        });
    }
}

pricesTableController.getAllModelsOfBrand = async (req, res) => {
    try {
        const { brand } = req.params;

        const prices = await Prices.find({
            brand: brand ? brand : { $ne: null }
        })
            .populate('brand')
            .sort({ position: 1 });

        const models = prices.map(price => price.model);
        console.log(models);

        res.status(200).send({
            data: models,
            message: 'Obtenidos correctamente!',
            status: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            data: null,
            message: 'Error al obtener los datos!',
            status: false
        });
    }
}

pricesTableController.setPositionsByCreatedAt = async (req, res) => {
    try {
        const prices = await Prices.find().populate('brand').sort({
            createdAt: 1,
        }); // * 1 para ordenar de menor a mayor

        for (let i = 0; i < prices.length; i++) {
            const price = prices[i];

            await Prices.findByIdAndUpdate(price._id, {
                position: i + 1
            })
        }

        res.status(200).send({
            data: null,
            message: 'Posiciones actualizadas correctamente!',
            status: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            data: null,
            message: 'Error al actualizar las posiciones!',
            status: false
        });
    }
}

pricesTableController.changePosition = async (req, res) => {
    try {
        const { index } = req.body;
        const { id } = req.params;

        const price = await Prices.findById(id);
        const prices = await Prices.find().sort({
            position: 1,
        });

        if (index > prices.length) {
            return res.status(400).send({
                message: 'Índice no válido',
                status: false
            })
        }

        for (let i = 0; i < prices.length; i++) {
            const precio = prices[i];

            if (price.position > index && precio.position <= price.position && precio.position >= index) {
                if (precio.position === price.position) {
                    precio.position = index
                } else if (precio.position >= index) {
                    precio.position++
                }
            } else {
                if (precio.position === price.position) {
                    precio.position = index
                } else if (precio.position === index) {
                    precio.position = price.position
                }
            }

            await Prices.findByIdAndUpdate(precio._id, {
                position: precio.position
            });
        }

        const priceUpdated = await Prices.find().sort({
            position: 1,
        });
        await orderPricesIfOnePositionNotExists(priceUpdated);

        res.status(200).send({
            message: 'Índice cambiado correctamente',
            status: true
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Error while changing index',
            status: false
        })
    }
}

module.exports = pricesTableController;