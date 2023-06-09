module.exports = async (order) => {
    return `
    <section class="order" style="width:100%;height:100%;display:flex;flex-direction: column;">
        <div class="header" style="display:flex;background-color:#28a745;width:100%;padding:20px;box-sizing:border-box;flex-direction: column;justify-content: center;align-items: center;">
            <img src="https://static-00.iconduck.com/assets.00/success-icon-512x512-qdg1isa0.png" alt="order" style="width: 150px; height: 150px;">
            <h2 style="color: white; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">¡Has recibido un pedido!</h2>
        </div>

        <h2 style="font-size: 1.2rem; padding: 20px;"> 
            Como el usuario no ha reconocido su modelo o su falla, deberás contactar con él para proporcionarle un presupuesto.
        </h2>

        <h3 style="text-align: left;">A continuación, detallaremos los datos de contacto del cliente: </h3>
        <hr style="width: 100%;">

        <ul style="list-style: none;">
            ${order.data.map((item) => {
                return `<li style="font-size: 1.2rem; padding: 20px; line-height: 1.5;"><span style="font-weight: bold">${item.label}</span>: ${item.value}</li>`
            })}
        </ul>

        <footer style="width: 100%; background-color: #1b6bb1; padding: 20px; color: white; box-sizing: border-box;">
            <p style="font-size: 1.2rem; text-align: center;">Este email fue enviado por la aplicación de Empetel</p>

            <ul style="display: flex; width: 100%; list-style: none; justify-content: center; padding: 0;">
                <li style="font-size: 1.2rem; margin: 20px;">
                    <a href="https://www.facebook.com/empetel" style="color: white; text-decoration: none;">
                        <svg xmlns="http://www.w3.org/2000/svg" height="2em" style="fill: white;" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"/></svg>
                    </a>
                </li>
                <li style="font-size: 1.2rem; margin: 20px;">
                    <a href="https://www.instagram.com/empetel" style="color: white; text-decoration: none;"> 
                        <svg xmlns="http://www.w3.org/2000/svg" height="2em" style="fill: white;" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg></a>
                </li>
                <li style="font-size: 1.2rem; margin: 20px;">
                    <a href="https://www.empetel.es" style="color: white; text-decoration: none;">
                        <svg xmlns="http://www.w3.org/2000/svg" height="2em" style="fill: white;" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z"/></svg>
                    </a>
                </li>
            </ul>
        </footer>
    </section>
    `
}