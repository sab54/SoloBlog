/**  I wrote this code */

/**
 * reader.js.
 */

const express = require('express');
const router = express.Router();

/**
 * @desc  Displays reader homepage.
 */

router.get('/home', (req, res) => {
    // Fetch data from the database for the Reader - Home Page
    const query = 'SELECT authorsName, blogTitle FROM authors'; // Adjust the query as per your schema
    db.get(query, function (err, authorInfo) {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Fetch published articles with author and blog title information
        const publishedQuery = `
            SELECT articles.*, authors.authorsName, authors.blogTitle
            FROM articles
            JOIN authors ON articles.author_id = authors.authors_id
            WHERE articles.published_at IS NOT NULL
            ORDER BY articles.published_at DESC;
        `;
        // Execute the query and render the page with the published  articles
        db.all(publishedQuery, function (err, publishedArticles) {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }
            //render the page with the blogTitle, authorsName , publishedArticles.
            res.render('reader-home', {
                blogTitle: authorInfo.blogTitle,
                authorsName: authorInfo.authorsName,
                publishedArticles: publishedArticles
            });
        });
    });
});

/**
 * @desc  Displays reader article page
 */

router.get('/article', (req, res) => {
    const articleId = req.query.id;

    // Query selects author name, blogTitle from authors and article details
    const query = `
        SELECT authors.authorsName, articles.*
        FROM authors
        JOIN articles ON authors.authors_id = articles.author_id
        WHERE articles.articles_id = ?;
    `;

    db.get(query, [articleId], function (err, article) {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }        

        // Fetch comments for the article
        const commentsQuery = 'SELECT * FROM comments WHERE article_id = ? ORDER BY created_at DESC';

        db.all(commentsQuery, [articleId], function (err, comments) {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            // Render the page with articles, comments, blogTitle, authorName, and reads count
            res.render('reader-article', {
                article: article,
                comments: comments,
            });
        });
    });
});

/**
 * @desc Adds comments to this article based on article id 
 */

router.post('/article/:id/comment', (req, res) => {
    const articleId = req.params.id;
    const commentContent = req.body.commentContent;
    const commentName = req.body.commentName;

    // Insert the new comment into the database
    const insertCommentQuery = 'INSERT INTO comments (article_id, comment_content, comment_name, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)';
    db.run(insertCommentQuery, [articleId, commentContent, commentName], function (err)  {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Redirect back to the article page after submitting the comment
        res.redirect(`/reader/article?id=${articleId}`);
    });
    
});

/**
 * @desc Adds likes to this article based on article id 
 */

// Handle like button submission
router.post('/article/:id/like', (req, res) => {
    const articleId = req.params.id;

    //database update logic to increment the likes for the specified article
    const updateLikesQuery = 'UPDATE articles SET likes = likes + 1 WHERE articles_id = ?';
    db.run(updateLikesQuery, [articleId], function (err) {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Redirect back to the article page after liking
        res.redirect(`/reader/article?id=${articleId}`);
    });
});

/**
 * @desc Adds reads to this article based on article id 
 */


// Handle view button submission
router.get('/article/:id/view', (req, res) => {
    const articleId = req.params.id;
    
    // Fetch reads for the article
    // database update logic to increment the reads for the specified article
    const updateReadsQuery = 'UPDATE articles SET reads = reads + 1 WHERE articles_id = ?';
    db.run(updateReadsQuery, [articleId], function (err) {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        // Redirect back to the article page after liking
        res.redirect(`/reader/article?id=${articleId}`);
    });
});

module.exports = router;

/** End of my code */


