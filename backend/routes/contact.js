const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Create reusable transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Test connection
transporter.verify((error, success) => {
    if (error) {
        console.log('Error verifying email connection:', error);
    } else {
        console.log('Server is ready to take our messages');
    }
});

// Send contact email
router.post('/send', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate input
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }

        // Email content
        const mailOptions = {
            from: email,
            to: process.env.ADMIN_EMAIL,
            subject: `New Contact Form Submission - ${subject}`,
            text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
            html: `
                <h3>Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong> ${message}</p>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: 'Message sent successfully! We will get back to you soon.'
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            message: 'Error sending message. Please try again later.'
        });
    }
});

module.exports = router;
