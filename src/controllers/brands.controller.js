const Brands = require('../models/Brands.model');
const Prices = require('../models/Prices.model');

const brandsController = {}

brandsController.getBrands = async (req, res) => {
    try {
        const brands = await Brands.find().sort({ name: 1 });
        
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
        const { name } = req.body;
        const newBrand = new Brands({
            name
        });
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