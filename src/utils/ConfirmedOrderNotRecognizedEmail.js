require('dotenv').config();

module.exports = async (order) => {
  return `
    <body style="display: flex; align-items: center; justify-content: center; flex-direction: column; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="width: 100%;">
            <section class="order" style="width:100%;height:100%;">
                <div class="header" style="background-color: #28a745; width: 100%; padding: 20px; box-sizing: border-box;">
                    <img src="https://static-00.iconduck.com/assets.00/success-icon-512x512-qdg1isa0.png" alt="order" style="width: 100%;height:150px;object-fit: contain;">
                    <h2 style="color: white; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center;">Hemos recibido tu pedido!</h2>
                </div>

                <p style="font-size: 1.2rem; padding: 20px;">
                Mucho gusto, ${order.name}, tu pedido ha sido recibido y estaremos en contacto contigo. ¡Muchas gracias por confiar en Blackphone!
                </p>

                <h2 style="font-size: 1.2rem; padding: 20px;"> 
                Como nuestra aplicación no pudo proporcionarte un precio, nos encargaremos de comunicarnos contigo y brindarte un presupuesto acorde a los datos que nos has enviado.
                </h2>

                <footer style="width: 100%; background-color: #1b6bb1; padding: 20px; color: white; box-sizing: border-box;">
                    <p style="font-size: 1.2rem; text-align: center;">Este email fue enviado por el equipo de Blackphone</p>

                    <ul style="display: flex; width: 100%; list-style: none; justify-content: center; padding: 0;">
                        <li style="font-size: 1.2rem; margin: 20px;">
                            <a href="https://www.instagram.com/blackphonegandia" style="color: white; text-decoration: none;"> 
                                <img src="${process.env.BASE_URL + '/static/instagram.png'}" alt="instagram" style="width: 2em; height: 2em;">
                            </a>
                        </li>
                        <li style="font-size: 1.2rem; margin: 20px;">
                            <a href="https://blackphoneservice.com/" style="color: white; text-decoration: none;">
                                <img src="${process.env.BASE_URL + '/static/web.png'}" alt="web" style="width: 2em; height: 2em;">
                            </a>
                        </li>
                    </ul>
                </footer>
            </section>
        </div>
    </body>
    `;
};