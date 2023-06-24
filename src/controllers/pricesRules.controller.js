const PricesRules = require('../models/PricesRules.model');

const pricesRulesController = {};

pricesRulesController.getPricesRules = async (req, res) => {
    try {
        const pricesRules = await PricesRules.findOne();

        res.status(200).send({ 
            status: true,
            pricesRules
         });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            status: false,
            message: 'Error al obtener las reglas de precios' 
        });
    }
}

pricesRulesController.editPricesRules = async (req, res) => {
    try {
        const { pricesRules } = req.body;
        const pricesRulesDoc = await PricesRules.findOneAndUpdate({}, pricesRules, { new: true });

        res.status(200).json({ 
            status: true,
            pricesRules: pricesRulesDoc.pricesRules 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            status: false,
            message: 'Error al actualizar las reglas de precios' 
        });
    }
}

module.exports = pricesRulesController;