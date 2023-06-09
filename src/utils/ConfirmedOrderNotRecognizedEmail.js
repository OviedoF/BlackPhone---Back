module.exports = async (order) => {
    return `
    <html>
      <head>
        <style>
          @media only screen and (max-width: 600px) {
            .order {
              padding: 10px;
            }
            .header {
              padding: 10px;
            }
            img {
              width: 100px;
              height: 100px;
            }
            h2 {
              font-size: 18px;
            }
            p,
            h2,
            h3,
            ul,
            li {
              font-size: 14px;
            }
          }
        </style>
      </head>
      <body>
        <section class="order" style="width: 100%; height: 100%; display: flex; flex-direction: column;">
          <div class="header" style="display: flex; background-color: #28a745; width: 100%; padding: 20px; box-sizing: border-box; flex-direction: column; justify-content: center; align-items: center;">
            <img src="https://static-00.iconduck.com/assets.00/success-icon-512x512-qdg1isa0.png" alt="order" style="width: 150px; height: 150px;" />
            <h2 style="color: white; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">¡Hemos recibido tu pedido!</h2>
          </div>
  
          <p style="font-size: 1.2rem; padding: 20px;">
            Mucho gusto, ${order.name}, tu pedido ha sido recibido y estaremos en contacto contigo. ¡Muchas gracias por confiar en Empetel!.
          </p>
  
          <h2 style="font-size: 1.2rem; padding: 20px;">
            Como nuestra aplicación no pudo proporcionarte un precio, nos encargaremos de comunicarnos contigo y brindarte un presupuesto acorde a las fotos que nos has enviado. ¡Muchas gracias por confiar en Empetel!
          </h2>
  
          <h3 style="text-align: left;">A continuación, detallaremos los datos de contacto que nos brindaste:</h3>
          <hr style="width: 100%;" />
  
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
                  <svg xmlns="http://www.w3.org/2000/svg" height="2em" style="fill: white;" viewBox="0 0 24 24" width="2em">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M14 2H6a2 2 0 00-2 2v12a2 2 0 002 2h4v-6H5v-2h5V6c0-1.1.9-2 2-2h4v6h2V4a2 2 0 00-2-2zm-2 2v6h-2v2h2v6h2v-6h2l.002-2h-2V4h-2z" />
                  </svg>
                </a>
              </li>
              <li style="font-size: 1.2rem; margin: 20px;">
                <a href="https://www.instagram.com/empetel/" style="color: white; text-decoration: none;">
                  <svg xmlns="http://www.w3.org/2000/svg" height="2em" style="fill: white;" viewBox="0 0 24 24" width="2em">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 15.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm3.5-6.5h-7a4.25 4.25 0 010 8.5h7a4.25 4.25 0 010-8.5zm0 6a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM12 8a4 4 0 110 8 4 4 0 010-8zm0 1.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" />
                  </svg>
                </a>
              </li>
            </ul>
          </footer>
        </section>
      </body>
    </html>
    `;
  };