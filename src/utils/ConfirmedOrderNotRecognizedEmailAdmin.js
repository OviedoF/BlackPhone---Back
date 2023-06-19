require('dotenv').config();

module.exports = async (order) => {
  return `
    <body style="display: flex; align-items: center; justify-content: center; flex-direction: column; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="width: 100%;">
            <section class="order" style="width:100%;height:100%;">
                <div class="header" style="background-color: #28a745; width: 100%; padding: 20px; box-sizing: border-box;">
                    <img src="https://static-00.iconduck.com/assets.00/success-icon-512x512-qdg1isa0.png" alt="order" style="width: 100%;height:150px;object-fit: contain;">
                    <h2 style="color: white; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center;">¡Has recibido un pedido!</h2>
                </div>

                <p style="font-size: 1.2rem; padding: 20px;">
                    ${order.name} te ha pedido un presupuesto
                </p>

                <h2 style="font-size: 1.2rem; padding: 20px;"> 
                Como el usuario no ha reconocido su modelo o su falla, deberás contactar con él para proporcionarle un presupuesto.
                </h2>

                <h3 style="text-align: left;">A continuación, detallaremos los datos que nos brindaron: </h3>
                <hr style="width: 100%;">

                <ul style="list-style: none;">
                ${order.data
      .map(
        (item) => `
                    <li style="font-size: 1.2rem; padding: 20px; line-height: 1.5; font-weight: bold;":>${item.label}: ${item.value}</li>
                  `
      )
      .join('')}
              </ul>

                <footer style="width: 100%; background-color: #1b6bb1; padding: 20px; color: white; box-sizing: border-box;">
                    <p style="font-size: 1.2rem; text-align: center;">Este email fue enviado por el equipo de Empetel</p>

                    <ul style="display: flex; width: 100%; list-style: none; justify-content: center; padding: 0;">
                        <li style="font-size: 1.2rem; margin: 20px;">
                            <a href="https://www.facebook.com/empetel" style="color: white; text-decoration: none;">
                                <img src="${process.env.BASE_URL + '/static/facebook.png'}" alt="facebook" style="width: 2em; height: 2em;">
                            </a>
                        </li>
                        <li style="font-size: 1.2rem; margin: 20px;">
                            <a href="https://www.instagram.com/empetel" style="color: white; text-decoration: none;"> 
                                <img src="${process.env.BASE_URL + '/static/instagram.png'}" alt="instagram" style="width: 2em; height: 2em;">
                            </a>
                        </li>
                        <li style="font-size: 1.2rem; margin: 20px;">
                            <a href="https://www.empetel.es" style="color: white; text-decoration: none;">
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