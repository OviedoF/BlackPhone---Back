const PricesTableInfo = require('../models/PricesTableInfo.model');
const Prices = require('../models/Prices.model');
const Faults = require('../models/Faults.model');
const pricesTableController = {};
const pdfsMaker = require('../utils/PricesPdfMaker');
const path = require('path');

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
        const { page = 1, limit = 10 } = req.query;
        const prices = await Prices.find().populate('brand').sort({ brand: 1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        prices.sort((a, b) => {
            if (a.brand.name.toLowerCase() > b.brand.name.toLowerCase()) return 1;
            if (a.brand.name.toLowerCase() < b.brand.name.toLowerCase()) return -1;
            if (a.model > b.model) return 1;
            if (a.model < b.model) return -1;
            return 0;
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

        if(!priceItem) return res.status(200).send({
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
            const {publicName} = await Faults.findOne({
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
        const prices = await Prices.find().populate('brand').sort({ brand: 1 });
        const faults = await Faults.find();
        
        // order prices by brand and model alphabetically ignoring uppercase

        prices.sort((a, b) => {
            if (a.brand.name.toLowerCase() > b.brand.name.toLowerCase()) return 1;
            if (a.brand.name.toLowerCase() < b.brand.name.toLowerCase()) return -1;
            if (a.model > b.model) return 1;
            if (a.model < b.model) return -1;
            return 0;
        });

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