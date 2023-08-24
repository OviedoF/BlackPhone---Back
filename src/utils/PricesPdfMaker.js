const PdfMake = require("pdfmake");
const fs = require('fs');
const path = require('path');

const pdfsMaker = {};

pdfsMaker.createPricesPdf = async (petition) => {
    const body = [];
    
    const headers = ['Marca', 'Modelo'];

    petition.faults.forEach(fault => {
        headers.push(
            `${fault.publicName} ${fault.area}`
        );
    });

    body.push(headers);

    petition.prices.forEach(price => {
        const row = [price.brand.name, price.model, ...petition.faults.map(fault => {
            price.prices[`${fault.id}${fault.idArea}`] = price.prices[`${fault.id}${fault.idArea}`] ? `€${price.prices[`${fault.id}${fault.idArea}`]}` : '-';
            return price.prices[`${fault.id}${fault.idArea}`];
        })];
        body.push(row);
    });

    console.log(body);

    const docDefinition = {
        pageOrientation: 'landscape',
        pageMargins: [ 40, 60, 40, 60 ],
        content: [
            {
                text: 'Precios de averías Empetel',
                style: 'header'
            },
            'Precios de averías Empetel, con fecha al día del ' + new Date().toLocaleDateString() + '.',
            {
                style: 'tableExample',
                table: {
                    headerRows: 1,
                    body
                },
                layout: 'headerLineOnly'
            },
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