const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth(),
});

const InitializeWPP = () => {
    client.on('qr', (qr) => {
        qrcode.generate(qr, { small: true });
    });
    
    client.on('ready', () => {
        console.log('WhatsApp is ready 😀');
    });
    
    client.on('message', msg => {
        if (msg.body == '!ping') {
            console.log(msg.from);
           client.sendMessage(msg.from, 'pong');
        }
    });
    
    client.initialize();

    return client;
}

module.exports = {
    InitializeWPP,
    client
};