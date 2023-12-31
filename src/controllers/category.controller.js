const Category = require('../models/Category.model');
const Brands = require('../models/Brands.model');

const brandsController = {}

brandsController.get = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        console.log(categories);

        res.status(200).send({
            message: 'Category retrieved successfully',
            categories,
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

brandsController.create = async (req, res) => {
    try {
        console.log(req.body);
        if (req.files && req.files.images) {
            req.body.image = `${process.env.BASE_URL}/uploads/${req.files.images[0].filename}`;
        }

        const newCategory = new Category(req.body);
        await newCategory.save();

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

brandsController.edit = async (req, res) => {
    try {
        if (req.files && req.files.images) {
            req.body.image = `${process.env.BASE_URL}/uploads/${req.files.images[0].filename}`;
        }

        await Category.findByIdAndUpdate(req.params.id, req.body);

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

brandsController.delete = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findByIdAndDelete(id);
        await Brands.deleteMany({ category: category._id });

        res.status(200).send({
            message: 'Marca eliminada correctamente',
            status: true
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Error while deleting category',
            status: false
        })
    }
}

module.exports = brandsController;