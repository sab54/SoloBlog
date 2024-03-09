/*** I wrote this code */

/**
logout.js
 */
const express = require('express');
const Joi = require('joi');
const router = express.Router();

/**
 * @desc  logout the session and redirects to homepage.
 */

router.get('/', (req, res) => {
    // Perform any necessary cleanup or logging out logic
    req.session.destroy();
    // Redirect to the homepage
    res.redirect('/');
});

module.exports = router;

/** End of my code */