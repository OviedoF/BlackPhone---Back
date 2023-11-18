const PricesTableInfo = require('../models/PricesTableInfo.model');
const Prices = require('../models/Prices.model');
const Faults = require('../models/Faults.model');
const pricesTableController = {};
const pdfsMaker = require('../utils/PricesPdfMaker');
const path = require('path');
const {setPositions} = require('../config/initPricesPositions');

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
        }).populate('brand').sort({ position: 1 });

        console.log(page, limit);

        if(page && limit !== 'undefined' && limit) {
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

        const price = new Prices({
            ...data,
            prices: {
                modifiedAt: new Date().toLocaleDateString(),
            }
        });

        await price.save();
        await setPositions();

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

pricesTableController.changePosition = async (req, res) => {
    try {
        const { id } = req.params;
        const { position } = req.body;
        
        const price = await Prices.findById(id);
        const priceWithThatPosition = await Prices.findOne({ position });

        if (priceWithThatPosition) {
            priceWithThatPosition.position = price.position;
            price.position = position;
            await price.save();
            await priceWithThatPosition.save();
        } else {
            price.position = position;
            await price.save();
        }

        res.status(200).send({
            data: null,
            message: 'Posición cambiada correctamente!',
            status: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            data: null,
            message: 'Error al cambiar la posición!',
            status: false
        });
    }
}

pricesTableController.upPricePosition = async (req, res) => {
    try {
        const { id } = req.params;

        const Price = await Prices.findById(id);

        if (Price.position === 1) return res.status(200).send({
            data: null,
            message: 'No se puede subir más!',
            status: false
        });

        const PriceToChange = await Prices.findOne({ position: Price.position - 1 });

        Price.position = Price.position - 1;

        PriceToChange.position = PriceToChange.position + 1;

        await Price.save();
        await PriceToChange.save();

        res.status(200).send({
            data: null,
            message: 'Posición cambiada correctamente!',
            status: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            data: null,
            message: 'Error al cambiar la posición!',
            status: false
        });
    }
}

pricesTableController.downPricePosition = async (req, res) => {
    try {
        const { id } = req.params;

        const Price = await Prices.findById(id);

        const PricesCount = await Prices.countDocuments();

        if (Price.position === PricesCount) return res.status(200).send({
            data: null,
            message: 'No se puede bajar más!',
            status: false
        });

        const PriceToChange = await Prices.findOne({ position: Price.position + 1 });

        Price.position = Price.position + 1;

        PriceToChange.position = PriceToChange.position - 1;

        await Price.save();
        await PriceToChange.save();

        res.status(200).send({
            data: null,
            message: 'Posición cambiada correctamente!',
            status: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            data: null,
            message: 'Error al cambiar la posición!',
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

        if(faultsToPrintIds) faultsToPrintIds.pop();

        console.log(faultsToPrintIds);

        const prices = await Prices.find({
            brand: brand ? brand : { $ne: null }
        })
            .populate('brand')
            .sort({ position: 1 });

        let faults = await Faults.find();

        if (faultsToPrintIds) {
            faults = faults.filter(fault => faultsToPrintIds.includes(`${fault.id}${fault.idArea}`));
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