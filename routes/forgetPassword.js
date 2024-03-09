// forgetPassword.js

const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.get('/', (req, res) => {
    res.render('forgetPassword', { error: null }); // Pass error as null initially
});

// Generate a new password consisting of random alphanumeric characters
function generateNewPassword() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const passwordLength = 8;
    let newPassword = '';
    for (let i = 0; i < passwordLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        newPassword += characters[randomIndex];
    }
    return newPassword;
}



router.post('/', (req, res) => {
    const { author_email } = req.body;

    // Check if the author with the provided email exists
    const authorQuery = 'SELECT * FROM authors WHERE author_email = ?';
    db.get(authorQuery, [author_email], (err, author) => {
        if (err) {
            console.error('Error fetching author:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (!author) {
            return res.status(404).send('Author not found');
        }

        // Generate a new password or reset token
        const newPassword = generateNewPassword();

        // Update the author's password in the database
        const updateQuery = 'UPDATE authors SET author_password = ? WHERE author_email = ?';
        db.run(updateQuery, [newPassword, author_email], (updateErr) => {
            if (updateErr) {
                console.error('Error updating author password:', updateErr);
                return res.status(500).send('Internal Server Error');
            }

            // Send an email to the author with the new password
            const transporter = nodemailer.createTransport({
                // Configure your email service provider here
            });

            const mailOptions = {
                from: 'your@email.com',
                to: author_email,
                subject: 'Password Reset',
                text: `Your new password is: ${newPassword}`
            };

            transporter.sendMail(mailOptions, (emailErr) => {
                if (emailErr) {
                    console.error('Error sending email:', emailErr);
                    return res.status(500).send('Internal Server Error');
                }
                return res.status(200).send('Password reset successful. Check your email for the new password.');
            });
        });
    });
});

module.exports = router;
