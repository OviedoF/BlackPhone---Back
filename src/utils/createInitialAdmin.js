const path = require('path');
const User = require(path.join(__dirname, '..', 'models', 'user.model'));
require('dotenv').config();

const createInitialAdmin = async () => {
    try {
        const user = await User.findOne({ role: 'admin' });

        if (!user) {
            const newUser = new User({
                username: process.env.ADMIN_USERNAME,
                password: await User.encryptPassword(process.env.ADMIN_PASSWORD),
                email: process.env.ADMIN_EMAIL,
                role: 'admin'
            });

            await newUser.save();

            console.log('[SEED] Admin user created successfully! ❤️');
        };
    } catch (error) {
        console.log(error);
    }
}

module.exports = createInitialAdmin;