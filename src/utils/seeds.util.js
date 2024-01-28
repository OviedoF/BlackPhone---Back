const PricesTableInfo = require('../models/PricesTableInfo.model');
const Province = require('../models/Province.model');
const PricesRules = require('../models/PricesRules.model');
const WebTexts = require('../models/WebTexts.model');
const provinces = require('./provinces.json');
const Config = require('../models/Config.model');
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
            area: 'Local',
            publicName: 'Fallo en la pantalla',
            id: 'screen',
            idArea: 'local'
        }, {
            name: 'Batería',
            area: 'Local',
            publicName: 'Fallo en la batería',
            id: 'battery',
            idArea: 'local'
        }, {
            name: 'No Carga',
            area: 'Local',
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

const setInitialWebTexts = async () => {
    const webTextsDocs = await WebTexts.find();

    if (webTextsDocs.length > 0) return;

    const webTexts = new WebTexts({
        home: {
            hero: {
                title: 'Blackphone',
                subTitle: 'Oh no, ¡tu móvil se ha roto!',
                itemOne: 'Recogemos tu móvil en la dirección y fecha indicadas.',
                itemTwo: 'Analizamos su estado y reparamos.',
            },
            location: {
                title: 'Si estás en Gandía, ¡Ven a conocernos!',
                description: `Somos una empresa dedicada al arreglo y mantenimiento de móviles, con más de 10 años de experiencia en el mercado.

                ¡Coja cita para reparación en 30 minutos o se lo recogemos y devolvemos reparado en el mismo día!`,
            },
            doItYourself: {
                title: 'Arregla tu móvil tú mismo',
                subTitle: '¿Tienes capacidad para arreglar tu celular y necesitas repuestos?',
                description: 'En nuestra tienda online encontrarás todo lo que necesitas para reparar tu móvil. Desde pantallas, baterías, flex, carcasas, etc.'
            },
            wholesale: {
                title: 'Reparación para tiendas y empresas',
                subTitle: '¿Tienes una tienda o empresa y necesitas nuestros servicios?',
                description: 'En Blackphone ofrecemos servicios de reparación para tiendas y empresas. Si necesitas reparar un móvil, no dudes en contactar con nosotros.'
            },
            status: {
                title: '¿Cómo va mi reparación?',
                subTitle: 'Vea el estado de su reparación',
                description: 'En Blackphone, nos gusta que nuestros clientes estén informados en todo momento del estado de su reparación. Por eso, hemos creado un sistema de seguimiento de reparaciones, para que puedas ver en todo momento el estado de tu reparación.'
            },
            brands: {
                title: 'Reparamos todas las marcas',
            }
        },
        aboutUs: [{
            title: 'Nuestra Empresa',
            description: 'Blackphone.net pertenece a Empe Telecomunicaciones S.L, sociedad inscrita en el Registro Mercantil de Gandía: Tomo 1518, Folio 216, Hoja GR:44454. Con CIF ESB19549146.',
            image: 'https://www.ceupe.com/images/easyblog_articles/3119/empresa-conjunta.jpg'
        }],
        aboutUsTitle: 'Sobre Nosotros',
        whyUs: [{
            title: 'Experiencia',
            description: 'Llevamos más de 20 años en el sector de la reparación de móviles, tablets y ordenadores.'
        }],
        whyUsTitle: '¿Por qué elegirnos?',
        garanties: [{
            title: 'Devoluciones',
            description: `Derecho de desistimiento: El comprador tiene quince días hábiles para el ejercicio del derecho sin necesidad de justificar la decisión y sin penalización de ninguna clase.

            En Blackphone.net nos esforzamos para ofrecer a nuestros clientes la mejor calidad posible en todos nuestros productos y servicios. Pero si tienes algún motivo para devolver un producto, le indicamos las instrucciones a continuación.
            
            ¡Le damos la posibilidad de devolver los productos que desees en caso de que no quedes satisfecho, Dispones de 15 días naturales para cambiar de opinión!
            
            Blackphone.net le da la posibilidad de beneficiarte de 15 días (que marca el artículo L 121-20 del Código del Consumidor), para devolver un producto con el que no estás satisfecho. Este plazo comienza a partir de la fecha de recepción de su paquete.
            
            Los productos deben ser devueltos en su condición de origen, y con el envoltorio original. Si el producto está abierto, es imprescindible que tanto el embalaje como el contenido, así como los accesorios estén en perfecto estado. No podremos acceder a su solicitud de devolución si el embalaje está usado, gastado, manipulado, o el producto o sus accesorios deteriorados.
            
            Este derecho de desistimiento y devolución no será de aplicación a los bienes confeccionados conforme a las especificaciones del consumidor o claramente personalizados o que, por su naturaleza no puedan ser devueltos o puedan deteriorarse o caducar con rapidez, repuestos que debido a su gran fragilidad hayan sido mal manipulados durante el proceso de montaje o instalación, discos y programas informáticos que hubiesen sido desprecintados así como ficheros informáticos suministrados por vía electrónica susceptibles de ser descargados o reproducidos con carácter inmediato y servicios para los que la normativa aplicable prevea tal excepción. El comprador tendrá que asumir los gastos de envíos sí desea acogerse a su derecho de desistimiento, Blackphone se lo hace fácil y se lo recoge o cambia por sólo 7,90€.
            En el caso de que el producto se devolviera por estar defectuoso o no funciona correctamente los gastos de envío correrán de nuestra cuenta debiendo seguir el mismo proceso que se indica más adelante. Si el cliente nos avisa de la recepción del producto defectuoso en las primeras 48h, Blackphone.net se encarga de recogerlo, comprobarlo y vambiarlo sin ningún gasto para el comprador. En el supuesto de que el cliente detectase algún problema en el momento de la entrega de su pedido (incidencia en transporte : embalaje estropeado, productos faltantes o deteriorados) debe contactar con nuestro centro de atención al cliente en el email info@Blackphone.net o al teléfono 958 99 11 63 dentro de las primeras 48 horas siguientes a la recepción. De no ser comunicado, no se aceptarán reclamaciones. *Una vez recibida la devolución, analizaremos su contenido y se se enviará nuevamente el producto o se le abonará el importe.
            Si el producto ha dejado de funcionar correctamente en el periodo de garantía, puede optar a contactar con el fabricante presentando nuestra factura o pedirnos a nosotros tramitar la garantía por usted. Blackphone se lo hace fácil, pasamos a recogerlo y devolverselo una vez reparado o sustituido por el fabricante ( coste 9,90€). * Si la garantía se refiere a repuestos montados fuera de un servicio técnico oficial, el fabricante se reserva el derecho de tramitar la garantía debido a un posible montaje deficiente, uso de pagementos corrosivos y herramientas inadecuadas.`,
            image: 'https://www.ceupe.com/images/easyblog_articles/3119/empresa-conjunta.jpg'
        }],
        garantiesTitle: 'Garantías',
        wholesales: {
            title: 'Mayoristas',
            description: `
            Si usted es mayorista, distribuidor o tienda de telefonía o electrónica, blackphoneservice.com le ofrece:

            + Descuentos de hasta el 50% sobre PVP en todo nuestro catálogo de la web.
            + Stock real y permanente con envío en 24h por sólo 4,90€ o portes gratis para pedidos superiores a 50€. Sin pedido mínimo.
            + Atención personalizada y contacto directo con nuestros comerciales.
            
            Rellene este formulario e inmediatamente un agente comercial se pondrá en contacto con usted para facilitarle sus claves de acceso y el porcentaje de descuento.
            
            Siempre tendrá a su agente comercial para cualquier duda sobre envíos, pagos o devoluciones.
            `,
            image: 'https://www.ceupe.com/images/easyblog_articles/3119/empresa-conjunta.jpg'
        },
        functioning: [{
            title: 'Recogida en su domicilio o lugar de trabajo',
            description: `Recogemos tu móvil en la dirección y fecha que nos ha indicado. Le enviaremos un mensajero de Nacex/MRW que le dejará un comprobante de la recogida. Protege bien el móvil en un paquete cerrado y entrégalo al mensajero.`
        }],
        functioningTitle: '¿Cómo funciona?',
        fixMyPhone: {
            title: 'Reparar mi móvil',
        }
    });

    await webTexts.save();

    console.log('[SEED] Web texts created');
}

const clearWebTexts = async () => {
    await WebTexts.deleteMany({});
    console.log('[SEED] Web texts deleted');
}

const setInitialConfig = async () => {
    const configDocs = await Config.find();

    if (configDocs.length > 0) return;

    const config = new Config({
        initialPositionsPrices: false,
    });

    await config.save();

    console.log('[SEED] Config seeded! 🌱');
}

const runSeeders = async () => {
    await initialPricesTableInfo();
    await setInitialProvinces();
    await createInitialStatus();
    await createInitialAdmin();
    await setInitialPricesRules();
    await setInitialWebTexts();
    await setInitialConfig();
}

module.exports = runSeeders;