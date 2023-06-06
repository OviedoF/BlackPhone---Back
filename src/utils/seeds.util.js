const PricesTableInfo = require('../models/PricesTableInfo.model');

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

const runSeeders = async () => {
    await initialPricesTableInfo();
}

module.exports = runSeeders;