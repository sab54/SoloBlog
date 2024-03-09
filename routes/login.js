/*** I wrote this code */

/**
 * login.js
 */

const express = require('express');
const Joi = require('joi');
const router = express.Router();

/**
 * @desc Displays login page.
 */

router.get('/', (req, res) => {
    res.render('login');
});

/**
 * @desc Logins with a existing user based on email and password from the submitted form
 */

router.post('/', (req, res) => {
    //The schema is an joi library object with two properties: author_email and password.
    //Each property is defined using the Joi.string().required().
    //which specifies that both author_id and password must be strings.
    const schema = Joi.object({
        author_email : Joi.string().required(),
        password: Joi.string().required(),
    });

      //Validating an object against a schema.request body 
      //contains an object with properties like author_id and password.
    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).send('Invalid input');
    }

    const enteredAuthorEmail = req.body.author_email;
    const enteredPassword = req.body.password;

    //This query selects authors from email. 
    const authorQuery = 'SELECT * FROM authors WHERE author_email = ?';
    db.get(authorQuery, [enteredAuthorEmail], function (err, author) {
        if (err) {
            console.error('Error fetching author:', err);
            return res.status(500).send('Internal Server Error');
        }
        //This should maps with entered password with the data password.
        if (author && author.author_password === enteredPassword) {
            req.session.authenticated = true;
            req.session.author_email = enteredAuthorEmail;
            res.redirect('/author/home');
        } else {
            return res.status(409).send('Authentication failed.<a href="/login">Go back to login</a>');
        }
    });
});

module.exports = router;

/** End of my code */