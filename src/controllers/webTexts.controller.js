const WebTexts = require('../models/webTexts.model');

const webTextsCtrl = {};

webTextsCtrl.getWebTexts = async (req, res) => {
    try {
        const webTexts = await WebTexts.findOne();
        res.status(200).json({
            status: true,
            webTexts
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Error: ' + error
        });
    }
}

webTextsCtrl.updateWebTexts = async (req, res) => {
    try {
        const body = req.body;
        const webTexts = await WebTexts.findOne();

        if(req.body.aboutsUs) {
            webTexts.aboutUs = body.aboutUs;
        }

        if(req.body.whyUs) {
            webTexts.whyUs = body.whyUs;
        }

        if(req.body.garanties) {
            webTexts.garanties = body.garanties;
        }

        if(req.body.functioning) {
            webTexts.functioning = body.functioning;
        }

    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Error: ' + error
        });
    }
}

module.exports = webTextsCtrl;