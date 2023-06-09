const express = require('express');
const router = express.Router();
const Province = require('../models/Province.model');

router.get('/', async (req, res) => {
    try {
        const provinces = await Province.find();
        res.status(200).json(provinces);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

router.put('/price/:id', async (req, res) => {
    try {
        const province = await Province.findById(req.params.id);
        province.price = req.body.price;
        await province.save();
        res.status(200).json(province);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

module.exports = router;