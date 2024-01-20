const recognizedLocalEmails = async ({ _doc: order}) => {
    console.log(order)
    return `
    <body
    style="display: flex; align-items: center; justify-content: center; flex-direction: column; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <div style="width: 100%;">
        <section class="order" style="width:100%;height:100%;color:#292929;">
            <div class="header" style="background-color: #28a745; width: 100%; padding: 20px; box-sizing: border-box;">
                <img src="https://static-00.iconduck.com/assets.00/success-icon-512x512-qdg1isa0.png" alt="order"
                    style="width: 100%;height:150px;object-fit: contain;">
                <h2
                    style="color: white; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center;">
                    Hemos recibido tu pedido!</h2>
            </div>

            <p style="text-align: center;font-size: 1.2rem; padding: 20px;">
                ¡Hola! Gracias por confiar en nosotros para revisar tu dispositivo. ¡En Blackphone nos encargaremos de que tu terminal quede como nuevo! 
            </p>

            <p style="text-align: center;font-size: 1.2rem; padding: 20px;">
                Puedes seguir tu pedido en el siguiente link: 
                <a href="https://blackphone.es/seguir-mi-reparacion" target="_blank">
                https://blackphone.es/seguir-mi-reparacion
                </a>
            </p>

            <p style="text-align: center;font-size: 1.2rem; padding: 20px;">
                Y usa el siguiente código para hacer el seguimiento de tu pedido: 
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
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Email:</th>
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.contact}</th>
                    </tr>

                    ${order.phone ? `<tr style="border: 1px solid #292929;">
                            <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Teléfono:</th>
                            <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.phone}</th>
                        </tr>` : ''}

                    <tr style="border: 1px solid #292929;">
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Provincia:</th>
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.province}</th>
                    </tr>

                    <tr style="border: 1px solid #292929;">

                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Municipio:</th>
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.city}</th>
                    </tr>

                    <tr style="border: 1px solid #292929;">
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Marca:</th>
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.brand.name}</th>
                    </tr>

                    <tr style="border: 1px solid #292929;">
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Modelo:</th>
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.model}</th>
                    </tr>

                    <tr style="border: 1px solid #292929;">
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Averías:</th>
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">
                        ${order.faults.length > 0 && order.faults.map((fault, index) => {
                            if (index === order.faults.length - 1) {
                                return fault.name
                            }
                            return fault.name + ' - '
                        })}
                        </th>
                    </tr>

                    ${order.fault_details ? `<tr style="border: 1px solid #292929;">
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Descripción de la avería:</th>
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.fault_details}</th>
                    </tr>` : ''}

                    ${order.additionalCosts.length > 0 && order.additionalCosts.map(additionalCost => {
            return `<tr style="border: 1px solid #292929;">
                               <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Costo adicional: ${additionalCost.name}</th>
                               <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${additionalCost.cost}</th>
                            </tr>`
        })}

                    <tr style="border: 1px solid #292929;">
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Costo total:</th>
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.amount}</th>
                    </tr>

                    <tr style="border: 1px solid #292929;">
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Método de búsqueda del dispositivo:</th>
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">
                        ${order.method === "retiro" ? 'Búsqueda en domicilio' : 'Llevar a local'}
                        </th>
                    </tr>
                    
                   ${order.date ? `<tr style="border: 1px solid #292929;">
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Fecha:</th>
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.date}</th>
                    </tr>` : ''}

                    ${order.hour ? `<tr style="border: 1px solid #292929;">
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Hora:</th>
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.hour}</th>
                    </tr>` : ''}

                    ${order.address ? `<tr style="border: 1px solid #292929;">
                            <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Dirección:</th>
                            <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.address}</th>
                        </tr>` : ''}

                </tbody >
            </table >

    <footer
        style="width: 100%; background-color: #1b6bb1; padding: 20px; color: white; box-sizing: border-box;">
        <p style="font-size: 1.2rem; text-align: center;">Este email fue enviado por el equipo de Blackphone</p>

        <ul style="display: flex; width: 100%; list-style: none; justify-content: center; padding: 0;">
            <li style="font-size: 1.2rem; margin: 20px;">
                <a href="https://www.instagram.com/blackphonegandia" style="color: white; text-decoration: none;">
                    <img src="${process.env.BASE_URL + '/static/instagram.png'}" alt="instagram"
                        style="width: 2em; height: 2em;">
                </a>
            </li>
            <li style="font-size: 1.2rem; margin: 20px;">
                <a href="https://blackphoneservice.com/" style="color: white; text-decoration: none;">
                    <img src="${process.env.BASE_URL + '/static/web.png'}" alt="web"
                        style="width: 2em; height: 2em;">
                </a>
            </li>
        </ul>
    </footer>
        </section >
    </div >
</body >
    `
}

