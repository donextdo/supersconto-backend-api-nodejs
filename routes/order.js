const express = require('express')

const router = express.Router()
const {
    createOrder,
    getAllOrders,
    getOrdersByShop,
    getAllOrderItems,
    getOrderItemsByOrder,
    getOrdersByShopId
} = require('../controllers/order')
const multer = require("multer");
const nodemailer = require("nodemailer");
const upload = multer({storage: multer.memoryStorage()});


router.post('/', createOrder)

router.get('/', getAllOrders)

router.post('/by-shop', getOrdersByShop)

router.get('/order-items', getAllOrderItems)

router.post('/order-items/by-order', getOrderItemsByOrder)

router.get('/shops/:shopId/orders', getOrdersByShopId)

router.post('/send-email', upload.single('pdf'), (req, res) => {
    const {originalname, buffer} = req.file;

    // Configure nodemailer with your email service credentials
    const transporter = nodemailer.createTransport({
        service: 'gmail', // e.g., 'gmail'
        auth: {
            user: 'donextweb@gmail.com',
            pass: 'nnpyrrlvmbkismus',
        },
    });

    // Create the email message
    const mailOptions = {
        from: 'donextweb@gmail.com',
        to: req.body.email,
        subject: 'Shopping List PDF',
        text: 'Attached is the shopping list PDF.',
        attachments: [
            {
                filename: originalname,
                content: buffer,
            },
        ],
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).json({error: 'Failed to send email'});
        } else {
            console.log('Email sent:', info.response);
            res.json({message: 'Email sent successfully'});
        }

    });
});

module.exports = router