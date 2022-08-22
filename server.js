const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config()

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.post('/send', (req, res) => {
    try {
        const output = `
        <p>You have a new contact request</p>
        <h3>Contact Details</h3>
            <li>Name: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    `;

        const transporter = nodemailer.createTransport({
            host: 'smtp.zoho.eu',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            },
        })
        const mailOptions = {
            from: process.env.EMAIL,
            to: process.env.MY_EMAIL,
            subject: "New Contact Request",
            html: output
        }
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                return console.log(err);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        })
        res.send('Email sent');
    } catch (err) {
        console.log(err);
    }
})

app.listen(7070, () => {
    console.log('Server started on port 7070');
})