const recognizedLocalEmailAdmin = async ({_doc: order}) => {
    return `
    <body
    style="display: flex; align-items: center; justify-content: center; flex-direction: column; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <div style="width: 100%;">
        <section class="order" style="width:100%;height:100%;color:#292929;">
            <div class="header" style="background-color: #28a745; width: 100%; padding: 20px; box-sizing: border-box;">
                <img src="https://static-00.iconduck.com/assets.00/success-icon-512x512-qdg1isa0.png" alt="order"
                    style="width: 100%;height:150px;object-fit: contain;">
                <h2
                    style="color: white; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center;">
                    Has recibido un pedido!</h2>
            </div>

            <p style="text-align: center;font-size: 1.2rem; padding: 20px;">
                ¡Hola! Has recibido un pedido de revisión de dispositivo. Un cliente confía en ti para que revises su terminal.
            </p>

            <p style="text-align: center;font-size: 1.2rem; padding: 20px;">
                Puedes seguir el pedido en el siguiente link: 
                <a href="https://blackphone.es/seguir-mi-reparacion" target="_blank">
                https://blackphone.es/seguir-mi-reparacion
                </a>
            </p>

            <p style="text-align: center;font-size: 1.2rem; padding: 20px;">
                Y usa el siguiente código para hacer el seguimiento del pedido: 
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
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Email:</th>
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.contact}</th>
                    </tr>

                    ${order.phone ? `<tr style="border: 1px solid #292929;">
                            <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Teléfono:</th>
                            <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.phone}</th>
                        </tr>` : ''}

                    <tr style="border: 1px solid #292929;">
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Provincia:</th>
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.province}</th>
                    </tr>

                    <tr style="border: 1px solid #292929;">
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Municipio:</th>
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.city}</th>
                    </tr>

                    <tr style="border: 1px solid #292929;">
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Marca:</th>
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.brand.name}</th>
                    </tr>

                    <tr style="border: 1px solid #292929;">
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Modelo:</th>
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.model}</th>
                    </tr>

                    <tr style="border: 1px solid #292929;">
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Averías:</th>
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">
                        ${order.faults.length > 0 && order.faults.map((fault, index) => {
                            if (index === order.faults.length - 1) {
                                return fault.name
                            }
                            return fault.name + ' - '
                        })}
                        </th>
                    </tr>

                    ${order.fault_details ? `<tr style="border: 1px solid #292929;">
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Descripción de la avería:</th>
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.fault_details}</th>
                    </tr>` : ''}

                    ${order.additionalCosts.length > 0 && order.additionalCosts.map(additionalCost => {
            return `<tr style="border: 1px solid #292929;">
                               <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Costo adicional: ${additionalCost.name}</th>
                               <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${additionalCost.cost}</th>
                            </tr>`
        })}

                    <tr style="border: 1px solid #292929;">
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Costo total:</th>
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.amount}</th>
                    </tr>

                    <tr style="border: 1px solid #292929;">
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Método de búsqueda del dispositivo:</th>
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">
                        ${order.method === "retiro" ? 'Búsqueda en domicilio' : 'Llevar a local'}
                        </th>
                    </tr>
                    
                   ${order.date ? `<tr style="border: 1px solid #292929;">
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Fecha:</th>
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.date}</th>
                    </tr>` : ''}

                    ${order.hour ? `<tr style="border: 1px solid #292929;">
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Hora:</th>
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.hour}</th>
                    </tr>` : ''}

                    ${order.address ? `<tr style="border: 1px solid #292929;">
                            <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Dirección:</th>
                            <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.address}</th>
                        </tr>` : ''}

                </tbody >
            </table >

    <footer
        style="width: 100%; background-color: #1b6bb1; padding: 20px; color: white; box-sizing: border-box;">
        <p style="font-size: 1.2rem; text-align: center;">Este email fue enviado automáticamente por el servidor de blackphoneservice.com</p>

        <ul style="display: flex; width: 100%; list-style: none; justify-content: center; padding: 0;">
            <li style="font-size: 1.2rem; margin: 20px;">
                <a href="https://www.instagram.com/blackphonegandia" style="color: white; text-decoration: none;">
                    <img src="${process.env.BASE_URL + '/static/instagram.png'}" alt="instagram"
                        style="width: 2em; height: 2em;">
                </a>
            </li>
            <li style="font-size: 1.2rem; margin: 20px;">
                <a href="https://blackphoneservice.com/" style="color: white; text-decoration: none;">
                    <img src="${process.env.BASE_URL + '/static/web.png'}" alt="web"
                        style="width: 2em; height: 2em;">
                </a>
            </li>
        </ul>
    </footer>
        </section >
    </div >
</body >
    `
}

