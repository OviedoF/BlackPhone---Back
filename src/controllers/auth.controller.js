const path = require('path');
const User = require(path.join(__dirname, '..', 'models', 'user.model'));
const jwt = require('jsonwebtoken');

const authController = {};

authController.signup = async (req, res) => {
    try {
        const { password } = req.body;

        const alreadyUser = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.email }
            ]
        });

        if (alreadyUser) return res.status(400).send({
            message: 'Nombre de usuario o correo electrónico ya existente',
            status: false
        });

        console.log(req.body);
        
        const newUser = new User({
            ...req.body,
            password: await User.encryptPassword(password)
        });

        const savedUser = await newUser.save();

        const token = jwt.sign({ _id: savedUser._id }, process.env.SECRET);

        res.status(200).send({
            message: 'Usuario registrado correctamente!',
            status: true,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: 'Error while creating user',
            error
        })
    }
}

authController.signin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({
            $or: [
                { username },
                { email: username }
            ]
        });

        if (!user) return res.status(400).send({
            message: 'Usuario no encontrado',
            status: false
        });

        const matchPassword = await User.comparePassword(password, user.password);

        if (!matchPassword) return res.status(401).send({
            message: 'Contraseña incorrecta',
            status: false
        });

        const token = jwt.sign({ _id: user._id }, process.env.SECRET);

        res.status(200).send({
            message: 'Sesión iniciada correctamente',
            status: true,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: 'Hubo un error al iniciar sesión.',
            error,
            status: false
        })
    }
}

authController.whoami = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];

        const decoded = jwt.verify(token, process.env.SECRET);

        const user = await User.findById(decoded._id, {
            password: 0,
        })

        if (!user) return res.status(404).send({
            message: 'Usuario no encontrado',
            status: false
        });

        res.status(200).send({
            message: 'Sesión inicializada correctamente',
            status: true,
            user
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: 'Hubo un error al obtener el usuario',
            error,
            status: false
        })
    }
}

module.exports = authController;