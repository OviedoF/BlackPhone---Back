const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

let client = new Client({
    session: session,
    //qrTimeoutMs: 120000,
    //authTimeoutMs: 120000,
    restartOnAuthFail: true,
    //takeoverOnConflict: true
    //takeoverTimeoutMs: 5000
    puppeteer: {headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-extensions']},
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