const requirePresupuestEmailUser = async (order) => {
    return `
    <body
style = "display: flex; align-items: center; justify-content: center; flex-direction: column; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" >
    <div style="width: 100%;">
        <section class="order" style="width:100%;height:100%;color:#292929;">
            <div class="header" style="background-color: #28a745; width: 100%; padding: 20px; box-sizing: border-box;">
                <img src="https://static-00.iconduck.com/assets.00/success-icon-512x512-qdg1isa0.png" alt="order"
                    style="width: 100%;height:150px;object-fit: contain;">
                    <h2
                        style="color: white; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center;">
                        ¡Has solicitado un presupuesto en Empetel!
                    </h2>
            </div>

            <p style="text-align: center;font-size: 1.2rem; padding: 20px;">
                ¡Hola ${order.name}! Gracias por confiar en nosotros, en breve nos pondremos en contacto contigo para brindarte un presupuesto.
            </p>

            <p style="text-align: center;font-size: 1.2rem; padding: 20px;">
                Código del pedido:
            </p>

            <h2 style="text-align: center; font-size: 2rem; padding: 20px;">${order.id}</h2>

            <h3 style="text-align: left;">A continuación, detallaremos los datos que nos brindaste: </h3>
            <hr style="width: 100%;">

            <table style="width: 50%; margin: 5rem auto; ">
            <tbody>
                <tr style="border: 1px solid #292929;">
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Nombre:</th>
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.name}</th>
                </tr>

                <tr style="border: 1px solid #292929;">
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Teléfono:</th>
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.phone}</th>
                </tr>

                <tr style="border: 1px solid #292929;">
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Email:</th>
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.email}</th>
                </tr>

                <tr style="border: 1px solid #292929;">
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Provincia:</th>
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.province}</th>
                </tr>

                <tr style="border: 1px solid #292929;">
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Municipio:</th>
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.municipie}</th>
                </tr>

                ${order.province === 'Granada' && order.municipie === 'Granada' ? `
                <tr style="border: 1px solid #292929;">
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Dirección:</th>
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.user_address}</th>
                </tr>
                ` : ''}

                <tr style="border: 1px solid #292929;">
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Marca:</th>
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${
                        order.dontRecognized.brand ? order.dontRecognized.brand : order.brand
                    }</th>
                </tr>

                <tr style="border: 1px solid #292929;">
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Modelo:</th>
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${
                        order.dontRecognized.model ? order.dontRecognized.model : order.model
                    }</th>
                </tr>

                <tr style="border: 1px solid #292929;">
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Avería:</th>
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">
                    ${(!order.dontRecognized.fault && order.faults && order.faults.length > 0) ? order.faults.map((fault, index) => {
                        if (index === order.faults.length - 1) {
                            return fault
                        }
                        return fault + ' - '
                    }) : ''}

                    ${order.dontRecognized.fault ? order.dontRecognized.fault : ''}
                    </th>
                </tr>

                ${(!order.dontRecognized.fault && order.fault_details) ? `<tr style="border: 1px solid #292929;">
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Descripción de la avería:</th>
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.fault_details}</th>
                </tr>` : ''}
            </tbody >
        </table >

    <footer
        style="width: 100%; background-color: #1b6bb1; padding: 20px; color: white; box-sizing: border-box;">
        <p style="font-size: 1.2rem; text-align: center;">Este email fue enviado por el equipo de Empetel</p>

        <ul style="display: flex; width: 100%; list-style: none; justify-content: center; padding: 0;">
            <li style="font-size: 1.2rem; margin: 20px;">
                <a href="https://www.facebook.com/empetel" style="color: white; text-decoration: none;">
                    <img src="${process.env.BASE_URL + '/static/facebook.png'}" alt="facebook"
                        style="width: 2em; height: 2em;">
                </a>
            </li>
            <li style="font-size: 1.2rem; margin: 20px;">
                <a href="https://www.instagram.com/empetel" style="color: white; text-decoration: none;">
                    <img src="${process.env.BASE_URL + '/static/instagram.png'}" alt="instagram"
                        style="width: 2em; height: 2em;">
                </a>
            </li>
            <li style="font-size: 1.2rem; margin: 20px;">
                <a href="https://www.empetel.es" style="color: white; text-decoration: none;">
                    <img src="${process.env.BASE_URL + '/static/web.png'}" alt="web"
                        style="width: 2em; height: 2em;">
                </a>
            </li>
        </ul>
    </footer>
        </section >
    </div >
</ >
    `
}

