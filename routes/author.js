/*** I wrote this code */

/**
author.js
 */
const express = require('express');
//validation library added.
const Joi = require('joi');
const router = express.Router();
//authentication is added.
const {isAuthenticated} = require('../modules/auth');

// Protect the entire /author route with isAuthenticated middleware
router.use(isAuthenticated);

/**
 * @desc Displays author home page
 */

router.get('/home', (req, res) => {
  // Define the query to retrieve draft articles for the specified user
  const draftQuery = 'SELECT * FROM articles WHERE published_at IS NULL AND author_id=?';
   // Define the query to retrieve published articles for the specified user
  const publishedQuery = 'SELECT * FROM articles WHERE published_at IS NOT NULL AND author_id=?';
   // Define the query to retrieve authors for the specified email
  const authorQuery = 'SELECT * FROM authors WHERE author_email = ?';
   // gets emails for the current session
  const authorEmail = req.session.author_email;

  db.get(authorQuery, [authorEmail], function (err, author) {
    if (err) {
      console.error('Error fetching author:', err);
      return res.status(500).send('Internal Server Error');
    }
    //Execute the query and render the page with the draft articles.
    db.all(draftQuery, [author.authors_id] ,function (err, draftArticles) {
      if (err) throw err;
      // Execute the query and render the page with the draft articles.
      db.all(publishedQuery,[author.authors_id], function (err, publishedArticles) {
        if (err) throw err;

        // Pass data to the template, including the author's name
        res.render('author-home', {
          isAuthenticated: req.session.authenticated,
          authorsName: author.authorsName,
          blogTitle: author.blogTitle, 
          draftArticles: draftArticles,
          publishedArticles: publishedArticles,
        });
      });
    });
  });
});

/**
 * @desc Articles are deleted, published and unpublished. 
 */

router.post('/home', (req, res) => {
  const action = req.body.action;
  const articlesId = req.body.articles_id;
  // deletes articles based on articles id.
  if (action === 'delete') {
    // Handle delete action
    const deleteQuery = 'DELETE FROM articles WHERE articles_id = ?';
    db.run(deleteQuery, [articlesId], function (err) {
      if (err) {
        console.error('Error deleting article:', err);
        return res.status(500).send('Internal Server Error');
      }
      res.redirect('/author/home');
    });    
  } 
  // publish articles.
  else if (action === 'publish') {
    // Handle publish action
    const publishQuery = 'UPDATE articles SET published_at = CURRENT_TIMESTAMP WHERE articles_id = ?';
    db.run(publishQuery, [articlesId], function (err) {
      if (err) {
        console.error('Error publishing article:', err);
        return res.status(500).send('Internal Server Error');
      }
      res.redirect('/author/home');
    });
  } else if (action === 'unpublish') {
    // Handle unpublish action
    const unpublishQuery = 'UPDATE articles SET published_at = NULL WHERE articles_id = ?';
    db.run(unpublishQuery, [articlesId], function (err) {
      if (err) {
        console.error('Error unpublishing article:', err);
        return res.status(500).send('Internal Server Error');
      }
      res.redirect('/author/home');
    });
  }  else {
    // Handle other actions if needed
    res.status(400).send('Invalid action');
  }
});

/**
 * @desc Displays settings page for the author based on email id 
 */

router.get('/settings', (req, res) => {
  // Fetch author information
  const authorQuery = 'SELECT * FROM authors WHERE author_email = ?';
  const authorEmail = req.session.author_email;

  // Fetch data from the database for the author
  db.get(authorQuery, [authorEmail], function (err, author) {
    if (err) {
      console.error('Error fetching author:', err);
      return res.status(500).send('Internal Server Error');
    }

    // Pass data to the template
    res.render('author-settings', {
      blogTitle: author.blogTitle,
      authorsName: author.authorsName
    });
  });
});

/**
 * @desc Adds blog title, authors name, author id to the articles 
 */

router.post('/settings', (req, res, next) => {
  const blogTitle = req.body.blogTitle;
  const authorsName = req.body.authorsName;

      // Defines a Joi schema for input validation.
      const schema = Joi.object({
        blogTitle: Joi.string().required(),
        authorsName: Joi.string().required()
      });
    
      // Validate the request body against the schema
      const { error } = schema.validate(req.body);
    
      if (error) {
        console.error('Error updating settings page:', error);
        return res.status(400).redirect('/author/settings');
      }
  
  const authorQuery = 'SELECT * FROM authors WHERE author_email = ?';
  const authorEmail = req.session.author_email;
    // Fetch data from the database for the authoremail
  db.get(authorQuery, [authorEmail], function (err, author) {
    if (err) {
      console.error('Error fetching author:', err);
      return res.status(500).send('Internal Server Error');
    }
    // Update the author settings in the database
    const updateQuery = 'UPDATE authors SET blogTitle = ?, authorsName = ? WHERE authors_id = ?';
    // Execute the query and render the page with the results
    db.run(updateQuery, [blogTitle, authorsName, author.authors_id], function (err) {
      if (err) {
        console.error('Error updating author settings:', err);
        next(err);
      } else {
        res.redirect('/author/home');
      }
    });
  });
});

/**
 * @desc Displays edit articles page for the author based on article id 
 */

router.get('/edit-article/:articles_id', (req, res, next) => {
  const articlesId = req.params.articles_id;

  // Fetch article details from the database
  const articleQuery = 'SELECT * FROM articles WHERE articles_id = ?';
  db.get(articleQuery, [articlesId], function (err, article)  {
    if (err) {
      console.error('Error fetching article for editing:', err);
      next(err);
    } else {
      // Render the edit article page with article details
      res.render('author-edit', { article: article });
    }
  });
});

/**
 * @desc Add articles to the database based on article id 
 */

router.post('/edit-article/:articles_id', (req, res, next) => {
  const articlesId = req.params.articles_id;
  const newTitle = req.body.articles_title;
  const newContent = req.body.articles_content;
  
  const updateQuery = 'UPDATE articles SET articles_title = ?, articles_content = ?, modified_at = CURRENT_TIMESTAMP WHERE articles_id = ?';
  
  // Execute the query and render the page with the results
  db.run(updateQuery, [newTitle, newContent, articlesId], function (err) {
    if (err) {
      console.error('Error updating article:', err);
      next(err);
    } else {
      res.redirect(`/author/home`);
    }
  });
});

/**
 * @desc Displays new draft articles page for the author
 */

router.get('/create-draft', (req, res) => {
  // Insert a new draft article into the database
  const insertQuery = 'INSERT INTO articles (articles_title, articles_content, created_at, author_id) VALUES (?, ?, CURRENT_TIMESTAMP, ?)';
  const defaultTitle = 'New Draft'; // You can set a default title for new drafts
  const defaultContent = 'Write your content here'; // You can set a default content for new drafts
  const authorEmail = req.session.author_email; // Use the author's email ID from the session

  // Fetch the author's ID based on the email
  const authorIdQuery = 'SELECT authors_id FROM authors WHERE author_email = ?';

  db.get(authorIdQuery, [authorEmail],
    function (err, result) {
      if (err) {
        console.error('Error fetching author ID:', err);
        return res.status(500).send('Internal Server Error');
      }

    const authorId = result.authors_id;

    db.run(insertQuery, [defaultTitle, defaultContent, authorId], function (err) {
      if (err) {
        console.error('Error creating new draft:', err);
        return res.status(500).send('Internal Server Error');
      } else {
        // Redirect to the edit page for the newly created draft
        res.redirect(`/author/edit-article/${this.lastID}`);
      }
    });
  });
});

module.exports = router;

/** End of my code */