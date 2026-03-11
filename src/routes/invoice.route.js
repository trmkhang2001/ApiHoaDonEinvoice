const express = require("express");
const router = express.Router();
const sepayService = require("../services/sepay.service");

router.post("/create-invoice", async (req, res) => {

    try {

        const { name, phone, email } = req.body;

        if (!name || !phone || !email) {
            return res.status(400).json({
                message: "Missing customer info"
            });
        }

        const invoice = await sepayService.createInvoice({
            name,
            phone,
            email
        });

        res.json({
            success: true,
            data: invoice
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });
    }

});

module.exports = router;