const requirePresupuestEmailAdmin = async (order) => {
    return `
    <body
style = "display: flex; align-items: center; justify-content: center; flex-direction: column; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" >
    <div style="width: 100%;">
        <section class="order" style="width:100%;height:100%;color:#292929;">
            <div class="header" style="background-color: #28a745; width: 100%; padding: 20px; box-sizing: border-box;">
                <img src="https://static-00.iconduck.com/assets.00/success-icon-512x512-qdg1isa0.png" alt="order"
                    style="width: 100%;height:150px;object-fit: contain;">
                    <h2
                        style="color: white; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center;">
                        ¡Han solicitado un presupuesto en Empetel!
                    </h2>
            </div>

            <p style="text-align: center;font-size: 1.2rem; padding: 20px;">
                Han solicitado un presupuesto en Empetel, a continuación, detallaremos los datos que nos brindaron:
            </p>

            <p style="text-align: center;font-size: 1.2rem; padding: 20px;">
                Código del pedido:
            </p>

            <h2 style="text-align: center; font-size: 2rem; padding: 20px;">${order.id}</h2>

            <h3 style="text-align: left;">A continuación, detallaremos los datos que nos brindaron: </h3>
            <hr style="width: 100%;">

            <table style="width: 50%; margin: 5rem auto; ">
            <tbody>
                <tr style="border: 1px solid #292929;">
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Nombre:</th>
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.name}</th>
                </tr>

                <tr style="border: 1px solid #292929;">
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Teléfono:</th>
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.phone}</th>
                </tr>

                <tr style="border: 1px solid #292929;">
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Email:</th>
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.email}</th>
                </tr>

                <tr style="border: 1px solid #292929;">
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Provincia:</th>
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.province}</th>
                </tr>

                <tr style="border: 1px solid #292929;">
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Municipio:</th>
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.municipie}</th>
                </tr>

                ${order.province === 'Granada' && order.municipie === 'Granada' ? `
                <tr style="border: 1px solid #292929;">
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Dirección:</th>
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.user_address}</th>
                </tr>
                ` : ''}

                <tr style="border: 1px solid #292929;">
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Marca:</th>
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${
                        order.dontRecognized.brand ? order.dontRecognized.brand : order.brand
                    }</th>
                </tr>

                <tr style="border: 1px solid #292929;">
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Modelo:</th>
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${
                        order.dontRecognized.model ? order.dontRecognized.model : order.model
                    }</th>
                </tr>

                <tr style="border: 1px solid #292929;">
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Avería:</th>
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">
                    ${(!order.dontRecognized.fault && order.faults && order.faults.length > 0) ? order.faults.map((fault, index) => {
                        if (index === order.faults.length - 1) {
                            return fault
                        }
                        return fault + ' - '
                    }) : ''}

                    ${order.dontRecognized.fault ? order.dontRecognized.fault : ''}
                    </th>
                </tr>

                ${(!order.dontRecognized.fault && order.fault_details) ? `<tr style="border: 1px solid #292929;">
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Descripción de la avería:</th>
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.fault_details}</th>
                </tr>` : ''}
            </tbody >
        </table >

    <footer
        style="width: 100%; background-color: #1b6bb1; padding: 20px; color: white; box-sizing: border-box;">
        <p style="font-size: 1.2rem; text-align: center;">Este email fue enviado por el equipo de Empetel</p>

        <ul style="display: flex; width: 100%; list-style: none; justify-content: center; padding: 0;">
            <li style="font-size: 1.2rem; margin: 20px;">
                <a href="https://www.facebook.com/empetel" style="color: white; text-decoration: none;">
                    <img src="${process.env.BASE_URL + '/static/facebook.png'}" alt="facebook"
                        style="width: 2em; height: 2em;">
                </a>
            </li>
            <li style="font-size: 1.2rem; margin: 20px;">
                <a href="https://www.instagram.com/empetel" style="color: white; text-decoration: none;">
                    <img src="${process.env.BASE_URL + '/static/instagram.png'}" alt="instagram"
                        style="width: 2em; height: 2em;">
                </a>
            </li>
            <li style="font-size: 1.2rem; margin: 20px;">
                <a href="https://www.empetel.es" style="color: white; text-decoration: none;">
                    <img src="${process.env.BASE_URL + '/static/web.png'}" alt="web"
                        style="width: 2em; height: 2em;">
                </a>
            </li>
        </ul>
    </footer>
        </section >
    </div >
</ >
    `
}

module.exports = {
    requirePresupuestEmailUser,
    requirePresupuestEmailAdmin
};