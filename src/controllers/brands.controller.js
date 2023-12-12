const Brands = require('../models/Brands.model');
const Prices = require('../models/Prices.model');

const brandsController = {}

brandsController.getBrands = async (req, res) => {
    try {
        const brands = await Brands.find().sort({ name: 1 });
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

        const newBrand = new Brands(req.body);
        await newBrand.save();

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

module.exports = brandsController;