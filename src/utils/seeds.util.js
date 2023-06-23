const PricesTableInfo = require('../models/PricesTableInfo.model');
const Province = require('../models/Province.model');
const PricesRules = require('../models/PricesRules.model');
const provinces = require('./provinces.json');
const createInitialStatus = require('./createInitialStatus');
const createInitialAdmin = require('./createInitialAdmin');

const initialPricesTableInfo = async () => {
    const pricesTableInfoDocs = await PricesTableInfo.find();

    if (pricesTableInfoDocs.length > 0) return;

    const pricesTableInfo = new PricesTableInfo({
        headers: [{
            name: 'Marca',
            id: 'brand'
        }, {
            name: 'Modelo',
            id: 'model'
        }, {
            name: 'Pantalla',
            area: 'Granada',
            publicName: 'Fallo en la pantalla',
            id: 'screen',
            idArea: 'local'
        }, {
            name: 'Batería',
            area: 'Granada',
            publicName: 'Fallo en la batería',
            id: 'battery',
            idArea: 'local'
        }, {
            name: 'No Carga',
            area: 'Granada',
            publicName: 'No carga',
            id: 'notCharging',
            idArea: 'local'
        }, {
            name: 'Pantalla',
            area: 'Fuera',
            publicName: 'Fallo en la pantalla',
            id: 'screen',
            idArea: 'outside'
        }, {
            name: 'Batería',
            area: 'Fuera',
            publicName: 'Fallo en la batería',
            id: 'battery',
            idArea: 'outside'
        }, {
            name: 'No Carga',
            area: 'Fuera',
            publicName: 'No carga',
            id: 'notCharging',
            idArea: 'outside'
        }, {
            name: 'Pantalla',
            area: 'Mayorista',
            publicName: 'Fallo en la pantalla',
            id: 'screen',
            idArea: 'wholesale'
        }, {
            name: 'Batería',
            area: 'Mayorista',
            publicName: 'Fallo en la batería',
            id: 'battery',
            idArea: 'wholesale'
        }, {
            name: 'No Carga',
            area: 'Mayorista',
            publicName: 'No carga',
            id: 'notCharging',
            idArea: 'wholesale'
        }]
    });

    await pricesTableInfo.save();

    console.log('[SEEDER] PricesTableInfo seeded! 🌱');
}

const setInitialProvinces = async () => {
    const provincesDocs = await Province.find();

    if (provincesDocs.length > 0) return;

    const provincesArray = JSON.parse(JSON.stringify(provinces));

    await Province.insertMany(provincesArray);
    
    console.log('[SEEDER] Provinces seeded! 🌱');
}

const setInitialPricesRules = async () => {
    const pricesRulesDocs = await PricesRules.find();

    if (pricesRulesDocs.length > 0) return;

    const pricesRules = new PricesRules({
        priceWholesalerOutGranada: 0,
    });

    await pricesRules.save();

    console.log('[SEEDER] PricesRules seeded! 🌱');
}

const runSeeders = async () => {
    await initialPricesTableInfo();
    await setInitialProvinces();
    await createInitialStatus();
    await createInitialAdmin();
    await setInitialPricesRules();
}

module.exports = runSeeders;