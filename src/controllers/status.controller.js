const Status = require('../models/Status.model');

const statusCtrl = {};

statusCtrl.getStatus = async (req, res) => {
    try {
        const status = await Status.find();
        res.status(200).send({
            status: true,
            data: status
        });
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Error al obtener los estados'
        });
    }
}

statusCtrl.createStatus = async (req, res) => {
    try {
        const status = new Status(req.body);
        await status.save();

        res.status(200).send({
            status: true,
            message: 'Estado creado correctamente'
        });
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Error al crear el estado'
        });
    }
}

statusCtrl.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const statusUpdated = await Status.findByIdAndUpdate(id, req.body);

        if (statusUpdated) {
            res.status(200).send({
                status: true,
                message: 'Estado actualizado correctamente'
            });
            return;
        }

        res.status(404).send({
            status: false,
            message: 'Estado no encontrado'
        });
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Error al actualizar el estado'
        });
    }
}

statusCtrl.deleteStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const statusDeleted = await Status.findByIdAndDelete(id);

        if (statusDeleted) {
            res.status(200).send({
                status: true,
                message: 'Estado eliminado correctamente'
            });

            return;
        }

        res.status(404).send({
            status: false,
            message: 'Estado no encontrado'
        });
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Error al eliminar el estado'
        });
    }
}

module.exports = statusCtrl;
