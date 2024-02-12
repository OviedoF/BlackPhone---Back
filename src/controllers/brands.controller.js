const Brands = require('../models/Brands.model');
const Prices = require('../models/Prices.model');

const brandsController = {}

brandsController.getBrands = async (req, res) => {
    try {
        const brands = await Brands.find().sort({ index: 1 }).populate('category');
        console.log(brands);

        res.status(200).send({
            message: 'Brands retrieved successfully',
            brands,
            status: true
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Error while retrieving brands',
            status: false
        })
    }
}

brandsController.createBrand = async (req, res) => {
    try {
        console.log(req.body);
        if (req.files && req.files.images) {
            req.body.image = `${process.env.BASE_URL}/uploads/${req.files.images[0].filename}`;
        }

        // set index
        const brandsFinded = await Brands.find();
        req.body.index = brandsFinded.length + 1;

        const newBrand = new Brands(req.body);
        await newBrand.save();

        // Ordenar alfabéticamente

        const brands = await Brands.find().sort({ name: 1 });

        for (let i = 0; i < brands.length; i++) {
            brands[i].index = i + 1;
            await brands[i].save();
        }

        res.status(200).send({
            message: 'Marca creada correctamente',
            status: true
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Error while creating brand',
            status: false
        })
    }
}

brandsController.editBrand = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(req.body);
        console.log(req.params);

        if (req.files && req.files.images) {
            req.body.image = `${process.env.BASE_URL}/uploads/${req.files.images[0].filename}`;
        }

        const brand = await Brands.findByIdAndUpdate(req.params.id, req.body);

        res.status(200).send({
            message: 'Marca actualizada correctamente',
            status: true
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Error while updating brand',
            status: false
        })
    }
}

brandsController.deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;

        const brand = await Brands.findByIdAndDelete(id);
        await Prices.deleteMany({ brand: brand._id });

        // Restar -1 a los índices de las marcas que estén por encima de la marca eliminada

        const brands = await Brands.find();

        for (let i = 0; i < brands.length; i++) {
            const marca = brands[i];

            if (marca.index > brand.index) {
                marca.index--
                await marca.save();
            }
        }

        res.status(200).send({
            message: 'Marca eliminada correctamente',
            status: true
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Error while deleting brand',
            status: false
        })
    }
}

brandsController.setIndexAlphaberticallly = async (req, res) => {
    try {
        const brands = await Brands.find().sort({ name: 1 });

        for (let i = 0; i < brands.length; i++) {
            brands[i].index = i + 1;
            await brands[i].save();
        }

        res.status(200).send({
            message: 'Marcas ordenadas alfabéticamente',
            status: true
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Error while setting index',
            status: false
        })
    }
}

brandsController.changeBrandIndex = async (req, res) => {
    try {
        const { index } = req.body;
        const { id } = req.params;

        console.log(req.body);
        console.log(req.params);

        const brand = await Brands.findById(id);
        const brands = await Brands.find();

        if (index > brands.length) {
            return res.status(400).send({
                message: 'Índice no válido',
                status: false
            })
        }

        for (let i = 0; i < brands.length; i++) {
            const marca = brands[i];

            if (brand.index > index && marca.index <= brand.index && marca.index >= index) {
                if (marca.index === brand.index) {
                    marca.index = index
                } else if (marca.index >= index) {
                    marca.index++
                }
            } else {
                if (marca.index === brand.index) {
                    marca.index = index
                } else if (marca.index === index) {
                    marca.index = brand.index
                }
            }

            await marca.save();
        }

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

module.exports = brandsController;