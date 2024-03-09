/*** I wrote this code */

/**
 * register.js
 */

const express = require('express');
const Joi = require('joi');
const router = express.Router();

/**
 * @desc Displays registration page.
 */

router.get('/', (req, res) => {
    res.render('register');
  });
  
/**
 * @desc  Add a new author to the database based on email and password from the submitted form.
 */
  
  router.post('/', (req, res) => {
    // Define a Joi schema for input validation
    const schema = Joi.object({
      author_email: Joi.string().email().required(),
      password: Joi.string().pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9]).{8,30}$')).required()
    });
  
    // Validate the request body against the schema
    const { error } = schema.validate(req.body);
  
    if (error) {
      console.error('Error creating new author:', error);
      return res.status(409).send('Registration failed.<a href="/register">Go back to registration</a>');
    }
  
    const { author_email, password } = req.body;
  
    // Checking if the email already exists in the database
    const checkEmailQuery = 'SELECT * FROM authors WHERE author_email = ?';
    db.get(checkEmailQuery, [author_email], function (err, existingAuthor) {
      if (err) {
        console.error('Error checking existing author:', err);
        return res.status(500).send('Internal Server Error');
      }
  
      if (existingAuthor) {
        // Author with the same email already exists
        return res.status(409).send('Registration failed. Email already exists <a href="/register">Go back to registration</a>');
      }
  
  
      // If email is unique, proceed with registration
      const insertAuthorQuery = 'INSERT INTO authors (author_email, author_password) VALUES (?, ?)';
      db.run(insertAuthorQuery, [author_email, password], function (err) {
        if (err) {
          console.error('Error creating new author:', err);
          return res.status(500).send('Internal Server Error');
        }
  
        res.redirect('/login');
      });
    });
  });

  module.exports = router;

  /** End of my code */