const recognizedOutsideEmails = async (order) => {
    return `
    <body
    style="display: flex; align-items: center; justify-content: center; flex-direction: column; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <div style="width: 100%;">
        <section class="order" style="width:100%;height:100%;color:#292929;">
            <div class="header" style="background-color: #28a745; width: 100%; padding: 20px; box-sizing: border-box;">
                <img src="https://static-00.iconduck.com/assets.00/success-icon-512x512-qdg1isa0.png" alt="order"
                    style="width: 100%;height:150px;object-fit: contain;">
                <h2
                    style="color: white; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center;">
                    Hemos recibido tu pedido!</h2>
            </div>

            <p style="text-align: center;font-size: 1.2rem; padding: 20px;">
                ¡Hola! Gracias por confiar en nosotros para revivir tu terminal. ¡En Blackphone nos encargaremos de que tu terminal quede como nuevo! 
            </p>

            <p style="text-align: center;font-size: 1.2rem; padding: 20px;">
                Puedes seguir tu pedido en el siguiente link: 
                <a href="https://blackphone.es/seguir-mi-reparacion" target="_blank">
                https://blackphone.es/seguir-mi-reparacion
                </a>
            </p>

            <p style="text-align: center;font-size: 1.2rem; padding: 20px;">
                Y usa el siguiente código para hacer el seguimiento de tu pedido: 
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
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Provincia:</th>
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.province}</th>
                    </tr>

                    <tr style="border: 1px solid #292929;">

                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Municipio:</th>
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.city}</th>
                    </tr>

                    <tr style="border: 1px solid #292929;">
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Marca:</th>
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.brand}</th>
                    </tr>

                    <tr style="border: 1px solid #292929;">
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Modelo:</th>
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.model}</th>
                    </tr>

                    <tr style="border: 1px solid #292929;">
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Averías:</th>
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">
                        ${order.faults.length > 0 && order.faults.map((fault, index) => {
        if (index === order.faults.length - 1) {
            return fault
        }
        return fault + ' - '
    })}
                        </th>
                    </tr>

                    ${order.fault_details ? `<tr style="border: 1px solid #292929;">
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Descripción de la avería:</th>
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.fault_details}</th>
                    </tr>` : ''}

                    ${order.additionalCosts.length > 0 && order.additionalCosts.map(additionalCost => {
        return `<tr style="border: 1px solid #292929;">
                                            <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Costo adicional: ${additionalCost.name}</th>
                                            <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${additionalCost.cost}</th>
                                        </tr>`
    })}

                    <tr style="border: 1px solid #292929;">
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Costo total:</th>
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.budget}</th>
                    </tr>

                    <tr style="border: 1px solid #292929;">
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Método de búsqueda del dispositivo:</th>
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">
                        ${Object.keys(order.takeToTheLocalData).length === 0 ? 'Búsqueda en domicilio' : 'Llevar a local'}
                        </th>
                    </tr>
                    
                    ${Object.keys(order.takeToTheLocalData).length > 0 ? `<tr style="border: 1px solid #292929;">
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Fecha:</th>
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.takeToTheLocalData.date}</th>
                    </tr>` : ''}

                    ${Object.keys(order.takeToTheLocalData).length > 0 ? `<tr style="border: 1px solid #292929;">
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Hora:</th>
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.takeToTheLocalData.hour}</th>
                    </tr>` : ''}

                    ${Object.keys(order.takeToTheLocalData).length === 0 ? `<tr style="border: 1px solid #292929;">
                           <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Dirección:</th>
                            <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.goToTheHomeData.address}</th>
                        </tr>` : ''}
                    
                    ${Object.keys(order.takeToTheLocalData).length === 0 ? order.goToTheHomeData.additionalInfo ? `<tr style="border: 1px solid #292929;">
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Información adicional:</th>
                         <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.goToTheHomeData.additionalInfo}</th>
                     </tr>` : '' : ''}
                    
                     ${Object.keys(order.takeToTheLocalData).length === 0 ? `<tr style="border: 1px solid #292929;">
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Hora:</th>
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.goToTheHomeData.hour || "-"}</th>
                    </tr>` : ''}

                    ${(Object.keys(order.takeToTheLocalData).length === 0 && order.goToTheHomeData.date) ? `<tr style="border: 1px solid #292929;">
                            <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Fecha:</th>
                            <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.goToTheHomeData.date}</th>
                        </tr>` : ''}

                </tbody >
            </table >

    <footer
        style="width: 100%; background-color: #1b6bb1; padding: 20px; color: white; box-sizing: border-box;">
        <p style="font-size: 1.2rem; text-align: center;">Este email fue enviado por el equipo de Blackphone</p>

        <ul style="display: flex; width: 100%; list-style: none; justify-content: center; padding: 0;">
            <li style="font-size: 1.2rem; margin: 20px;">
                <a href="https://www.instagram.com/blackphonegandia" style="color: white; text-decoration: none;">
                    <img src="${process.env.BASE_URL + '/static/instagram.png'}" alt="instagram"
                        style="width: 2em; height: 2em;">
                </a>
            </li>
            <li style="font-size: 1.2rem; margin: 20px;">
                <a href="https://blackphoneservice.com/" style="color: white; text-decoration: none;">
                    <img src="${process.env.BASE_URL + '/static/web.png'}" alt="web"
                        style="width: 2em; height: 2em;">
                </a>
            </li>
        </ul>
    </footer>
        </section >
    </div >
</body >
    `
}

