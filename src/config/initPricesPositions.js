const PricesTableInfo = require('../models/PricesTableInfo.model');
const Prices = require('../models/Prices.model');
const Config = require('../models/Config.model');
const path = require('path');

function getModelNameAndVersion(model) {
    const match = model.match(/([^\d]+)(\d+)(\D*)/);

    if (match) {
        const [, name, version, edition] = match;
        return [name.trim(), parseInt(version), edition.trim()];
    } else {
        // No se encontró un número de versión, considerar versión 0
        return [model.trim(), 0, ''];
    }
}

async function setPositions() {
    try {
        let prices
        
        prices = await Prices.find({
            brand: { $ne: null },
            model: { $ne: null }
        }).populate('brand')

        prices.sort((a, b) => {
            const brandComparison = a.brand.name.toLowerCase().localeCompare(b.brand.name.toLowerCase());

            if (brandComparison !== 0) {
                return brandComparison;
            }

            const [nameA, versionA, editionA] = getModelNameAndVersion(a.model.toLowerCase());
            const [nameB, versionB, editionB] = getModelNameAndVersion(b.model.toLowerCase());

            if (nameA !== nameB) {
                return nameA.localeCompare(nameB);
            }

            if (versionA !== versionB) {
                return versionA - versionB;
            }

            // Aquí comparamos las ediciones; si una edición está vacía, se coloca después
            if (editionA === '' && editionB !== '') {
                return 1;
            } else if (editionA !== '' && editionB === '') {
                return -1;
            } else {
                return editionA.localeCompare(editionB);
            }
        });

        for (i = 0; i < prices.length; i++) {
            const price = prices[i];
            const priceTableInfo = await PricesTableInfo.findOne({
                brand: price.brand._id,
                model: price.model,
                edition: price.edition
            });

            if (priceTableInfo) {
                price.position = i + 1;
                await price.save();
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

async function initPricesPositions() {
    try {
        const config = await Config.findOne({});

        if (!config) return;
        if (config.initialPositionsPrices) return;

        let prices
        
        prices = await Prices.find({
            brand: { $ne: null },
            model: { $ne: null }
        }).populate('brand')

        prices.sort((a, b) => {
            const brandComparison = a.brand.name.toLowerCase().localeCompare(b.brand.name.toLowerCase());

            if (brandComparison !== 0) {
                return brandComparison;
            }

            const [nameA, versionA, editionA] = getModelNameAndVersion(a.model.toLowerCase());
            const [nameB, versionB, editionB] = getModelNameAndVersion(b.model.toLowerCase());

            if (nameA !== nameB) {
                return nameA.localeCompare(nameB);
            }

            if (versionA !== versionB) {
                return versionA - versionB;
            }

            // Aquí comparamos las ediciones; si una edición está vacía, se coloca después
            if (editionA === '' && editionB !== '') {
                return 1;
            } else if (editionA !== '' && editionB === '') {
                return -1;
            } else {
                return editionA.localeCompare(editionB);
            }
        });

        for (i = 0; i < prices.length; i++) {
            const price = prices[i];
            const priceTableInfo = await PricesTableInfo.findOne({
                brand: price.brand._id,
                model: price.model,
                edition: price.edition
            });

            if (priceTableInfo) {
                price.position = i + 1;
                await price.save();
            }
        }

        config.initialPositionsPrices = true;
        await config.save(); 
        console.log('[SEED] Prices positions initialized!');
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    initPricesPositions,
    setPositions
};