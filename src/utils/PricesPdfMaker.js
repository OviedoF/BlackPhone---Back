const PdfMake = require("pdfmake");
const fs = require('fs');
const path = require('path');

const pdfsMaker = {};

pdfsMaker.createPricesPdf = async (petition) => {
    const body = [

    ];

    petition.prices.forEach(price => {
        body.push([
            { text: `${price.brand.name} - ${price.model}`, style: 'subheader'},
        ])

        const ul = []
        console.log(price.prices);

        petition.faults.forEach(fault => {
            console.log(price.prices[`${fault.id}${fault.idArea}`]);
            console.log(`${fault.id}${fault.idArea}`);

            if(price.prices[`${fault.id}${fault.idArea}`]){
                ul.push(`${fault.publicName} (${fault.area}): €${price.prices[`${fault.id}${fault.idArea}`]}`);
            }
        });

        body.push({
            ul: ul
        });
    });

    console.log(body);

    const docDefinition = {
        content: [
            { text: 'Lista de precios Empetel', style: 'header', alignment: 'center'  },
            { text: 'Fecha: ' + new Date().toLocaleDateString(), style: 'subheader', alignment: 'center'  },
            ...body
        ],
        styles: {
            header: {
                fontSize: 20,
                bold: true,
                margin: [0, 0, 0, 20], // [left, top, right, bottom]
                alignment: 'center'
            },
            subheader: {
                fontSize: 16,
                bold: true,
                margin: [0, 20, 0, 10]
            },
            tableExample: {
                margin: [0, 25, 0, 15],
                width: '100%',
                textAlign: 'center'
            },
        }
    };

    const fonts = {
        Roboto: {
            normal: path.join(__dirname, '..', 'public', 'api', 'fonts', 'Roboto-Regular.ttf'),
            bold: path.join(__dirname, '..', 'public', 'api', 'fonts', 'Roboto-Medium.ttf'),
            italics: path.join(__dirname, '..', 'public', 'api', 'fonts', 'Roboto-Italic.ttf'),
            bolditalics: path.join(__dirname, '..', 'public', 'api', 'fonts', 'Roboto-MediumItalic.ttf')
        },
    };

    const printer = new PdfMake(fonts);
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const filePath = path.join(__dirname, '..', 'public', 'api', 'documents', `precios.pdf`);

    pdfDoc.pipe(fs.createWriteStream(filePath));
    pdfDoc.end();
}

module.exports = pdfsMaker;