const recognizedOutsideEmailAdmin = async (order) => {
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
                        ¡Has recibido un pedido en ${order.province} ${order.city}!</h2>
            </div>

            <p style="text-align: center;font-size: 1.2rem; padding: 20px;">
                ¡Has recibido un pedido en ${order.province} ${order.city} por parte de: ${order.name}!
            </p>

            <p style="text-align: center;font-size: 1.2rem; padding: 20px;">
                Puedes seguir tu pedido en el siguiente link: 
                <a href="https://blackphone.es/seguir-mi-reparacion" target="_blank">
                https://blackphone.es/seguir-mi-reparacion
                </a>
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
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.city}</th>
                </tr>

                <tr style="border: 1px solid #292929;">
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Marca:</th>
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.brand}</th>
                </tr>

                <tr style="border: 1px solid #292929;">
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Modelo:</th>
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.model}</th>
                </tr>

                <tr style="border: 1px solid #292929;">
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Averías:</th>
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">
                    ${order.faults.length > 0 && order.faults.map((fault, index) => {
        if (index === order.faults.length - 1) {
            return fault
        }
        return fault + ' - '
    })}
                    </th>
                </tr>

                ${order.fault_details ? `<tr style="border: 1px solid #292929;">
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Descripción de la avería:</th>
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.fault_details}</th>
                </tr>` : ''}

                ${order.additionalCosts.length > 0 && order.additionalCosts.map(additionalCost => {
        return `<tr style="border: 1px solid #292929;">
                                <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Costo adicional: ${additionalCost.name}</th>
                                <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${additionalCost.cost}</th>
                    </tr>`
    })}

                <tr style="border: 1px solid #292929;">
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Costo total:</th>
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">€${parseFloat(order.budget).toFixed(2)}</th>
                </tr>

                <tr style="border: 1px solid #292929;">
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Método de búsqueda del dispositivo:</th>
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">
                    ${Object.keys(order.takeToTheLocalData).length === 0 ? 'Búsqueda en domicilio' : 'Llevar a local'}
                    </th>
                </tr>
                
                ${Object.keys(order.takeToTheLocalData).length > 0 ? `<tr style="border: 1px solid #292929;">
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Fecha:</th>
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.takeToTheLocalData.date}</th>
                </tr>` : ''}

                ${Object.keys(order.takeToTheLocalData).length > 0 ? `<tr style="border: 1px solid #292929;">
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Hora:</th>
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.takeToTheLocalData.hour}</th>
                </tr>` : ''}

                ${Object.keys(order.takeToTheLocalData).length === 0 ? `<tr style="border: 1px solid #292929;">
                       <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Dirección:</th>
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.goToTheHomeData.address}</th>
                    </tr>` : ''}

                ${Object.keys(order.takeToTheLocalData).length === 0 ? order.goToTheHomeData.additionalInfo ? `<tr style="border: 1px solid #292929;">
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Información adicional:</th>
                     <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.goToTheHomeData.additionalInfo}</th>
                 </tr>` : '' : ''}
                
                ${Object.keys(order.takeToTheLocalData).length === 0 ? `<tr style="border: 1px solid #292929;">
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Hora:</th>
                        <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.goToTheHomeData.hour || "-"}</th>
                    </tr>` : ''}

                ${(Object.keys(order.takeToTheLocalData).length === 0 && order.goToTheHomeData.date) ? `<tr style="border: 1px solid #292929;">
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">Fecha:</th>
                    <th style="text-align: center; padding: 10px;border-bottom: 1px solid #292929;height: 50px;">${order.goToTheHomeData.date}</th>
                </tr>` : ''}

            </tbody >
        </table >

    <footer
        style="width: 100%; background-color: #1b6bb1; padding: 20px; color: white; box-sizing: border-box;">
        <p style="font-size: 1.2rem; text-align: center;">Este email fue enviado por el equipo de Blackphone</p>

        <ul style="display: flex; width: 100%; list-style: none; justify-content: center; padding: 0;">
            <li style="font-size: 1.2rem; margin: 20px;">
                <a href="https://www.instagram.com/blackphonegandia" style="color: white; text-decoration: none;">
                    <img src="${process.env.BASE_URL + '/static/instagram.png'}" alt="instagram"
                        style="width: 2em; height: 2em;">
                </a>
            </li>
            <li style="font-size: 1.2rem; margin: 20px;">
                <a href="https://blackphoneservice.com/" style="color: white; text-decoration: none;">
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
    recognizedLocalEmails,
    recognizedLocalEmailAdmin,
    recognizedOutsideEmails,
    recognizedOutsideEmailAdmin
}