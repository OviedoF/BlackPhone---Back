const PricesTableInfo = require('../models/PricesTableInfo.model');
const Prices = require('../models/Prices.model');
const Faults = require('../models/Faults.model');
const pricesTableController = {};
const pdfsMaker = require('../utils/PricesPdfMaker');
const path = require('path');

function compareModels(modelA, modelB) {
    const regex = /([a-zA-Z]+)(\d+)?/; // Expresión regular para capturar letras y números
    const matchA = modelA.match(regex);
    const matchB = modelB.match(regex);

    const nameComparison = matchA[1].localeCompare(matchB[1]);

    if (nameComparison !== 0) {
        return nameComparison;
    }

    // Si hay números en los modelos, compáralos como números
    if (matchA[2] && matchB[2]) {
        const numberA = parseInt(matchA[2]);
        const numberB = parseInt(matchB[2]);
        return numberA - numberB;
    }

    // Si solo uno de los modelos tiene número, el que tiene número va después
    if (matchA[2]) {
        return 1;
    } else if (matchB[2]) {
        return -1;
    }

    // Ambos modelos tienen el mismo nombre y no contienen números
    return 0;
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

        if (!page || !limit) {
            prices = await Prices.find({
                brand: brand ? brand : { $ne: null },
                model: model ? model : { $ne: null }
            }).populate('brand')
        } else {
            prices = await Prices.find({
                brand: brand ? brand : { $ne: null },
                model: model ? model : { $ne: null }
            }).populate('brand')
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .sort({
                    brand: 1,
                });
        }

        prices.sort((a, b) => {
            const brandComparison = a.brand.name.toLowerCase().localeCompare(b.brand.name.toLowerCase());

            if (brandComparison !== 0) {
                return brandComparison;
            }

            return compareModels(a.model, b.model);
        });

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
        const price = new Prices({
            ...data,
            prices: {
                modifiedAt: new Date().toLocaleDateString(),
            }
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

        await Prices.findByIdAndDelete(id);

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
        const { idArea, brand } = req.query;

        const prices = await Prices.find({
            brand: brand ? brand : { $ne: null }
        })
            .populate('brand')
            .sort({ brand: 1 });

        const faults = await Faults.find();

        // order prices by brand and model alphabetically ignoring uppercase

        prices.sort((a, b) => {
            const brandComparison = a.brand.name.toLowerCase().localeCompare(b.brand.name.toLowerCase());

            if (brandComparison !== 0) {
                return brandComparison;
            }

            return compareModels(a.model, b.model);
        });

        // prices.sort((a, b) => {
        //     if (a.brand.name.toLowerCase() > b.brand.name.toLowerCase()) return 1;
        //     if (a.brand.name.toLowerCase() < b.brand.name.toLowerCase()) return -1;
        //     if (a.model > b.model) return 1;
        //     if (a.model < b.model) return -1;
        //     return 0;
        // });

        if (idArea) {
            const filteredFaults = faults.filter(fault => fault.idArea === idArea);

            await pdfsMaker.createPricesPdf({
                prices,
                faults: filteredFaults
            });

            return res.status(200).json({
                status: true,
                prices,
                link: `${process.env.BASE_URL}/prices/download-pdf`
            });
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

module.exports = pricesTableController;