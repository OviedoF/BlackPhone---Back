const path = require('path');
const Status = require(path.join(__dirname, '..', 'models', 'Status.model'));
require('dotenv').config();

const createInitialStatus = async () => {
    try {
        const status = await Status.findOne();

        if (!status) {
            const newStatus = new Status({
                name: 'En espera',
                message: 'En espera',
                initial: true
            });

            await newStatus.save();

            console.log('[SEED] Initial status created successfully! ❤️');
        };
    } catch (error) {
        console.log(error);
    }
}

module.exports = createInitialStatus;