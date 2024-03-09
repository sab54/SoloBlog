/* I wrote this code /

/**
auth.js
This is called when  the routes can be used only after successful login.
Checks if the user is logged in or not. If logged in provide access to /author routes
 */

const isAuthenticated = (req, res, next) => {
    
    // Allow access to the login and home pages without authentication
    if (req.path === '/login' || req.path === '/author/home') {
        return next();
    }

    // Check if the user is authenticated
    if (req.session && req.session.authenticated) {
        return next();
    }

    // Redirect to the login page if not authenticated
    res.redirect('/login');
};

module.exports = {isAuthenticated};

/** End of my code */
